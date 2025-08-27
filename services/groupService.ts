import {API_CONFIG} from '../config/api';
import {ICreateGroupRequest, IGroup, INearbyGroupsRequest} from '../interfaces/group';
import apiService from './apiService';
import {CategoriesService} from './categoriesService';

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
			console.log('📋 GroupService: Delegando obtención de categorías al CategoriesService...');
			return await CategoriesService.getCategories();
		} catch (error) {
			console.error('❌ GroupService: Error obteniendo categorías:', error);
			// El CategoriesService ya maneja el fallback, pero por si acaso
			return [
				'Fitness y Ejercicio',
				'Running y Atletismo',
				'Deportes de Equipo',
				'Yoga y Meditación',
				'Natación y Deportes Acuáticos',
				'Ciclismo',
				'Artes Marciales',
				'Baile y Danza',
				'Deportes de Aventura',
				'Otros'
			];
		}
	}
}

// Exportación nombrada ya está disponible
