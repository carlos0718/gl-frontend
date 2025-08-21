import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';

import AuthStack from './AuthStack';
import OnboardingWizard from './OnboardingWizard';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
	});
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

	useEffect(() => {
		checkAuthAndOnboarding();
	}, []);

	const checkAuthAndOnboarding = async () => {
		try {
			const [authToken, onboardingComplete] = await Promise.all([
				AsyncStorage.getItem('authToken'),
				AsyncStorage.getItem('onboardingComplete')
			]);

			const hasAuthToken = !!authToken;
			const hasCompletedOnboarding = onboardingComplete === 'true';

			setIsAuthenticated(hasAuthToken);

			// Mostrar onboarding si no ha completado el onboarding (usuario nuevo o en proceso)
			const shouldShowOnboarding = !hasCompletedOnboarding;
			setShowOnboarding(shouldShowOnboarding);
		} catch (error) {
			console.error('Error checking auth state:', error);
			setIsAuthenticated(false);
			setShowOnboarding(false);
		}
	};

	// Función para refrescar el estado después de cambios de autenticación
	const refreshAuthState = () => {
		checkAuthAndOnboarding();
	};

	if (!loaded) {
		console.log('No se cargaron las fuentes');
		// Async font loading only occurs in development.
		return null;
	}

	if (showOnboarding) {
		console.log('Mostrando OnboardingWizard');
		return <OnboardingWizard onFinish={refreshAuthState} />;
	}

	if (!isAuthenticated) {
		console.log('No autenticado, mostrando AuthStack');
		return <AuthStack onAuthSuccess={refreshAuthState} />;
	}
	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name='(tabs)' options={{headerShown: false}} />
				<Stack.Screen name='+not-found' />
			</Stack>
			<StatusBar style='dark' />
		</ThemeProvider>
	);
}
