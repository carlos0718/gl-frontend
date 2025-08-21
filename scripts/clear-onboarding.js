#!/usr/bin/env node

/**
 * Script para limpiar manualmente el estado de onboarding
 * Uso: node scripts/clear-onboarding.js
 */

const fs = require('fs');
const path = require('path');

const clearOnboarding = () => {
	console.log('🧹 Limpiando estado de onboarding...');

	// En React Native/Expo, AsyncStorage se guarda en diferentes lugares según la plataforma
	// Para desarrollo, podemos simular la limpieza mostrando los comandos necesarios

	console.log('');
	console.log('📱 Para limpiar el estado en el dispositivo/emulador:');
	console.log('');
	console.log('1. En la app, ve a Configuración > Aplicaciones > [Tu App] > Almacenamiento');
	console.log('2. Toca "Borrar datos" o "Limpiar caché"');
	console.log('');
	console.log('🔄 O reinicia completamente la app:');
	console.log('   - Cierra la app completamente');
	console.log('   - Reinicia el emulador/dispositivo');
	console.log('   - Vuelve a abrir la app');
	console.log('');
	console.log('💡 Alternativa: Usa el botón "Limpiar Auth" en la pantalla de debug (si está disponible)');
	console.log('');
	console.log('🔧 Para desarrollo, también puedes:');
	console.log('   - Detener el servidor de desarrollo (Ctrl+C)');
	console.log('   - Ejecutar: npx expo start --clear');
	console.log('');
};

clearOnboarding();
