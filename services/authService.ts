import {API_CONFIG} from '../config/api';
import {IAuthResponse, IRegisterResponse, IUser} from '../interfaces/user';
import apiService from './apiService';
import {storageService} from './storageService';

// Interfaz para el registro
export interface IRegisterRequest {
	name: string;
	lastName: string;
	email: string;
	password: string;
	age: number;
	birthDate: string; // Formato: YYYY-MM-DD
	gender: 'male' | 'female' | 'Otro';
	phone: string;
}

// Interfaz para cambio de contraseña
export interface IChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
}

// Interfaz para recuperar contraseña
export interface IForgotPasswordRequest {
	email: string;
}

/**
 * Servicio de autenticación completo
 */
export const authService = {
	/**
	 * Iniciar sesión con email y contraseña
	 */
	async login(email: string, password: string): Promise<IAuthResponse> {
		try {
			console.log('🔐 Iniciando sesión para:', email);

			const response = await apiService<IAuthResponse>(API_CONFIG.AUTH_ENDPOINTS.LOGIN, {
				method: 'POST',
				body: {email, password},
				needsAuth: false // Login no requiere autenticación previa
			});
			console.log('🟢 Response Login:', response);
			// Guardar token y datos del usuario (usuario existente)
			await storageService.saveAuthData(response.data.token, response.data.user);

			console.log('✅ Login exitoso para:', response.data.user.email);
			return response;
		} catch (error) {
			console.error('❌ Error en login:', error);

			// Si es un error de red, mostrar mensaje más amigable
			if (error instanceof Error && error.message.includes('Network request failed')) {
				throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000');
			}

			throw error;
		}
	},

	/**
	 * Registrar nuevo usuario (solo registro, sin login)
	 */
	async register(userData: IRegisterRequest): Promise<void> {
		try {
			console.log('📝 Registrando nuevo usuario:', userData.email);

			// Registrar usuario
			const registerResponse = await apiService<IRegisterResponse>(API_CONFIG.AUTH_ENDPOINTS.REGISTER, {
				method: 'POST',
				body: userData,
				needsAuth: false // Registro no requiere autenticación previa
			});

			console.log('✅ Usuario registrado exitosamente:', registerResponse.data.email);
		} catch (error) {
			console.error('❌ Error en registro:', error);
			throw error;
		}
	},

	/**
	 * Cerrar sesión
	 */
	async logout(): Promise<void> {
		try {
			console.log('🚪 Cerrando sesión...');

			// Opcional: Notificar al backend sobre el logout
			try {
				await apiService(API_CONFIG.AUTH_ENDPOINTS.LOGOUT, {
					method: 'POST',
					needsAuth: true
				});
			} catch (error) {
				console.warn('⚠️ No se pudo notificar logout al backend:', error);
			}

			// Limpiar datos locales
			await storageService.clearAuthData();

			console.log('✅ Logout exitoso');
		} catch (error) {
			console.error('❌ Error en logout:', error);
			// Aún así limpiamos los datos locales
			await storageService.clearAuthData();
			throw error;
		}
	},

	/**
	 * Verificar si el usuario está autenticado
	 */
	async isAuthenticated(): Promise<boolean> {
		return await storageService.isAuthenticated();
	},

	/**
	 * Obtener el token actual
	 */
	async getToken(): Promise<string | null> {
		return await storageService.getAuthToken();
	},

	/**
	 * Obtener datos del usuario actual
	 */
	async getCurrentUser(): Promise<IUser | null> {
		return await storageService.getCurrentUser();
	},

	/**
	 * Actualizar datos del usuario
	 */
	async updateUserData(userData: IUser): Promise<void> {
		await storageService.updateUserData(userData);
	},

	/**
	 * Cambiar contraseña
	 */
	async changePassword(passwordData: IChangePasswordRequest): Promise<void> {
		try {
			console.log('🔒 Cambiando contraseña...');

			await apiService(API_CONFIG.AUTH_ENDPOINTS.CHANGE_PASSWORD, {
				method: 'POST',
				body: passwordData,
				needsAuth: true
			});

			console.log('✅ Contraseña cambiada exitosamente');
		} catch (error) {
			console.error('❌ Error cambiando contraseña:', error);
			throw error;
		}
	},

	/**
	 * Solicitar recuperación de contraseña
	 */
	async forgotPassword(email: string): Promise<void> {
		try {
			console.log('📧 Solicitando recuperación de contraseña para:', email);

			await apiService(API_CONFIG.AUTH_ENDPOINTS.FORGOT_PASSWORD, {
				method: 'POST',
				body: {email},
				needsAuth: false
			});

			console.log('✅ Solicitud de recuperación enviada');
		} catch (error) {
			console.error('❌ Error solicitando recuperación:', error);
			throw error;
		}
	},

	/**
	 * Marcar onboarding como completado en el backend
	 */
	async markOnboardingComplete(): Promise<void> {
		try {
			console.log('✅ Marcando onboarding como completado en el backend...');

			// Obtener el ID del usuario actual
			const userId = await storageService.getCurrentUserId();
			if (!userId) {
				throw new Error('No se pudo obtener el ID del usuario actual');
			}

			await apiService(API_CONFIG.AUTH_ENDPOINTS.MARK_ONBOARDING_COMPLETE, {
				method: 'PUT',
				body: {
					userId: userId,
					doneOnboarding: true
				},
				needsAuth: true
			});

			console.log('✅ Onboarding marcado como completado exitosamente');
		} catch (error) {
			console.error('❌ Error marcando onboarding como completado:', error);
			throw error;
		}
	},

	/**
	 * Limpiar datos de autenticación
	 */
	async clearAuthData(): Promise<void> {
		await storageService.clearAuthData();
	}
};
