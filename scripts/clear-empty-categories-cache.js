const AsyncStorage = require('@react-native-async-storage/async-storage');

async function clearEmptyCategoriesCache() {
	try {
		console.log('🗑️ Limpiando cache vacío de categorías...\n');

		const cacheKey = 'groupCategories';
		const cached = await AsyncStorage.getItem(cacheKey);

		if (!cached) {
			console.log('✅ No hay cache para limpiar');
			return;
		}

		const parsedCache = JSON.parse(cached);
		console.log('📋 Estado del cache:');
		console.log('   - Categorías:', parsedCache.categories.length);
		console.log('   - Contenido:', parsedCache.categories);

		if (parsedCache.categories.length === 0) {
			await AsyncStorage.removeItem(cacheKey);
			console.log('✅ Cache vacío limpiado exitosamente');
		} else {
			console.log('⚠️ Cache no está vacío, no se limpia');
		}
	} catch (error) {
		console.error('❌ Error limpiando cache:', error);
	}
}

clearEmptyCategoriesCache();
