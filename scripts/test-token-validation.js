/**
 * Script para probar la validación de tokens
 * Ejecutar con: node scripts/test-token-validation.js
 */

const AsyncStorage = require('@react-native-async-storage/async-storage');

async function testTokenValidation() {
	try {
		console.log('🔍 Probando nueva lógica de validación de token...\n');

		// 1. Verificar si hay token en storage
		const token = await AsyncStorage.getItem('authToken');
		console.log('1️⃣ Token en storage:', token ? '✅ Existe' : '❌ No existe');

		// 2. Verificar si hay datos de usuario
		const userData = await AsyncStorage.getItem('userData');
		const user = userData ? JSON.parse(userData) : null;
		console.log('2️⃣ Datos de usuario:', user ? '✅ Existen' : '❌ No existen');

		if (user) {
			console.log('   - ID del usuario:', user._id || user.id);
			console.log('   - Email:', user.email);
			console.log('   - doneOnboarding:', user.doneOnboarding);
		}

		// 3. Verificar estado de onboarding
		const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
		console.log('3️⃣ Estado onboarding:', onboardingComplete === 'true' ? '✅ Completo' : '❌ Incompleto');

		// 4. Simular la nueva lógica de validación
		console.log('\n🎯 Simulando nueva lógica de validación:');

		if (!token) {
			console.log('❌ No hay token → Ir al login');
		} else if (!user) {
			console.log('❌ No hay datos de usuario → Ir al login');
		} else {
			console.log('✅ Token y usuario encontrados → Asumir válido');
			console.log('   - El token se validará automáticamente en la primera petición');
			console.log('   - Si falla con 401, el interceptor de apiService limpiará los datos');
		}

		// 5. Mostrar flujo recomendado
		console.log('\n📋 Flujo optimizado:');
		console.log('1. App inicia → Verificar token en storage');
		console.log('2. Si existe → Ir al home (asumir válido)');
		console.log('3. Si no existe → Ir al login');
		console.log('4. En cualquier petición → Si falla 401 → Limpiar datos y ir al login');
	} catch (error) {
		console.error('❌ Error en test:', error);
	}
}

testTokenValidation();
