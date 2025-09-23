const AsyncStorage = require('@react-native-async-storage/async-storage');

async function testCategoriesCache() {
	try {
		console.log('🔍 Probando lógica de cache de categorías...\n');

		// 1. Verificar estado actual del cache
		const cacheKey = 'groupCategories';
		const cached = await AsyncStorage.getItem(cacheKey);

		console.log('1️⃣ Estado actual del cache:');
		if (cached) {
			const parsedCache = JSON.parse(cached);
			console.log('   - Existe cache:', '✅');
			console.log('   - Versión:', parsedCache.version);
			console.log('   - Timestamp:', new Date(parsedCache.timestamp).toLocaleString());
			console.log('   - Categorías:', parsedCache.categories.length);
			console.log('   - Contenido:', parsedCache.categories);

			// Calcular edad del cache
			const cacheAge = Date.now() - parsedCache.timestamp;
			const cacheAgeMinutes = Math.round(cacheAge / (60 * 1000));
			console.log('   - Edad:', cacheAgeMinutes, 'minutos');

			// Verificar si es válido (24 horas)
			const isValid = cacheAge < 24 * 60 * 60 * 1000;
			console.log('   - Válido:', isValid ? '✅' : '❌');
		} else {
			console.log('   - No existe cache');
		}

		// 2. Simular diferentes escenarios
		console.log('\n2️⃣ Simulando escenarios:');

		// Escenario A: Cache válido con categorías
		console.log('\n📋 Escenario A: Cache válido con categorías');
		console.log('   Resultado esperado: Usar cache');
		console.log('   Condiciones: cache existe + válido + categorías > 0');

		// Escenario B: Cache válido pero vacío
		console.log('\n📋 Escenario B: Cache válido pero vacío');
		console.log('   Resultado esperado: Ir a API');
		console.log('   Condiciones: cache existe + válido + categorías = 0');

		// Escenario C: Cache expirado
		console.log('\n📋 Escenario C: Cache expirado');
		console.log('   Resultado esperado: Ir a API');
		console.log('   Condiciones: cache existe + expirado');

		// Escenario D: Sin cache
		console.log('\n📋 Escenario D: Sin cache');
		console.log('   Resultado esperado: Ir a API');
		console.log('   Condiciones: no existe cache');

		// 3. Mostrar lógica corregida
		console.log('\n3️⃣ Lógica corregida:');
		console.log('```typescript');
		console.log('// Antes (problemático):');
		console.log('if (cachedCategories && this.isCacheValid(cachedCategories)) {');
		console.log('  return cachedCategories.categories; // ❌ Devuelve array vacío');
		console.log('}');
		console.log('');
		console.log('// Después (corregido):');
		console.log('if (cachedCategories && this.isCacheValid(cachedCategories) && cachedCategories.categories.length > 0) {');
		console.log('  return cachedCategories.categories; // ✅ Solo si tiene categorías');
		console.log('}');
		console.log('```');

		// 4. Recomendaciones
		console.log('\n4️⃣ Recomendaciones:');
		console.log('✅ Validar que el cache tenga categorías antes de usarlo');
		console.log('✅ Limpiar cache vacío automáticamente');
		console.log('✅ Usar fallback a API cuando cache esté vacío');
		console.log('✅ Mantener categorías por defecto como último recurso');
	} catch (error) {
		console.error('❌ Error en test:', error);
	}
}

testCategoriesCache();
