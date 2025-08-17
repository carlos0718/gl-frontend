import apiService from './apiService';

export interface Group {
	id: string;
	name: string;
	description: string;
	address: string;
	latitude: number;
	longitude: number;
	distance?: number;
	members: number;
	maxMembers: number;
	category: string;
	createdBy: string;
	createdAt: string;
	isActive: boolean;
}

export interface CreateGroupRequest {
	name: string;
	description: string;
	address: string;
	latitude: number;
	longitude: number;
	maxMembers: number;
	category: string;
}

export interface NearbyGroupsRequest {
	latitude: number;
	longitude: number;
	radius: number;
	category?: string;
}

export class GroupService {
	// Obtener grupos cercanos
	static async getNearbyGroups(params: NearbyGroupsRequest): Promise<Group[]> {
		try {
			const queryParams = new URLSearchParams({
				lat: params.latitude.toString(),
				lng: params.longitude.toString(),
				radius: params.radius.toString(),
				...(params.category && {category: params.category})
			});

			return await apiService<Group[]>(`groups/nearby?${queryParams}`, {
				method: 'GET',
				needsAuth: true
			});
		} catch (error) {
			console.error('Error fetching nearby groups:', error);
			throw error;
		}
	}

	// Crear un nuevo grupo
	static async createGroup(groupData: CreateGroupRequest): Promise<Group> {
		try {
			return await apiService<Group>('groups', {
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
	static async getGroupDetails(groupId: string): Promise<Group> {
		try {
			return await apiService<Group>(`groups/${groupId}`, {
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
