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
	 * Valida si el token actual es válido (solo verifica existencia en storage)
	 * No hace petición al servidor - el token se valida automáticamente en cada petición
	 */
	static async validateToken(): Promise<TokenValidationResult> {
		try {
			console.log('🔍 TokenValidator: Verificando token en storage...');

			// Verificar si existe un token en storage
			const token = await storageService.getAuthToken();
			if (!token) {
				console.log('❌ TokenValidator: No se encontró token en storage');
				return {
					isValid: false,
					error: 'No se encontró token de autenticación'
				};
			}

			// Obtener datos del usuario del storage
			const user = await storageService.getCurrentUser();
			if (!user) {
				console.log('❌ TokenValidator: No se encontraron datos de usuario');
				return {
					isValid: false,
					error: 'No se encontraron datos de usuario'
				};
			}

			console.log('✅ TokenValidator: Token encontrado en storage, asumiendo válido');
			return {
				isValid: true,
				user: user
			};
		} catch (error) {
			console.error('❌ TokenValidator: Error inesperado:', error);
			return {
				isValid: false,
				error: 'Error inesperado validando token'
			};
		}
	}

	/**
	 * Valida el token de forma rápida (solo verifica que exista en storage)
	 * Este método es redundante ahora que validateToken() no hace peticiones al servidor
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
