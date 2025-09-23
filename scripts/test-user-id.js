const AsyncStorage = require('@react-native-async-storage/async-storage');

async function testUserId() {
	try {
		console.log('🔍 Probando obtención del ID del usuario...');

		// Obtener datos del usuario del storage
		const userData = await AsyncStorage.getItem('userData');
		if (!userData) {
			console.log('❌ No hay datos de usuario en storage');
			return;
		}

		const user = JSON.parse(userData);
		console.log('👤 Usuario completo:', JSON.stringify(user, null, 2));

		// Probar diferentes formas de obtener el ID
		console.log('\n🔍 Analizando ID del usuario:');
		console.log('user._id:', user._id);
		console.log('user.id:', user.id);
		console.log('typeof user._id:', typeof user._id);
		console.log('typeof user.id:', typeof user.id);

		// Usar la lógica del storageService
		const userId = user._id || user.id;
		console.log('\n✅ ID obtenido:', userId);

		if (userId) {
			console.log('✅ ID válido encontrado');
		} else {
			console.log('❌ No se pudo obtener un ID válido');
		}
	} catch (error) {
		console.error('❌ Error en test:', error);
	}
}

testUserId();
