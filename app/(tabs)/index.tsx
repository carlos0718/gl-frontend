import CreateGroupModal from '@/components/CreateGroupModal';
import EmptyGroupsState from '@/components/EmptyGroupsState';
import {Colors} from '@/interfaces/constants/Colors';
import {Group, GroupService} from '@/services/groupService';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

type GooglePlacePrediction = {
	place_id: string;
	description: string;
};

const NEARBY_GROUPS = [
	{
		id: 1,
		name: 'Grupo Crossfit Centro',
		distance: 3.2,
		members: 12,
		address: 'Calle Mayor 10, Centro'
	},
	{
		id: 2,
		name: 'Yoga en el Parque',
		distance: 7.8,
		members: 8,
		address: 'Parque Retiro, Entrada Norte'
	},
	{
		id: 3,
		name: 'Running Team Madrid',
		distance: 12.5,
		members: 20,
		address: 'Av. de América 22'
	},
	{
		id: 4,
		name: 'Grupo Running en el Parque',
		distance: 10.2,
		members: 15,
		address: 'Parque del Retiro, Entrada Norte'
	},
	{
		id: 5,
		name: 'Grupo Running en el Parque',
		distance: 10.2,
		members: 15,
		address: 'Parque del Retiro, Entrada Norte'
	},
	{
		id: 6,
		name: 'Grupo Running en el Parque',
		distance: 10.2,
		members: 15,
		address: 'Parque del Retiro, Entrada Norte'
	},
	{
		id: 7,
		name: 'Grupo Running en el Parque',
		distance: 10.2,
		members: 15,
		address: 'Parque del Retiro, Entrada Norte'
	}
];
const RADIO_OPTIONS = [5, 10, 15, 20, 25, 30];

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_URL;
export default function HomeScreen() {
	const [userAddress, setUserAddress] = useState('');
	const [suggestions, setSuggestions] = useState<GooglePlacePrediction[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [searchRadius, setSearchRadius] = useState(15);
	const [modalVisible, setModalVisible] = useState(false);
	const [userName, setUserName] = useState('');
	const [userInitial, setUserInitial] = useState('');
	const [groups, setGroups] = useState<Group[]>([]);
	const [isLoadingGroups, setIsLoadingGroups] = useState(false);
	const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
		address: string;
	} | null>(null);

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

	// Usar datos mock para desarrollo - en producción esto vendría de la API
	const mockGroups = Array.isArray(NEARBY_GROUPS) ? NEARBY_GROUPS : [];

	const fetchSuggestions = async (input: string) => {
		if (!input) {
			setSuggestions([]);
			return;
		}
		try {
			const response = await fetch(`${GOOGLE_PLACES_API_URL}?input=${encodeURIComponent(input)}&key=${GOOGLE_PLACES_API_KEY}&language=es`);
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
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_PLACES_API_KEY}`
			);
			const data = await response.json();

			if (data.results && data.results.length > 0) {
				const location = data.results[0].geometry.location;
				return {
					latitude: location.lat,
					longitude: location.lng,
					address: address
				};
			}
			return null;
		} catch (error) {
			console.error('Error getting coordinates:', error);
			return null;
		}
	};

	// Función para cargar grupos cercanos
	const loadNearbyGroups = async () => {
		if (!userLocation) return;

		setIsLoadingGroups(true);
		try {
			const nearbyGroups = await GroupService.getNearbyGroups({
				latitude: userLocation.latitude,
				longitude: userLocation.longitude,
				radius: searchRadius
			});
			setGroups(nearbyGroups);
		} catch (error) {
			console.error('Error loading nearby groups:', error);
			// En desarrollo, usar datos mock
			const mockGroupsConverted: Group[] = mockGroups
				.filter((g) => (g.distance || 0) <= searchRadius)
				.map((g) => ({
					id: g.id.toString(),
					name: g.name,
					description: `Grupo de ${g.name}`,
					address: g.address,
					latitude: 0, // Mock data
					longitude: 0, // Mock data
					distance: g.distance,
					members: g.members,
					maxMembers: 20,
					category: 'Running',
					createdBy: 'user123',
					createdAt: new Date().toISOString(),
					isActive: true
				}));
			setGroups(mockGroupsConverted);
		} finally {
			setIsLoadingGroups(false);
		}
	};

	// Función para manejar la selección de ubicación
	const handleLocationSelect = async (address: string) => {
		setUserAddress(address);
		setShowSuggestions(false);

		const coords = await getCoordinatesFromAddress(address);
		if (coords) {
			setUserLocation(coords);
			// Cargar grupos después de establecer la ubicación
			setTimeout(() => loadNearbyGroups(), 500);
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
	const handleGroupCreated = (newGroup: Group) => {
		setGroups((prevGroups) => [newGroup, ...prevGroups]);
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
								/>
							</View>
							<TouchableOpacity onPress={() => setModalVisible(true)} style={{marginLeft: 8}}>
								<Ionicons name='options-outline' size={22} color={Colors.light.tint} />
							</TouchableOpacity>
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
						<Text style={styles.sectionTitle}>Grupos cerca de ti ({searchRadius}km)</Text>

						{isLoadingGroups ? (
							<View style={styles.loadingContainer}>
								<Text style={styles.loadingText}>Buscando grupos cercanos...</Text>
							</View>
						) : groups.length > 0 ? (
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
	}
});
