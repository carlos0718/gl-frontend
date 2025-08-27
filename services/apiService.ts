import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_CONFIG} from '../config/api';
import {emitAuthEvent} from './authEventEmitter';
import {authService} from './authService';

const API_URL = API_CONFIG.API_URL;

type RequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	headers?: Record<string, string>;
	body?: any;
	needsAuth?: boolean;
};

async function apiService<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
	const {method = 'GET', body, needsAuth = false} = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...options.headers
	};

	if (needsAuth) {
		const token = await AsyncStorage.getItem('authToken');
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
			console.log('🔐 Token de autenticación encontrado y agregado');
		} else {
			console.error('❌ Petición necesita autenticación pero no se encontró el token.');
			throw new Error('401 - Token de autenticación no encontrado. Por favor inicia sesión nuevamente.');
		}
	}

	const config: RequestInit = {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined
	};

	try {
		const fullUrl = `${API_URL}/${endpoint}`;
		console.log('🌐 API Request:', fullUrl);
		console.log('📡 Request config:', {method, headers, body});

		const response = await fetch(fullUrl, config);
		console.log('🟢 Response:', response);
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({message: 'Error desconocido en la API'}));

			// Manejo específico de errores de autenticación
			if (response.status === 401) {
				console.error('🔐 Error de autenticación:', errorData);

				// Limpiar datos de autenticación automáticamente
				try {
					await authService.clearAuthData();
					console.log('🗑️ Datos de autenticación limpiados automáticamente');

					// Emitir evento de token expirado para notificar a la app
					emitAuthEvent('tokenExpired');
				} catch (clearError) {
					console.error('❌ Error limpiando datos de auth:', clearError);
				}

				throw new Error('401 - Sesión expirada o token inválido. Por favor inicia sesión nuevamente.');
			} else if (response.status === 403) {
				console.error('🚫 Error de autorización:', errorData);
				throw new Error('403 - No tienes permisos para realizar esta acción.');
			} else if (response.status === 404) {
				console.error('🔍 Recurso no encontrado:', errorData);
				throw new Error('404 - El recurso solicitado no fue encontrado.');
			} else if (response.status >= 500) {
				console.error('💥 Error del servidor:', errorData);
				throw new Error('500 - Error interno del servidor. Intenta más tarde.');
			} else {
				console.error('❌ Error en la petición:', errorData);
				throw new Error(errorData.message || `Error en la petición: ${response.status}`);
			}
		}

		// Si la respuesta no tiene cuerpo (ej. en un DELETE o un 204 No Content),
		// devolvemos un objeto vacío para evitar errores al parsear el JSON.
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.indexOf('application/json') !== -1) {
			return response.json();
		} else {
			return {} as T;
		}
	} catch (error) {
		console.error('Error en apiService:', error);
		// Re-lanzamos el error para que el llamador pueda manejarlo
		throw error;
	}
}

export default apiService;
