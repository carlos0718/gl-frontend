import AsyncStorage from '@react-native-async-storage/async-storage';

import {IUser} from '../interfaces/user';

/**
 * Servicio para manejar el almacenamiento local de la aplicación
 * Separa la lógica de storage de la lógica de APIs
 */
export const storageService = {
	/**
	 * Guardar datos de autenticación en storage local
	 */
	async saveAuthData(token: string, user: IUser): Promise<void> {
		try {
			const dataToSave: [string, string][] = [
				['authToken', token],
				['userData', JSON.stringify(user)]
			];

			// Usar el estado real del usuario desde el backend
			// Si el usuario tiene doneOnboarding: true, marcar como completo
			// Si tiene doneOnboarding: false, mantener como incompleto
			const onboardingComplete = user.doneOnboarding ? 'true' : 'false';
			dataToSave.push(['onboardingComplete', onboardingComplete]);

			console.log('💾 Guardando datos de autenticación con onboarding:', onboardingComplete);

			await AsyncStorage.multiSet(dataToSave);
			console.log('✅ Datos de autenticación guardados exitosamente');
		} catch (error) {
			console.error('❌ Error guardando datos de autenticación:', error);
			throw error;
		}
	},

	/**
	 * Obtener token de autenticación
	 */
	async getAuthToken(): Promise<string | null> {
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
	 * Verificar si el onboarding está completo
	 */
	async isOnboardingComplete(): Promise<boolean> {
		try {
			const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
			return onboardingComplete === 'true';
		} catch (error) {
			console.error('❌ Error verificando onboarding:', error);
			return false;
		}
	},

	/**
	 * Actualizar datos del usuario en storage
	 */
	async updateUserData(userData: IUser): Promise<void> {
		try {
			await AsyncStorage.setItem('userData', JSON.stringify(userData));
			console.log('✅ Datos del usuario actualizados en storage');
		} catch (error) {
			console.error('❌ Error actualizando datos del usuario:', error);
			throw error;
		}
	},

	/**
	 * Marcar onboarding como completo en storage
	 */
	async markOnboardingComplete(): Promise<void> {
		try {
			await AsyncStorage.setItem('onboardingComplete', 'true');
			console.log('✅ Onboarding marcado como completo en storage');
		} catch (error) {
			console.error('❌ Error marcando onboarding como completo:', error);
			throw error;
		}
	},

	/**
	 * Limpiar todos los datos de autenticación
	 */
	async clearAuthData(): Promise<void> {
		try {
			await AsyncStorage.multiRemove(['authToken', 'userData', 'onboardingComplete']);
			console.log('🗑️ Datos de autenticación limpiados del storage');
		} catch (error) {
			console.error('❌ Error limpiando datos de autenticación:', error);
			throw error;
		}
	},

	/**
	 * Limpiar solo el estado de onboarding
	 */
	async clearOnboardingStatus(): Promise<void> {
		try {
			await AsyncStorage.removeItem('onboardingComplete');
			console.log('🗑️ Estado de onboarding limpiado');
		} catch (error) {
			console.error('❌ Error limpiando estado de onboarding:', error);
			throw error;
		}
	},

	/**
	 * Obtener el ID del usuario actual (compatible con MongoDB _id)
	 */
	async getCurrentUserId(): Promise<string | null> {
		try {
			const user = await this.getCurrentUser();
			// Usar _id (MongoDB) o id como fallback
			return user?._id || user?.id || null;
		} catch (error) {
			console.error('❌ Error obteniendo ID del usuario:', error);
			return null;
		}
	}
};
