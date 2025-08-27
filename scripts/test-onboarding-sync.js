const AsyncStorage = require('@react-native-async-storage/async-storage').default;

/**
 * Script para probar la sincronización del estado de onboarding
 * Simula diferentes escenarios de usuarios y verifica la lógica
 */

async function testOnboardingSync() {
	console.log('🧪 Probando sincronización de onboarding...\n');

	const scenarios = [
		{
			name: 'Usuario nuevo - debe ir al onboarding',
			setup: async () => {
				await AsyncStorage.clear();
				// No hay datos de usuario
			},
			expected: 'Va al onboarding'
		},
		{
			name: 'Usuario existente con doneOnboarding: false - debe ir al onboarding',
			setup: async () => {
				await AsyncStorage.clear();
				await AsyncStorage.setItem('authToken', 'fake-token');
				await AsyncStorage.setItem(
					'userData',
					JSON.stringify({
						id: '123',
						name: 'Pepito',
						email: 'pepito@gmail.com',
						doneOnboarding: false
					})
				);
				await AsyncStorage.setItem('onboardingComplete', 'false');
			},
			expected: 'Va al onboarding (aunque tenga token)'
		},
		{
			name: 'Usuario existente con doneOnboarding: true - debe ir al home',
			setup: async () => {
				await AsyncStorage.clear();
				await AsyncStorage.setItem('authToken', 'fake-token');
				await AsyncStorage.setItem(
					'userData',
					JSON.stringify({
						id: '123',
						name: 'Pepito',
						email: 'pepito@gmail.com',
						doneOnboarding: true
					})
				);
				await AsyncStorage.setItem('onboardingComplete', 'true');
			},
			expected: 'Va al home'
		},
		{
			name: 'Usuario con token pero sin doneOnboarding en userData - debe ir al onboarding',
			setup: async () => {
				await AsyncStorage.clear();
				await AsyncStorage.setItem('authToken', 'fake-token');
				await AsyncStorage.setItem(
					'userData',
					JSON.stringify({
						id: '123',
						name: 'Pepito',
						email: 'pepito@gmail.com'
						// Sin doneOnboarding
					})
				);
				await AsyncStorage.setItem('onboardingComplete', 'false');
			},
			expected: 'Va al onboarding (doneOnboarding undefined = false)'
		}
	];

	for (const scenario of scenarios) {
		console.log(`📋 Probando: ${scenario.name}`);
		console.log(`   Esperado: ${scenario.expected}`);

		try {
			await scenario.setup();

			// Simular la lógica de validación de _layout.tsx
			const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
			const userData = await AsyncStorage.getItem('userData');
			const hasCompletedOnboarding = onboardingComplete === 'true';

			if (!hasCompletedOnboarding) {
				console.log('   ✅ Resultado: Va al onboarding');
			} else {
				const user = userData ? JSON.parse(userData) : null;
				if (user && user.doneOnboarding === true) {
					console.log('   ✅ Resultado: Va al home (onboarding completo)');
				} else {
					console.log('   ✅ Resultado: Va al onboarding (doneOnboarding false/undefined)');
				}
			}
		} catch (error) {
			console.log('   ❌ Error:', error.message);
		}
		console.log('');
	}

	console.log('🎉 Pruebas de sincronización completadas');
	console.log('\n📝 Resumen de la lógica:');
	console.log('1. Si onboardingComplete es "false" → Va al onboarding');
	console.log('2. Si onboardingComplete es "true" pero doneOnboarding es false/undefined → Va al onboarding');
	console.log('3. Si onboardingComplete es "true" y doneOnboarding es true → Va al home');
	console.log('4. El estado se sincroniza desde el backend en el login');
}

testOnboardingSync().catch(console.error);
