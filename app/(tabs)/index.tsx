import CreateGroupModal from '@/components/CreateGroupModal';
import EmptyGroupsState from '@/components/EmptyGroupsState';
import ValidationError from '@/components/ValidationError';
import {API_CONFIG, validateApiConfig} from '@/config/api';
import {Colors} from '@/constants/Colors';
import {useGroupsValidation} from '@/hooks/useGroupsValidation';
import {IGroup, INearbyGroupsRequest} from '@/interfaces/group';
import {authService} from '@/services/authService';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Modal,
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

type GooglePlacePrediction = {
	place_id: string;
	description: string;
};

const RADIO_OPTIONS = [5, 10, 15, 20, 25, 30];

// Validar configuración de API al cargar
validateApiConfig();
export default function HomeScreen() {
	const [userAddress, setUserAddress] = useState('');
	const [suggestions, setSuggestions] = useState<GooglePlacePrediction[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [searchRadius, setSearchRadius] = useState(15);
	const [modalVisible, setModalVisible] = useState(false);
	const [userName, setUserName] = useState('');
	const [userInitial, setUserInitial] = useState('');
	const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
		address: string;
	} | null>(null);

	// Función para limpiar autenticación (DEBUG)
	const clearAuth = async () => {
		try {
			await authService.clearAuthData();
			await AsyncStorage.removeItem('onboardingComplete');
			Alert.alert('✅ Limpiado', 'Datos de autenticación limpiados. Reinicia la app.');
		} catch (error) {
			console.error('Error limpiando auth:', error);
			Alert.alert('❌ Error', 'Error limpiando datos de autenticación');
		}
	};
	const [isLoadingLocation, setIsLoadingLocation] = useState(false);

	// Hook para validación de grupos
	const {groups, isLoading: isLoadingGroups, error: groupsError, hasGroups, validateGroups, refreshGroups} = useGroupsValidation();

	useEffect(() => {
		loadUserData();
	}, []);

	const loadUserData = async () => {
		try {
			const userDataStr = await AsyncStorage.getItem('userData');
			if (userDataStr) {
				const userData = JSON.parse(userDataStr);
				setUserName(userData.name);
				setUserInitial(userData.name.charAt(0).toUpperCase());
			}
		} catch (error) {
			console.error('Error loading user data:', error);
		}
	};

	const fetchSuggestions = async (input: string) => {
		if (!input) {
			setSuggestions([]);
			return;
		}
		try {
			const response = await fetch(
				`${API_CONFIG.GOOGLE_PLACES_API_URL}?input=${encodeURIComponent(input)}&key=${API_CONFIG.GOOGLE_PLACES_API_KEY}&language=es`
			);
			const data = await response.json();
			setSuggestions(data.predictions || []);
		} catch (err) {
			console.error('Error fetching suggestions:', err);
			setSuggestions([]);
		}
	};

	// Función para obtener coordenadas de una dirección usando Google Geocoding API
	const getCoordinatesFromAddress = async (address: string) => {
		try {
			console.log('🔑 API Key configurada:', API_CONFIG.GOOGLE_PLACES_API_KEY ? '✅' : '❌');
			const url = `${API_CONFIG.GOOGLE_GEOCODING_API_URL}?address=${encodeURIComponent(address)}&key=${API_CONFIG.GOOGLE_PLACES_API_KEY}`;
			console.log('🌐 URL de geocodificación:', url);

			const response = await fetch(url);
			const data = await response.json();
			console.log('📡 Respuesta de geocodificación:', data); //'✅'

			if (data.results && data.results.length > 0) {
				const location = data.results[0].geometry.location;
				const result = {
					latitude: location.lat,
					longitude: location.lng,
					address: address
				};
				console.log('✅ Coordenadas extraídas:', result);
				return result;
			}
			console.log('❌ No se encontraron resultados en la respuesta');
			return null;
		} catch (error) {
			console.error('❌ Error getting coordinates:', error);
			return null;
		}
	};

	// Función para cargar grupos cercanos
	const loadNearbyGroups = async () => {
		if (!userLocation) return;

		const params: INearbyGroupsRequest = {
			latitude: userLocation.latitude,
			longitude: userLocation.longitude,
			radius: searchRadius
		};

		await validateGroups(params);
	};

	// Función para manejar la selección de ubicación
	const handleLocationSelect = async (address: string) => {
		console.log('📍 Seleccionando ubicación:', address);
		setIsLoadingLocation(true);
		setUserAddress(address);
		setShowSuggestions(false);

		try {
			const coords = await getCoordinatesFromAddress(address);
			console.log('📍 Coordenadas obtenidas:', coords);
			if (coords) {
				setUserLocation(coords);
				console.log('📍 Ubicación establecida:', coords); //✅
				// Cargar grupos después de establecer la ubicación
				await loadNearbyGroups();
			} else {
				console.log('❌ No se pudieron obtener coordenadas, usando coordenadas de prueba');
				// Fallback para desarrollo - usar coordenadas de Madrid
				const fallbackCoords = {
					latitude: 40.4168,
					longitude: -3.7038,
					address: address
				};
				setUserLocation(fallbackCoords);
				console.log('📍 Ubicación de fallback establecida:', fallbackCoords);
				await loadNearbyGroups();
			}
		} catch (error) {
			console.error('❌ Error getting coordinates:', error);
			// Fallback en caso de error
			const fallbackCoords = {
				latitude: 40.4168,
				longitude: -3.7038,
				address: address
			};
			setUserLocation(fallbackCoords);
			console.log('📍 Ubicación de fallback establecida por error:', fallbackCoords);
			await loadNearbyGroups();
		} finally {
			setIsLoadingLocation(false);
		}
	};

	// Función para crear grupo
	const handleCreateGroup = () => {
		if (!userLocation) {
			Alert.alert('Error', 'Por favor selecciona una ubicación antes de crear un grupo');
			return;
		}
		setShowCreateGroupModal(true);
	};

	// Función para manejar grupo creado
	const handleGroupCreated = (newGroup: IGroup) => {
		// Recargar grupos para incluir el nuevo grupo
		refreshGroups();
		setShowCreateGroupModal(false);
	};

	// Función para aumentar el radio de búsqueda
	const handleIncreaseRadius = () => {
		const newRadius = Math.min(searchRadius + 5, 30);
		setSearchRadius(newRadius);
		setModalVisible(false);
		// Recargar grupos con el nuevo radio
		if (userLocation) {
			setTimeout(() => loadNearbyGroups(), 500);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar style='dark' />
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.logoText}>GL</Text>
					<Text style={styles.headerTitle}>Bienvenido{userName ? `, ${userName}` : ''}</Text>
					<View style={styles.avatar}>
						<Text style={styles.avatarText}>{userInitial}</Text>
					</View>
				</View>
				{/* input para buscar domicilio */}
				<View style={styles.searchContainer}>
					<View style={styles.searchBarAndSuggestions}>
						<View style={styles.searchBar}>
							<Ionicons name='location' size={20} color={Colors.light.tint} style={{marginRight: 4}} />
							<View style={{flex: 1}}>
								<TextInput
									style={styles.searchInput}
									placeholder='Buscar domicilio'
									value={userAddress}
									onChangeText={(text) => {
										setUserAddress(text);
										setShowSuggestions(true);
										fetchSuggestions(text);
									}}
									placeholderTextColor={Colors.light.tabIconDefault}
									editable={!isLoadingLocation}
								/>
							</View>
							{isLoadingLocation ? (
								<ActivityIndicator size='small' color={Colors.light.tint} style={{marginLeft: 8}} />
							) : (
								<TouchableOpacity onPress={() => setModalVisible(true)} style={{marginLeft: 8}}>
									<Ionicons name='options-outline' size={22} color={Colors.light.tint} />
								</TouchableOpacity>
							)}
						</View>
						{showSuggestions && suggestions.length > 0 && (
							<FlatList
								data={suggestions}
								keyExtractor={(item) => item.place_id}
								renderItem={({item}) => (
									<TouchableOpacity
										onPress={() => {
											handleLocationSelect(item.description);
										}}
										style={styles.suggestionItem}
									>
										<Text>{item.description}</Text>
									</TouchableOpacity>
								)}
								style={styles.suggestionsList}
								keyboardShouldPersistTaps='handled'
							/>
						)}
					</View>
					<View style={styles.radiusInfo}>
						<Text style={styles.radiusText}>Radio de búsqueda: {searchRadius} km</Text>
					</View>
				</View>

				{/* Modal para seleccionar radio */}
				<Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>Selecciona el radio de búsqueda</Text>
							{RADIO_OPTIONS.map((km) => (
								<Pressable
									key={km}
									onPress={() => {
										setSearchRadius(km);
										setModalVisible(false);
									}}
									style={[styles.radioOption, searchRadius === km && styles.radioOptionSelected]}
								>
									<Text style={searchRadius === km ? styles.radioTextSelected : styles.radioText}>{km} km</Text>
								</Pressable>
							))}
							<Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
								<Text style={styles.closeButtonText}>Cerrar</Text>
							</Pressable>
						</View>
					</View>
				</Modal>

				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollViewContent}
					showsVerticalScrollIndicator={true}
					bounces={true}
				>
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Grupos cerca de ti ({searchRadius}km)</Text>
						</View>

						{isLoadingGroups ? (
							<View style={styles.loadingContainer}>
								<Text style={styles.loadingText}>Buscando grupos cercanos...</Text>
							</View>
						) : groupsError ? (
							<ValidationError error={groupsError} onRetry={refreshGroups} onIncreaseRadius={handleIncreaseRadius} />
						) : hasGroups ? (
							groups.map((group) => (
								<View key={group.id} style={styles.groupCard}>
									<View style={{flex: 1}}>
										<Text style={styles.groupName}>{group.name}</Text>
										<Text style={styles.groupAddress}>{group.address}</Text>
										<Text style={styles.groupDistance}>
											{group.distance || 0} km • {group.members} miembros
										</Text>
									</View>
									<TouchableOpacity style={styles.joinButton}>
										<Text style={styles.joinButtonText}>Ver grupo</Text>
									</TouchableOpacity>
								</View>
							))
						) : userLocation ? (
							<EmptyGroupsState
								onCreateGroup={handleCreateGroup}
								onIncreaseRadius={handleIncreaseRadius}
								currentRadius={searchRadius}
								hasLocation={true}
							/>
						) : (
							<View style={styles.emptyStateContainer}>
								<Text style={styles.emptyStateText}>Selecciona tu ubicación para ver grupos cercanos</Text>
							</View>
						)}
					</View>
				</ScrollView>

				{/* Botón flotante para crear grupo - solo cuando NO hay grupos */}
				{userLocation && !hasGroups && !isLoadingGroups && (
					<TouchableOpacity style={styles.floatingCreateButton} onPress={handleCreateGroup}>
						<Ionicons name='add' size={24} color={Colors.light.background} />
					</TouchableOpacity>
				)}
				{/* Debug: Mostrar estado de userLocation */}
				{__DEV__ && (
					<View style={{position: 'absolute', top: 100, right: 10, backgroundColor: 'rgba(0,0,0,0.8)', padding: 10, borderRadius: 5}}>
						<Text style={{color: 'white', fontSize: 12}}>userLocation: {userLocation ? '✅' : '❌'}</Text>
						<Text style={{color: 'white', fontSize: 12}}>hasGroups: {hasGroups ? '✅' : '❌'}</Text>
						<Text style={{color: 'white', fontSize: 12}}>isLoading: {isLoadingGroups ? '✅' : '❌'}</Text>
						<TouchableOpacity style={{backgroundColor: 'red', padding: 5, borderRadius: 3, marginTop: 5}} onPress={clearAuth}>
							<Text style={{color: 'white', fontSize: 10, textAlign: 'center'}}>🧹 Limpiar Auth</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Modal para crear grupo */}
				<CreateGroupModal
					visible={showCreateGroupModal}
					onClose={() => setShowCreateGroupModal(false)}
					onGroupCreated={handleGroupCreated}
					userLocation={userLocation}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: Colors.light.background
	},
	container: {
		flex: 1,
		backgroundColor: Colors.light.background
	},
	scrollView: {
		flex: 1
	},
	scrollViewContent: {
		flexGrow: 1,
		paddingBottom: 20
	},
	logoText: {
		fontSize: 28,
		fontWeight: 'bold',
		color: Colors.dark.tint,
		letterSpacing: 1
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: 15,
		paddingBottom: 15,
		marginTop: 5,
		marginBottom: 25,
		marginHorizontal: 10,
		backgroundColor: Colors.dark.background,
		borderBottomWidth: 0,
		borderRadius: 20
	},
	headerTitle: {
		flex: 1,
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.dark.text
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.dark.tint,
		justifyContent: 'center',
		alignItems: 'center'
	},
	avatarBadge: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: Colors.dark.tint,
		alignItems: 'center',
		justifyContent: 'center'
	},
	avatarText: {
		color: Colors.dark.background,
		fontWeight: 'bold',
		fontSize: 18
	},
	searchContainer: {
		paddingHorizontal: 15,
		paddingTop: 0,
		paddingBottom: 0,
		backgroundColor: Colors.light.background
	},
	searchBarAndSuggestions: {
		position: 'relative'
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.light.background,
		borderWidth: 1,
		borderColor: Colors.light.tabIconDefault,
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginBottom: 4
	},
	searchInput: {
		fontSize: 16,
		color: Colors.light.text,
		backgroundColor: 'transparent',
		padding: 0,
		borderWidth: 0
	},
	radiusInfo: {
		alignItems: 'flex-end',
		marginBottom: 4
	},
	radiusText: {
		fontSize: 13,
		color: Colors.light.tabIconDefault
	},
	section: {
		padding: 20
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 15,
		color: Colors.light.text
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16
	},

	groupCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8f8f8',
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		borderWidth: 0
		//borderColor: Colors.light.tabIconDefault
		//boxShadow: '0px 0px 10px 0px rgba(7, 6, 6, 0.1)'
	},
	groupName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 2
	},
	groupAddress: {
		fontSize: 14,
		color: Colors.light.tabIconDefault,
		marginBottom: 2
	},
	groupDistance: {
		fontSize: 13,
		color: Colors.light.tabIconDefault
	},
	joinButton: {
		backgroundColor: Colors.light.tint,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		marginLeft: 12
	},
	joinButtonText: {
		color: Colors.light.background,
		fontWeight: '500'
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.3)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalContent: {
		backgroundColor: Colors.light.background,
		padding: 24,
		borderRadius: 16,
		width: 260,
		alignItems: 'center'
	},
	modalTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 16,
		color: Colors.light.text
	},
	radioOption: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 12,
		marginBottom: 8,
		width: '100%',
		alignItems: 'center',
		backgroundColor: Colors.light.background,
		borderWidth: 1,
		borderColor: Colors.light.tabIconDefault
	},
	radioOptionSelected: {
		backgroundColor: Colors.light.tint,
		borderColor: Colors.light.tint
	},
	radioText: {
		color: Colors.light.text,
		fontSize: 15
	},
	radioTextSelected: {
		color: Colors.light.background,
		fontWeight: 'bold',
		fontSize: 15
	},
	closeButton: {
		marginTop: 8,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 12,
		backgroundColor: Colors.light.tabIconDefault
	},
	closeButtonText: {
		color: Colors.light.text,
		fontWeight: 'bold'
	},
	suggestionsList: {
		backgroundColor: '#fff',
		position: 'absolute',
		top: 48,
		left: 0,
		right: 0,
		zIndex: 10,
		borderWidth: 1,
		borderColor: '#eee',
		maxHeight: 200
	},
	suggestionItem: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	loadingContainer: {
		alignItems: 'center',
		paddingVertical: 40
	},
	loadingText: {
		fontSize: 16,
		color: Colors.light.tabIconDefault,
		textAlign: 'center'
	},
	emptyStateContainer: {
		alignItems: 'center',
		paddingVertical: 40
	},
	emptyStateText: {
		fontSize: 16,
		color: Colors.light.tabIconDefault,
		textAlign: 'center'
	},
	floatingCreateButton: {
		position: 'absolute',
		bottom: 100, // Aumentado para evitar el footer
		right: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: Colors.light.tint,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 10, // Aumentado para estar por encima del footer
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		zIndex: 1000 // Asegurar que esté por encima de todo
	}
});
