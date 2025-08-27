import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Colors} from '../constants/Colors';

interface ValidationErrorProps {
	error: string;
	onRetry?: () => void;
	onIncreaseRadius?: () => void;
}

export default function ValidationError({error, onRetry, onIncreaseRadius}: ValidationErrorProps) {
	const isNetworkError = error.includes('conexión') || error.includes('internet');
	const isAuthError = error.includes('Sesión expirada') || error.includes('inicia sesión');

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<Ionicons
					name={isNetworkError ? 'wifi-outline' : isAuthError ? 'lock-closed-outline' : 'alert-circle-outline'}
					size={60}
					color={Colors.light.tabIconDefault}
				/>
			</View>

			<Text style={styles.title}>{isNetworkError ? 'Error de Conexión' : isAuthError ? 'Error de Autenticación' : 'Error de Validación'}</Text>

			<Text style={styles.message}>{error}</Text>

			<View style={styles.actionsContainer}>
				{onRetry && (
					<TouchableOpacity style={styles.primaryButton} onPress={onRetry}>
						<Ionicons name='refresh' size={20} color={Colors.light.background} />
						<Text style={styles.primaryButtonText}>Intentar de nuevo</Text>
					</TouchableOpacity>
				)}

				{onIncreaseRadius && !isNetworkError && !isAuthError && (
					<TouchableOpacity style={styles.secondaryButton} onPress={onIncreaseRadius}>
						<Ionicons name='search-outline' size={20} color={Colors.light.tint} />
						<Text style={styles.secondaryButtonText}>Buscar en radio mayor</Text>
					</TouchableOpacity>
				)}

				{isAuthError && (
					<TouchableOpacity style={styles.secondaryButton}>
						<Ionicons name='log-in-outline' size={20} color={Colors.light.tint} />
						<Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
					</TouchableOpacity>
				)}
			</View>

			{isNetworkError && (
				<View style={styles.tipsContainer}>
					<Text style={styles.tipsTitle}>Consejos:</Text>
					<View style={styles.tipItem}>
						<Ionicons name='checkmark-circle' size={16} color={Colors.light.tint} />
						<Text style={styles.tipText}>Verifica tu conexión a internet</Text>
					</View>
					<View style={styles.tipItem}>
						<Ionicons name='checkmark-circle' size={16} color={Colors.light.tint} />
						<Text style={styles.tipText}>Intenta cambiar de red WiFi</Text>
					</View>
					<View style={styles.tipItem}>
						<Ionicons name='checkmark-circle' size={16} color={Colors.light.tint} />
						<Text style={styles.tipText}>Desactiva y reactiva los datos móviles</Text>
					</View>
				</View>
			)}
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
		fontSize: 22,
		fontWeight: 'bold',
		color: Colors.light.text,
		textAlign: 'center',
		marginBottom: 12
	},
	message: {
		fontSize: 16,
		color: Colors.light.tabIconDefault,
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 30
	},
	actionsContainer: {
		width: '100%',
		marginBottom: 30
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
		fontSize: 16,
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
	tipsContainer: {
		width: '100%',
		backgroundColor: '#F8F9FA',
		padding: 20,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.light.tabIconDefault
	},
	tipsTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 12,
		textAlign: 'center'
	},
	tipItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 8
	},
	tipText: {
		fontSize: 14,
		color: Colors.light.text,
		marginLeft: 8,
		flex: 1,
		lineHeight: 20
	}
});
