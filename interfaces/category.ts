/**
 * Interfaz para el objeto categoría que viene de la API
 */
export interface ICategory {
	_id: string;
	name: string;
	description: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Interfaz para la respuesta de categorías de grupos
 */
export interface IGroupCategoriesResponse {
	message: string;
	data: ICategory[];
}

/**
 * Interfaz para el cache de categorías
 */
export interface ICachedCategories {
	categories: ICategory[];
	timestamp: number;
	version: number;
}
