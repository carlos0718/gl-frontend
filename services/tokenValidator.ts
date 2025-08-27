import {API_CONFIG} from '../config/api';
import apiService from './apiService';
import {storageService} from './storageService';

interface TokenValidationResult {
	isValid: boolean;
	user?: any;
	error?: string;
}

/**
 * Servicio para validar tokens de autenticación
 * Se usa al inicio de la app para determinar si el usuario debe ir al home o al login
 */
export class TokenValidator {
	/**
	 * Valida si el token actual es válido haciendo una petición al servidor
	 */
	static async validateToken(): Promise<TokenValidationResult> {
		try {
			console.log('🔍 TokenValidator: Iniciando validación de token...');

			// Verificar si existe un token
			const token = await storageService.getAuthToken();
			if (!token) {
				console.log('❌ TokenValidator: No se encontró token');
				return {
					isValid: false,
					error: 'No se encontró token de autenticación'
				};
			}

			// Intentar hacer una petición autenticada para validar el token
			try {
				// Usar el endpoint de verificación de token
				const response = await apiService(API_CONFIG.AUTH_ENDPOINTS.VERIFY_TOKEN, {
					method: 'GET',
					needsAuth: true
				});

				console.log('✅ TokenValidator: Token válido');
				return {
					isValid: true,
					user: (response as any)?.data?.user || (response as any)?.user
				};
			} catch (apiError) {
				console.log('❌ TokenValidator: Error validando token:', apiError);

				// Si es un error 401, el token es inválido
				if (apiError instanceof Error && apiError.message.includes('401')) {
					console.log('🔐 TokenValidator: Token expirado o inválido');
					return {
						isValid: false,
						error: 'Token expirado o inválido'
					};
				}

				// Para otros errores (red, servidor, etc.), asumir que el token es válido
				// para no bloquear al usuario por problemas temporales
				console.log('⚠️ TokenValidator: Error temporal, asumiendo token válido');
				return {
					isValid: true,
					error: 'Error temporal de conexión'
				};
			}
		} catch (error) {
			console.error('❌ TokenValidator: Error inesperado:', error);
			return {
				isValid: false,
				error: 'Error inesperado validando token'
			};
		}
	}

	/**
	 * Valida el token de forma rápida (solo verifica que exista)
	 * Para casos donde no queremos hacer petición al servidor
	 */
	static async validateTokenQuick(): Promise<boolean> {
		try {
			const token = await storageService.getAuthToken();
			return !!token;
		} catch (error) {
			console.error('❌ TokenValidator: Error en validación rápida:', error);
			return false;
		}
	}

	/**
	 * Limpia datos de autenticación si el token es inválido
	 */
	static async clearInvalidAuth(): Promise<void> {
		try {
			console.log('🗑️ TokenValidator: Limpiando datos de autenticación inválidos...');
			await storageService.clearAuthData();
			console.log('✅ TokenValidator: Datos de autenticación limpiados');
		} catch (error) {
			console.error('❌ TokenValidator: Error limpiando datos:', error);
		}
	}
}
