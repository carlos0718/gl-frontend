import {Ionicons} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

import {Colors} from '../constants/Colors';
import {ICategory} from '../interfaces/category';
import {ICreateGroupRequest, IGroup} from '../interfaces/group';
import {CategoriesService} from '../services/categoriesService';
import {GroupService} from '../services/groupService';

interface CreateGroupModalProps {
	visible: boolean;
	onClose: () => void;
	onGroupCreated: (group: IGroup) => void;
	userLocation: {
		latitude: number;
		longitude: number;
		address: string;
	} | null;
}

const MAX_MEMBERS_OPTIONS = [5, 10, 15, 20, 25, 30];

export default function CreateGroupModal({visible, onClose, onGroupCreated, userLocation}: CreateGroupModalProps) {
	const [groupName, setGroupName] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [maxMembers, setMaxMembers] = useState(10);
	const [categories, setCategories] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showCategoryPicker, setShowCategoryPicker] = useState(false);

	useEffect(() => {
		if (visible) {
			loadCategories();
		}
	}, [visible]);

	const loadCategories = async () => {
		try {
			console.log('📋 CreateGroupModal: Cargando categorías...');

			// Usar el nuevo CategoriesService que maneja cache y fallbacks automáticamente
			const cats = await CategoriesService.getCategories();
			console.log('🔍 CreateGroupModal: Categorías cargadas:', cats);
			// Validación adicional antes de setear
			if (Array.isArray(cats) && cats.length > 0) {
				// Extraer los nombres de las categorías de los objetos
				const validCategories = cats
					.filter((cat) => cat != null && cat !== undefined)
					.map((cat) => {
						// Si es un objeto con propiedad name, extraer el nombre
						if (typeof cat === 'object' && cat !== null && 'name' in cat) {
							const categoryObj = cat as ICategory;
							return typeof categoryObj.name === 'string' ? categoryObj.name.trim() : '';
						}
						// Si es un string directo, usarlo
						if (typeof cat === 'string') {
							return cat.trim();
						}
						// Fallback
						return String(cat);
					})
					.filter((catName) => catName.length > 0);

				if (validCategories.length > 0) {
					setCategories(validCategories);
					console.log('✅ CreateGroupModal: Categorías cargadas exitosamente:', validCategories.length, 'categorías');
				} else {
					console.warn('⚠️ CreateGroupModal: No se obtuvieron categorías válidas después del filtrado');
					setCategories([]);
				}
			} else {
				console.warn('⚠️ CreateGroupModal: No se obtuvieron categorías válidas, usando fallback');
				setCategories([]);
			}
		} catch (error) {
			console.error('❌ CreateGroupModal: Error cargando categorías:', error);
			// El CategoriesService ya maneja el fallback, pero por si acaso
			setCategories([]);
		}
	};

	const validateForm = (): boolean => {
		if (!groupName.trim()) {
			Alert.alert('Error', 'Por favor ingresa el nombre del grupo');
			return false;
		}
		if (!description.trim()) {
			Alert.alert('Error', 'Por favor ingresa una descripción del grupo');
			return false;
		}
		if (!category) {
			Alert.alert('Error', 'Por favor selecciona una categoría');
			return false;
		}
		if (!userLocation) {
			Alert.alert('Error', 'Por favor selecciona una ubicación');
			return false;
		}
		return true;
	};

	const handleCreateGroup = async () => {
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const groupData: ICreateGroupRequest = {
				name: groupName.trim(),
				description: description.trim(),
				address: userLocation!.address,
				latitude: userLocation!.latitude,
				longitude: userLocation!.longitude,
				maxMembers,
				category
			};

			const newGroup = await GroupService.createGroup(groupData);

			Alert.alert('¡Grupo creado exitosamente!', `El grupo "${newGroup.name}" ha sido creado. Ya puedes empezar a invitar miembros.`, [
				{
					text: 'OK',
					onPress: () => {
						onGroupCreated(newGroup);
						resetForm();
						onClose();
					}
				}
			]);
		} catch (error) {
			console.error('Error creating group:', error);
			let errorMessage = 'No se pudo crear el grupo. Por favor intenta de nuevo.';

			if (error instanceof Error) {
				if (error.message.includes('Network request failed')) {
					errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta de nuevo.';
				} else if (error.message.includes('401')) {
					errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente.';
				} else if (error.message.includes('400')) {
					errorMessage = 'Datos inválidos. Verifica la información ingresada.';
				} else if (error.message.includes('500')) {
					errorMessage = 'Error del servidor. Intenta más tarde.';
				}
			}

			Alert.alert('Error', errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setGroupName('');
		setDescription('');
		setCategory('');
		setMaxMembers(10);
	};

	const handleClose = () => {
		if (isLoading) return;
		resetForm();
		onClose();
	};

	return (
		<Modal visible={visible} animationType='slide' transparent={true} onRequestClose={handleClose}>
			<KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<View style={styles.modalContent}>
					<View style={styles.header}>
						<Text style={styles.modalTitle}>Crear Nuevo Grupo</Text>
						<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
							<Ionicons name='close' size={24} color={Colors.light.text} />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
						{/* Nombre del grupo */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Nombre del grupo *</Text>
							<TextInput
								style={styles.textInput}
								value={groupName}
								onChangeText={setGroupName}
								placeholder='Ej: Running Team Madrid'
								placeholderTextColor={Colors.light.tabIconDefault}
								maxLength={50}
							/>
						</View>

						{/* Descripción */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Descripción *</Text>
							<TextInput
								style={[styles.textInput, styles.textArea]}
								value={description}
								onChangeText={setDescription}
								placeholder='Describe las actividades del grupo, horarios, nivel requerido...'
								placeholderTextColor={Colors.light.tabIconDefault}
								multiline
								numberOfLines={4}
								maxLength={200}
							/>
						</View>

						{/* Categoría */}
						<View style={[styles.inputContainer, showCategoryPicker && styles.inputContainerActive]}>
							<Text style={styles.label}>Categoría *</Text>

							<TouchableOpacity style={styles.pickerButton} onPress={() => setShowCategoryPicker(!showCategoryPicker)}>
								<Text style={[styles.pickerButtonText, !category && styles.placeholderText]}>
									{category || 'Selecciona una categoría'}
								</Text>
								<Ionicons name={showCategoryPicker ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.light.tint} />
							</TouchableOpacity>

							{showCategoryPicker && (
								<>
									{/* Overlay simple para cerrar */}
									<TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowCategoryPicker(false)} />
									<View style={styles.pickerOptionsContainer}>
										{/* ScrollView con todas las categorías */}
										<ScrollView
											style={styles.pickerOptions}
											showsVerticalScrollIndicator={true}
											nestedScrollEnabled={true}
											keyboardShouldPersistTaps='handled'
										>
											{Array.isArray(categories) && categories.length > 0 ? (
												categories.map((cat, index) => {
													// cat ya es un string (el nombre de la categoría)
													const categoryText = typeof cat === 'string' ? cat : String(cat);
													const uniqueKey = `category-${index}-${categoryText}`;

													return (
														<TouchableOpacity
															key={uniqueKey}
															style={[
																styles.pickerOption,
																index === categories.length - 1 && styles.pickerOptionLast,
																category === categoryText && styles.pickerOptionSelected
															]}
															onPress={() => {
																setCategory(categoryText);
																setShowCategoryPicker(false);
															}}
															activeOpacity={0.7}
														>
															<Text
																style={[
																	styles.pickerOptionText,
																	category === categoryText && styles.pickerOptionTextSelected
																]}
															>
																{categoryText}
															</Text>
														</TouchableOpacity>
													);
												})
											) : (
												<TouchableOpacity style={[styles.pickerOption, styles.pickerOptionLast]}>
													<Text style={styles.pickerOptionText}>No hay categorías disponibles</Text>
												</TouchableOpacity>
											)}
										</ScrollView>
									</View>
								</>
							)}
						</View>

						{/* Máximo de miembros */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Máximo de miembros</Text>
							<View style={styles.maxMembersContainer}>
								{MAX_MEMBERS_OPTIONS.map((option) => (
									<TouchableOpacity
										key={option}
										style={[styles.maxMemberOption, maxMembers === option && styles.maxMemberOptionSelected]}
										onPress={() => setMaxMembers(option)}
									>
										<Text style={[styles.maxMemberOptionText, maxMembers === option && styles.maxMemberOptionTextSelected]}>
											{option}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* Ubicación */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Ubicación</Text>
							<View style={styles.locationContainer}>
								<Ionicons name='location' size={16} color={Colors.light.tint} />
								<Text style={styles.locationText}>{userLocation ? userLocation.address : 'No se ha seleccionado ubicación'}</Text>
							</View>
						</View>

						{/* Botón crear */}
						<TouchableOpacity
							style={[styles.createButton, isLoading && styles.createButtonDisabled]}
							onPress={handleCreateGroup}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color={Colors.light.background} />
							) : (
								<Text style={styles.createButtonText}>Crear Grupo</Text>
							)}
						</TouchableOpacity>
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'flex-end'
	},
	modalContent: {
		backgroundColor: Colors.light.background,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: '90%',
		minHeight: '70%'
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.light.tabIconDefault
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text
	},
	closeButton: {
		padding: 5
	},
	scrollView: {
		padding: 20
	},
	inputContainer: {
		marginBottom: 20,
		position: 'relative',
		zIndex: 1
	},
	inputContainerActive: {
		zIndex: 10000,
		elevation: 15
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 8
	},
	textInput: {
		borderWidth: 1,
		borderColor: Colors.light.tabIconDefault,
		borderRadius: 10,
		padding: 12,
		fontSize: 16,
		color: Colors.light.text,
		backgroundColor: Colors.light.background
	},
	textArea: {
		height: 100,
		textAlignVertical: 'top'
	},
	pickerButton: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: Colors.light.tabIconDefault,
		borderRadius: 10,
		padding: 12,
		backgroundColor: Colors.light.background
	},
	pickerButtonText: {
		fontSize: 16,
		color: Colors.light.text
	},
	placeholderText: {
		color: Colors.light.tabIconDefault
	},
	pickerOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 9998
	},
	pickerOptionsContainer: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		marginTop: 5,
		borderWidth: 1,
		borderColor: Colors.light.tabIconDefault,
		borderRadius: 10,
		backgroundColor: Colors.light.background,
		maxHeight: 200,
		overflow: 'hidden',
		elevation: 10, // Android shadow más alta
		shadowColor: '#000', // iOS shadow
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowOpacity: 0.25,
		shadowRadius: 8,
		zIndex: 9999
	},
	pickerOptions: {
		flex: 1
	},
	pickerOption: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: Colors.light.tabIconDefault,
		backgroundColor: Colors.light.background
	},
	pickerOptionLast: {
		borderBottomWidth: 0
	},
	pickerOptionSelected: {
		backgroundColor: Colors.light.tint + '20', // 20% opacity
		borderBottomColor: Colors.light.tint + '40'
	},
	pickerOptionText: {
		fontSize: 16,
		color: Colors.light.text
	},
	pickerOptionTextSelected: {
		color: Colors.light.tint,
		fontWeight: '600'
	},
	maxMembersContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8
	},
	maxMemberOption: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: Colors.light.tabIconDefault,
		backgroundColor: Colors.light.background
	},
	maxMemberOptionSelected: {
		backgroundColor: Colors.light.tint,
		borderColor: Colors.light.tint
	},
	maxMemberOptionText: {
		fontSize: 14,
		color: Colors.light.text
	},
	maxMemberOptionTextSelected: {
		color: Colors.light.background,
		fontWeight: 'bold'
	},
	locationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderWidth: 1,
		borderColor: Colors.light.tabIconDefault,
		borderRadius: 10,
		backgroundColor: Colors.light.background
	},
	locationText: {
		marginLeft: 8,
		fontSize: 16,
		color: Colors.light.text,
		flex: 1
	},
	createButton: {
		backgroundColor: Colors.light.tint,
		paddingVertical: 16,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 40
	},
	createButtonDisabled: {
		opacity: 0.6
	},
	createButtonText: {
		color: Colors.light.background,
		fontSize: 18,
		fontWeight: 'bold'
	}
});
