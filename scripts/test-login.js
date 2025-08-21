#!/usr/bin/env node

/**
 * Script para probar el endpoint de login del backend
 * Uso: node scripts/test-login.js
 */

const http = require('http');
const {Buffer} = require('buffer');

const testLogin = () => {
	console.log('🧪 Probando endpoint de login...');
	console.log('🌐 URL: http://192.168.0.10:3000/api/auth/login');
	console.log('');

	// Datos de prueba (usar un usuario que ya exista)
	const testData = {
		email: 'admin3@gl.com',
		password: 'admin123#'
	};

	const postData = JSON.stringify(testData);

	const options = {
		hostname: '192.168.0.10',
		port: 3000,
		path: '/api/auth/login',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData)
		}
	};

	console.log('📤 Enviando datos de login:', testData);
	console.log('');

	const req = http.request(options, (res) => {
		console.log(`📡 Status: ${res.statusCode}`);
		console.log(`📋 Headers:`, res.headers);
		console.log('');

		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		});

		res.on('end', () => {
			console.log('📥 Respuesta del servidor:');
			try {
				const response = JSON.parse(data);
				console.log(JSON.stringify(response, null, 2));

				if (res.statusCode === 200) {
					console.log('✅ Login exitoso!');
					if (response.token) {
						console.log('🔑 Token obtenido:', response.token.substring(0, 20) + '...');
					} else {
						console.log('⚠️ No se recibió token en la respuesta');
					}
				} else {
					console.log('❌ Error en el login');
				}
			} catch (error) {
				console.log('📄 Respuesta (texto):', error);
			}
		});
	});

	req.on('error', (error) => {
		console.error('❌ Error de conexión:', error.message);
		console.log('💡 Asegúrate de que el backend tenga el endpoint /api/auth/login');
	});

	req.on('timeout', () => {
		console.error('⏰ Timeout: El servidor no respondió en 10 segundos');
		req.destroy();
	});

	req.setTimeout(10000);
	req.write(postData);
	req.end();
};

testLogin();
