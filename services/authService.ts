import {API_CONFIG} from '@/config/api';
import {IAuthResponse, IRegisterResponse, IUser} from '@/interfaces/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

import apiService from './apiService';

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
			await this.saveAuthData(response.data.token, response.data.user, false);

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
			await this.clearAuthData();

			console.log('✅ Logout exitoso');
		} catch (error) {
			console.error('❌ Error en logout:', error);
			// Aún así limpiamos los datos locales
			await this.clearAuthData();
			throw error;
		}
	},

	/**
	 * Verificar si el usuario está autenticado
	 */
	async isAuthenticated(): Promise<boolean> {
		try {
			const token = await AsyncStorage.getItem('authToken');
			return !!token;
		} catch (error) {
			console.error('❌ Error verificando autenticación:', error);
			return false;
		}
	},

	/**
	 * Obtener el token actual
	 */
	async getToken(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem('authToken');
		} catch (error) {
			console.error('❌ Error obteniendo token:', error);
			return null;
		}
	},

	/**
	 * Obtener datos del usuario actual
	 */
	async getCurrentUser(): Promise<IUser | null> {
		try {
			const userData = await AsyncStorage.getItem('userData');
			return userData ? JSON.parse(userData) : null;
		} catch (error) {
			console.error('❌ Error obteniendo datos del usuario:', error);
			return null;
		}
	},

	/**
	 * Actualizar datos del usuario
	 */
	async updateUserData(userData: IUser): Promise<void> {
		try {
			await AsyncStorage.setItem('userData', JSON.stringify(userData));
			console.log('✅ Datos del usuario actualizados');
		} catch (error) {
			console.error('❌ Error actualizando datos del usuario:', error);
			throw error;
		}
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
	 * Guardar datos de autenticación
	 */
	async saveAuthData(token: string, user: IUser, isNewUser: boolean = false): Promise<void> {
		try {
			const dataToSave: [string, string][] = [
				['authToken', token],
				['userData', JSON.stringify(user)]
			];
			console.log('💾 Datos de autenticación guardados', dataToSave);
			// Si es un usuario existente (login), marcar onboarding como completo
			// Si es un usuario nuevo (registro), el onboarding se marcará después del wizard
			if (!isNewUser) {
				dataToSave.push(['onboardingComplete', 'true']);
			}

			await AsyncStorage.multiSet(dataToSave);
			console.log('💾 Datos de autenticación guardados');
		} catch (error) {
			console.error('❌ Error guardando datos de autenticación:', error);
			throw error;
		}
	},

	/**
	 * Guardar datos completos del onboarding (incluye registro + datos adicionales)
	 */
	async saveOnboardingData(authResponse: IAuthResponse, additionalData: any): Promise<void> {
		try {
			console.log('💾 Guardando datos completos del onboarding...');

			// Combinar datos del registro con datos adicionales del onboarding
			const completeUserData = {
				...authResponse.data.user,
				...additionalData
			};

			const dataToSave: [string, string][] = [
				['authToken', authResponse.data.token],
				['userData', JSON.stringify(completeUserData)],
				['onboardingComplete', 'true'] // Marcar onboarding como completo
			];

			await AsyncStorage.multiSet(dataToSave);
			console.log('✅ Datos del onboarding guardados exitosamente');
		} catch (error) {
			console.error('❌ Error guardando datos del onboarding:', error);
			throw error;
		}
	},

	/**
	 * Limpiar datos de autenticación
	 */
	async clearAuthData(): Promise<void> {
		try {
			await AsyncStorage.multiRemove(['authToken', 'userData', 'onboardingComplete']);
			console.log('🗑️ Datos de autenticación limpiados');
		} catch (error) {
			console.error('❌ Error limpiando datos de autenticación:', error);
			throw error;
		}
	}
};
