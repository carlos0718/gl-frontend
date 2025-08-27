import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import {Colors} from '../constants/Colors';

interface AuthLoaderProps {
	message?: string;
}

export default function AuthLoader({message = 'Validando sesión...'}: AuthLoaderProps) {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<ActivityIndicator size='large' color={Colors.light.tint} />
				<Text style={styles.message}>{message}</Text>
				<Text style={styles.subtitle}>Por favor espera un momento</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
		justifyContent: 'center',
		alignItems: 'center'
	},
	content: {
		alignItems: 'center',
		padding: 20
	},
	message: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.light.text,
		marginTop: 20,
		textAlign: 'center'
	},
	subtitle: {
		fontSize: 14,
		color: Colors.light.tabIconDefault,
		marginTop: 8,
		textAlign: 'center'
	}
});
