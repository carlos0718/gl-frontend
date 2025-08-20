import {router} from 'expo-router';
import {useEffect} from 'react';

export default function Index() {
	useEffect(() => {
		// Redirigir automáticamente al index de tabs
		// La lógica de autenticación y onboarding se maneja en _layout.tsx
		router.replace('/(tabs)');
	}, []);

	// No necesitamos renderizar nada ya que redirigimos inmediatamente
	return null;
}
