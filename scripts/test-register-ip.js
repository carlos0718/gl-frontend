#!/usr/bin/env node

/**
 * Script para probar el endpoint de registro del backend con IP real
 * Uso: node scripts/test-register-ip.js
 */

const http = require('http');
const {Buffer} = require('buffer');

const testRegister = () => {
	console.log('🧪 Probando endpoint de registro con IP real...');
	console.log('🌐 URL: http://192.168.0.10:3000/api/auth/register');
	console.log('');

	// Datos de prueba con los campos requeridos por el backend
	const testData = {
		name: 'Test',
		lastName: 'User',
		email: 'test@test.com',
		password: 'test123',
		age: 25,
		birthDate: '1998-01-01',
		gender: 'male',
		phone: '1234567890'
	};

	const postData = JSON.stringify(testData);

	const options = {
		hostname: '192.168.0.10',
		port: 3000,
		path: '/api/auth/register',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData)
		}
	};

	console.log('📤 Enviando datos:', testData);
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

				if (res.statusCode === 200 || res.statusCode === 201) {
					console.log('✅ Registro exitoso!');
				} else {
					console.log('❌ Error en el registro');
					console.log('💡 Verifica los campos requeridos en tu backend');
				}
			} catch (error) {
				console.log('📄 Respuesta (texto):', data);
			}
		});
	});

	req.on('error', (error) => {
		console.error('❌ Error de conexión:', error.message);
		console.log('💡 Asegúrate de que:');
		console.log('   1. El backend esté corriendo en http://192.168.0.10:3000');
		console.log('   2. El backend esté configurado para escuchar en 0.0.0.0:3000');
		console.log('   3. El firewall permita conexiones al puerto 3000');
	});

	req.on('timeout', () => {
		console.error('⏰ Timeout: El servidor no respondió en 10 segundos');
		req.destroy();
	});

	req.setTimeout(10000);
	req.write(postData);
	req.end();
};

testRegister();
