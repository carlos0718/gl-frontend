#!/usr/bin/env node

/**
 * Script para verificar si el backend está corriendo
 * Uso: node scripts/check-backend.js
 */

const http = require('http');

const checkBackend = () => {
	const options = {
		hostname: 'localhost',
		port: 3000,
		path: '/api/health',
		method: 'GET',
		timeout: 5000
	};

	console.log('🔍 Verificando si el backend está corriendo en http://localhost:3000...');

	const req = http.request(options, (res) => {
		console.log('✅ Backend está corriendo!');
		console.log(`📡 Status: ${res.statusCode}`);
		console.log('🌐 URL: http://localhost:3000');
		console.log('');
		console.log('📋 Para iniciar el backend:');
		console.log('1. Ve a la carpeta del backend');
		console.log('2. Ejecuta: npm start o npm run dev');
		console.log('3. Asegúrate de que el puerto 3000 esté disponible');
	});

	req.on('error', (error) => {
		console.log('❌ Backend no está corriendo');
		console.log('🔧 Error:', error.message);
		console.log('');
		console.log('📋 Para solucionar:');
		console.log('1. Verifica que el backend esté instalado y corriendo');
		console.log('2. Asegúrate de que el puerto 3000 esté disponible');
		console.log('3. Si no tienes backend, la app funcionará en modo desarrollo');
		console.log('');
		console.log('💡 La app funcionará con datos simulados si el backend no está disponible');
	});

	req.on('timeout', () => {
		console.log('⏰ Timeout: El backend no respondió en 5 segundos');
		req.destroy();
	});

	req.end();
};

checkBackend();
