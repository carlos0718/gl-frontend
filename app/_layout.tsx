import 'react-native-reanimated';

import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';

import AuthLoader from '../components/AuthLoader';
import {useColorScheme} from '../hooks/useColorScheme';
import {authEventEmitter} from '../services/authEventEmitter';
import {storageService} from '../services/storageService';
import {TokenValidator} from '../services/tokenValidator';
import AuthStack from './AuthStack';
import OnboardingWizard from './OnboardingWizard';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
	});
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
	const [isValidatingToken, setIsValidatingToken] = useState(true);

	useEffect(() => {
		checkAuthAndOnboarding();

		// Escuchar eventos de autenticación
		const handleTokenExpired = () => {
			console.log('🔔 RootLayout: Token expirado detectado, redirigiendo a login...');
			setIsAuthenticated(false);
			setShowOnboarding(false);
		};

		const handleLogout = () => {
			console.log('🔔 RootLayout: Logout detectado, redirigiendo a login...');
			setIsAuthenticated(false);
			setShowOnboarding(false);
		};

		// Agregar listeners
		authEventEmitter.on('tokenExpired', handleTokenExpired);
		authEventEmitter.on('logout', handleLogout);

		// Cleanup listeners
		return () => {
			authEventEmitter.off('tokenExpired', handleTokenExpired);
			authEventEmitter.off('logout', handleLogout);
		};
	}, []);

	const checkAuthAndOnboarding = async () => {
		try {
			console.log('🔍 RootLayout: Iniciando validación de autenticación...');

			// Verificar onboarding primero
			const hasCompletedOnboarding = await storageService.isOnboardingComplete();

			// Si no ha completado onboarding, mostrar wizard
			if (!hasCompletedOnboarding) {
				console.log('📋 RootLayout: Usuario no ha completado onboarding');
				setIsAuthenticated(false);
				setShowOnboarding(true);
				setIsValidatingToken(false);
				return;
			}

			// Validar token si existe
			const tokenValidation = await TokenValidator.validateToken();

			if (tokenValidation.isValid) {
				console.log('✅ RootLayout: Token válido, usuario autenticado');
				setIsAuthenticated(true);
				setShowOnboarding(false);
			} else {
				console.log('❌ RootLayout: Token inválido, limpiando datos y mostrando login');
				// Limpiar datos inválidos
				await TokenValidator.clearInvalidAuth();
				setIsAuthenticated(false);
				setShowOnboarding(false);
			}
		} catch (error) {
			console.error('❌ RootLayout: Error validando autenticación:', error);
			setIsAuthenticated(false);
			setShowOnboarding(false);
		} finally {
			setIsValidatingToken(false);
		}
	};

	// Función para refrescar el estado después de cambios de autenticación
	const refreshAuthState = () => {
		setIsValidatingToken(true);
		checkAuthAndOnboarding();
	};

	if (!loaded) {
		console.log('No se cargaron las fuentes');
		// Async font loading only occurs in development.
		return null;
	}

	// Mostrar loader mientras se valida el token
	if (isValidatingToken) {
		console.log('⏳ RootLayout: Mostrando loader de validación...');
		return <AuthLoader message='Validando sesión...' />;
	}

	if (showOnboarding) {
		console.log('📋 RootLayout: Mostrando OnboardingWizard');
		return <OnboardingWizard onFinish={refreshAuthState} />;
	}

	if (!isAuthenticated) {
		console.log('🔐 RootLayout: No autenticado, mostrando AuthStack');
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
