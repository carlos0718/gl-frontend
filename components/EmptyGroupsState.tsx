import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Colors} from '../constants/Colors';

interface EmptyGroupsStateProps {
	onCreateGroup: () => void;
	onIncreaseRadius: () => void;
	currentRadius: number;
	hasLocation: boolean;
}

export default function EmptyGroupsState({onCreateGroup, onIncreaseRadius, currentRadius, hasLocation}: EmptyGroupsStateProps) {
	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<Ionicons name='people-outline' size={80} color={Colors.light.tabIconDefault} />
			</View>

			<Text style={styles.title}>No hay grupos cercanos</Text>

			<Text style={styles.description}>
				No se encontraron grupos de entrenamiento dentro de un radio de {currentRadius} km de tu ubicación.
			</Text>

			{!hasLocation && (
				<View style={styles.warningContainer}>
					<Ionicons name='warning-outline' size={20} color='#FF9500' />
					<Text style={styles.warningText}>Primero selecciona tu ubicación para buscar grupos cercanos</Text>
				</View>
			)}

			<View style={styles.actionsContainer}>
				{/* Botón principal - Crear grupo */}
				<TouchableOpacity
					style={[styles.primaryButton, !hasLocation && styles.buttonDisabled]}
					onPress={onCreateGroup}
					disabled={!hasLocation}
				>
					<Ionicons name='add-circle-outline' size={24} color={Colors.light.background} />
					<Text style={styles.primaryButtonText}>Crear el primer grupo</Text>
				</TouchableOpacity>

				{/* Botón secundario - Aumentar radio */}
				<TouchableOpacity
					style={[styles.secondaryButton, !hasLocation && styles.buttonDisabled]}
					onPress={onIncreaseRadius}
					disabled={!hasLocation}
				>
					<Ionicons name='search-outline' size={20} color={Colors.light.tint} />
					<Text style={styles.secondaryButtonText}>Buscar en un radio mayor</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.infoContainer}>
				<Text style={styles.infoTitle}>¿Por qué crear un grupo?</Text>
				<View style={styles.benefitsList}>
					<View style={styles.benefitItem}>
						<Ionicons name='checkmark-circle' size={16} color={Colors.light.tint} />
						<Text style={styles.benefitText}>Conecta con personas con tus mismos intereses</Text>
					</View>
					<View style={styles.benefitItem}>
						<Ionicons name='checkmark-circle' size={16} color={Colors.light.tint} />
						<Text style={styles.benefitText}>Motivación y responsabilidad compartida</Text>
					</View>
					<View style={styles.benefitItem}>
						<Ionicons name='checkmark-circle' size={16} color={Colors.light.tint} />
						<Text style={styles.benefitText}>Actividades más divertidas y sociales</Text>
					</View>
					<View style={styles.benefitItem}>
						<Ionicons name='checkmark-circle' size={16} color={Colors.light.tint} />
						<Text style={styles.benefitText}>Comparte conocimientos y experiencias</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 30,
		paddingVertical: 40
	},
	iconContainer: {
		marginBottom: 20
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.light.text,
		textAlign: 'center',
		marginBottom: 12
	},
	description: {
		fontSize: 16,
		color: Colors.light.tabIconDefault,
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 30
	},
	warningContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFF3E0',
		padding: 12,
		borderRadius: 8,
		marginBottom: 30,
		borderWidth: 1,
		borderColor: '#FFE0B2'
	},
	warningText: {
		marginLeft: 8,
		fontSize: 14,
		color: '#E65100',
		flex: 1
	},
	actionsContainer: {
		width: '100%',
		marginBottom: 40
	},
	primaryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.light.tint,
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		marginBottom: 12
	},
	primaryButtonText: {
		color: Colors.light.background,
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: 8
	},
	secondaryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: Colors.light.tint
	},
	secondaryButtonText: {
		color: Colors.light.tint,
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8
	},
	buttonDisabled: {
		opacity: 0.5
	},
	infoContainer: {
		width: '100%',
		backgroundColor: '#F8F9FA',
		padding: 20,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.light.tabIconDefault
	},
	infoTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 16,
		textAlign: 'center'
	},
	benefitsList: {
		gap: 12
	},
	benefitItem: {
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	benefitText: {
		fontSize: 14,
		color: Colors.light.text,
		marginLeft: 8,
		flex: 1,
		lineHeight: 20
	}
});
