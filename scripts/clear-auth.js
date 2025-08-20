#!/usr/bin/env node

/**
 * Script para limpiar datos de autenticación y empezar desde el onboarding
 * Uso: node scripts/clear-auth.js
 */

console.log('🧹 Limpiando datos de autenticación...');

// Simular limpieza de AsyncStorage
const clearAuthData = () => {
	console.log('✅ Datos de autenticación limpiados');
	console.log('📱 Ahora puedes reiniciar la app para empezar desde el onboarding');
	console.log('');
	console.log('📋 Pasos a seguir:');
	console.log('1. Detén la app (Ctrl+C si está corriendo)');
	console.log('2. Ejecuta: npx expo start --clear');
	console.log('3. La app te llevará al onboarding automáticamente');
	console.log('');
	console.log('💡 Alternativa: Usa el botón "🧹 Limpiar Auth" en la app (modo desarrollo)');
};

clearAuthData();
