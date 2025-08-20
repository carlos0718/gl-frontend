import {API_CONFIG} from '@/config/api';
import {ICreateGroupRequest, IGroup, INearbyGroupsRequest} from '@/interfaces/group';

import apiService from './apiService';

export class GroupService {
	// Obtener grupos cercanos
	static async getNearbyGroups(params: INearbyGroupsRequest): Promise<IGroup[]> {
		try {
			console.log('🔍 Buscando grupos cercanos con parámetros:', params);

			const queryParams = new URLSearchParams({
				lat: params.latitude.toString(),
				lng: params.longitude.toString(),
				radius: params.radius.toString(),
				...(params.category && {category: params.category})
			});

			const result = await apiService<IGroup[]>(`${API_CONFIG.GROUPS_ENDPOINTS.NEARBY}?${queryParams}`, {
				method: 'GET',
				needsAuth: true
			});

			console.log('✅ Grupos cercanos obtenidos exitosamente:', result.length, 'grupos');
			return result;
		} catch (error) {
			console.error('❌ Error fetching nearby groups:', error);
			throw error;
		}
	}

	// Crear un nuevo grupo
	static async createGroup(groupData: ICreateGroupRequest): Promise<IGroup> {
		try {
			console.log('🏗️ Creando grupo con datos:', groupData);

			const result = await apiService<IGroup>(API_CONFIG.GROUPS_ENDPOINTS.CREATE, {
				method: 'POST',
				body: groupData,
				needsAuth: true
			});

			console.log('✅ Grupo creado exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error creating group:', error);
			throw error;
		}
	}

	// Obtener detalles de un grupo
	static async getGroupDetails(groupId: string): Promise<IGroup> {
		try {
			return await apiService<IGroup>(API_CONFIG.GROUPS_ENDPOINTS.DETAILS(groupId), {
				method: 'GET',
				needsAuth: true
			});
		} catch (error) {
			console.error('Error fetching group details:', error);
			throw error;
		}
	}

	// Obtener categorías de grupos disponibles
	static async getGroupCategories(): Promise<string[]> {
		try {
			console.log('📋 Obteniendo categorías de grupos...');

			// Intentar primero con autenticación
			try {
				const categories = await apiService<string[]>(API_CONFIG.GROUPS_ENDPOINTS.CATEGORIES, {
					method: 'GET',
					needsAuth: true
				});

				console.log('✅ Categorías obtenidas exitosamente (con auth):', categories);
				return categories;
			} catch (authError) {
				console.log('⚠️ Error con autenticación, intentando sin auth...', authError);

				// Si falla con autenticación, intentar sin ella
				const categories = await apiService<string[]>(API_CONFIG.GROUPS_ENDPOINTS.CATEGORIES, {
					method: 'GET',
					needsAuth: false
				});

				console.log('✅ Categorías obtenidas exitosamente (sin auth):', categories);
				return categories;
			}
		} catch (error) {
			console.error('❌ Error obteniendo categorías:', error);
			console.log('🔄 Usando categorías por defecto...');

			// Retornar categorías por defecto en caso de error
			const defaultCategories = [
				'Running',
				'Crossfit',
				'Yoga',
				'Fútbol',
				'Baloncesto',
				'Natación',
				'Ciclismo',
				'Gimnasio',
				'Calistenia',
				'Tenis',
				'Paddle',
				'Voleibol',
				'Atletismo',
				'Boxeo',
				'Kickboxing',
				'Pilates',
				'Danza',
				'Esquí',
				'Snowboard',
				'Otros'
			];

			return defaultCategories;
		}
	}
}

// Exportación nombrada ya está disponible
