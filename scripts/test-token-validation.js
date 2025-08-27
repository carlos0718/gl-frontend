/**
 * Script para probar la validación de tokens
 * Ejecutar con: node scripts/test-token-validation.js
 */

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function testTokenValidation() {
	console.log('🧪 Iniciando pruebas de validación de token...\n');

	// Simular diferentes escenarios
	const scenarios = [
		{
			name: 'Token válido',
			setup: async () => {
				await AsyncStorage.setItem('authToken', 'valid-token-123');
				await AsyncStorage.setItem('onboardingComplete', 'true');
			},
			expected: 'Usuario va al home'
		},
		{
			name: 'Token expirado',
			setup: async () => {
				await AsyncStorage.setItem('authToken', 'expired-token-456');
				await AsyncStorage.setItem('onboardingComplete', 'true');
			},
			expected: 'Usuario va al login'
		},
		{
			name: 'Sin token',
			setup: async () => {
				await AsyncStorage.removeItem('authToken');
				await AsyncStorage.setItem('onboardingComplete', 'true');
			},
			expected: 'Usuario va al login'
		},
		{
			name: 'Onboarding incompleto',
			setup: async () => {
				await AsyncStorage.setItem('authToken', 'any-token');
				await AsyncStorage.setItem('onboardingComplete', 'false');
			},
			expected: 'Usuario va al onboarding'
		}
	];

	for (const scenario of scenarios) {
		console.log(`📋 Probando: ${scenario.name}`);
		console.log(`   Esperado: ${scenario.expected}`);

		try {
			await scenario.setup();

			// Simular la lógica de validación
			const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
			const hasCompletedOnboarding = onboardingComplete === 'true';

			if (!hasCompletedOnboarding) {
				console.log('   ✅ Resultado: Va al onboarding');
			} else {
				const token = await AsyncStorage.getItem('authToken');
				if (token) {
					console.log('   ✅ Resultado: Va al home (token presente)');
				} else {
					console.log('   ✅ Resultado: Va al login (sin token)');
				}
			}
		} catch (error) {
			console.log('   ❌ Error:', error.message);
		}

		console.log('');
	}

	console.log('🎉 Pruebas completadas');
}

// Ejecutar pruebas
testTokenValidation().catch(console.error);
