import {ICreateGroupRequest, IGroup, INearbyGroupsRequest} from '@/interfaces/group';

import apiService from './apiService';

export class GroupService {
	// Obtener grupos cercanos
	static async getNearbyGroups(params: INearbyGroupsRequest): Promise<IGroup[]> {
		try {
			const queryParams = new URLSearchParams({
				lat: params.latitude.toString(),
				lng: params.longitude.toString(),
				radius: params.radius.toString(),
				...(params.category && {category: params.category})
			});

			return await apiService<IGroup[]>(`groups/nearby?${queryParams}`, {
				method: 'GET',
				needsAuth: true
			});
		} catch (error) {
			console.error('Error fetching nearby groups:', error);
			throw error;
		}
	}

	// Crear un nuevo grupo
	static async createGroup(groupData: ICreateGroupRequest): Promise<IGroup> {
		try {
			return await apiService<IGroup>('groups', {
				method: 'POST',
				body: groupData,
				needsAuth: true
			});
		} catch (error) {
			console.error('Error creating group:', error);
			throw error;
		}
	}

	// Unirse a un grupo
	static async joinGroup(groupId: string): Promise<{success: boolean; message: string}> {
		try {
			return await apiService<{success: boolean; message: string}>(`groups/${groupId}/join`, {
				method: 'POST',
				needsAuth: true
			});
		} catch (error) {
			console.error('Error joining group:', error);
			throw error;
		}
	}

	// Obtener detalles de un grupo
	static async getGroupDetails(groupId: string): Promise<IGroup> {
		try {
			return await apiService<IGroup>(`groups/${groupId}`, {
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
			return await apiService<string[]>('groups/categories', {
				method: 'GET',
				needsAuth: false
			});
		} catch (error) {
			console.error('Error fetching group categories:', error);
			// Retornar categorías por defecto en caso de error
			return ['Running', 'Crossfit', 'Yoga', 'Fútbol', 'Baloncesto', 'Natación', 'Ciclismo', 'Otros'];
		}
	}
}

// Exportación nombrada ya está disponible
