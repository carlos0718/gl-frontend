const AsyncStorage = require('@react-native-async-storage/async-storage');

async function debugCategories() {
	try {
		console.log('🔍 Debuggeando categorías...\n');

		// 1. Verificar cache de categorías
		const cacheKey = 'groupCategories';
		const cached = await AsyncStorage.getItem(cacheKey);

		console.log('1️⃣ Cache de categorías:');
		if (cached) {
			const parsedCache = JSON.parse(cached);
			console.log('   - Existe cache:', '✅');
			console.log('   - Categorías:', parsedCache.categories.length);
			console.log('   - Contenido:', parsedCache.categories);

			// Analizar cada categoría
			console.log('\n2️⃣ Análisis de categorías:');
			parsedCache.categories.forEach((cat, index) => {
				console.log(`   [${index}] Tipo: ${typeof cat}, Valor: "${cat}"`);

				// Verificar si es un objeto
				if (typeof cat === 'object' && cat !== null) {
					console.log(`       📋 Es un objeto con propiedades:`, Object.keys(cat));
					if ('name' in cat) {
						console.log(`       ✅ Tiene propiedad 'name': "${cat.name}"`);
					} else {
						console.log(`       ❌ No tiene propiedad 'name'`);
					}
				} else if (typeof cat === 'string') {
					console.log(`       📝 Es un string, longitud: ${cat.length}`);
				}

				// Verificar si es null o undefined
				if (cat == null) {
					console.log(`       ⚠️  Es null/undefined`);
				}

				// Verificar si está vacío
				if (String(cat).trim().length === 0) {
					console.log(`       ⚠️  Está vacío después de trim`);
				}
			});

			// Verificar duplicados
			console.log('\n3️⃣ Verificación de duplicados:');
			const uniqueCategories = [...new Set(parsedCache.categories.map((cat) => String(cat)))];
			console.log('   - Categorías únicas:', uniqueCategories.length);
			console.log('   - Categorías totales:', parsedCache.categories.length);

			if (uniqueCategories.length !== parsedCache.categories.length) {
				console.log('   ⚠️  Hay categorías duplicadas!');

				// Encontrar duplicados
				const duplicates = parsedCache.categories.filter((cat, index, arr) => arr.findIndex((c) => String(c) === String(cat)) !== index);
				console.log('   - Duplicados encontrados:', duplicates);
			}
		} else {
			console.log('   - No existe cache');
		}

		// 4. Recomendaciones
		console.log('\n4️⃣ Recomendaciones:');
		console.log('✅ Filtrar categorías null/undefined');
		console.log('✅ Convertir todas las categorías a string');
		console.log('✅ Usar keys únicas con índice');
		console.log('✅ Validar que no estén vacías después de trim');
	} catch (error) {
		console.error('❌ Error en debug:', error);
	}
}

debugCategories();
