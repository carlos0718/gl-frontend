import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_CONFIG} from '../config/api';
import {ICachedCategories, ICategory, IGroupCategoriesResponse} from '../interfaces/category';
import apiService from './apiService';

/**
 * Servicio especializado para el manejo de categorías con cache inteligente
 *
 * Estrategia:
 * 1. Intenta cargar desde cache si es válido (menos de 24 horas)
 * 2. Si no hay cache o expiró, intenta cargar desde API con autenticación
 * 3. Si falla la autenticación, intenta sin autenticación
 * 4. Guarda en cache el resultado exitoso
 * 5. En caso de error total, devuelve categorías por defecto
 */
export class CategoriesService {
	private static readonly CACHE_KEY = 'groupCategories';
	private static readonly CACHE_VERSION = 1;
	private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en millisegundos

	/**
	 * Obtiene las categorías con estrategia de cache inteligente
	 */
	static async getCategories(): Promise<string[]> {
		try {
			console.log('📋 CategoriesService: Iniciando obtención de categorías...');

			// Paso 1: Intentar cargar desde cache
			const cachedCategories = await this.getCachedCategories();
			if (cachedCategories && this.isCacheValid(cachedCategories) && cachedCategories.categories.length > 0) {
				console.log('✅ CategoriesService: Categorías cargadas desde cache', cachedCategories.categories.length, 'categorías');
				// Extraer solo los nombres de las categorías
				return cachedCategories.categories.map((cat) => cat.name);
			}

			// Si el cache está vacío o no tiene categorías válidas, limpiarlo y continuar con la API
			if (cachedCategories && cachedCategories.categories.length === 0) {
				console.log('⚠️ CategoriesService: Cache válido pero vacío, limpiando y cargando desde API...');
				await this.clearEmptyCache();
			}

			console.log('⏰ CategoriesService: Cache no válido o inexistente, cargando desde API...');

			// Paso 2: Intentar cargar desde API
			const apiCategories = await this.fetchCategoriesFromAPI();

			// Paso 3: Guardar en cache
			await this.saveCategoriesCache(apiCategories);

			console.log('✅ CategoriesService: Categorías cargadas desde API y guardadas en cache');
			// Extraer solo los nombres de las categorías
			return apiCategories.map((cat) => cat.name);
		} catch (error) {
			console.error('❌ CategoriesService: Error obteniendo categorías:', error);

			// Paso 4: Intentar usar cache expirado como fallback (solo si tiene categorías)
			const expiredCache = await this.getCachedCategories();
			if (expiredCache && expiredCache.categories.length > 0) {
				console.log('⚠️ CategoriesService: Usando cache expirado como fallback');
				return expiredCache.categories.map((cat) => cat.name);
			}

			// Paso 5: Último recurso - categorías por defecto
			console.log('🔄 CategoriesService: Usando categorías por defecto');
			return [];
		}
	}

	/**
	 * Fuerza la recarga de categorías desde la API
	 */
	static async forceRefresh(): Promise<string[]> {
		try {
			console.log('🔄 CategoriesService: Forzando recarga desde API...');

			const apiCategories = await this.fetchCategoriesFromAPI();
			await this.saveCategoriesCache(apiCategories);

			console.log('✅ CategoriesService: Recarga forzada completada');
			return apiCategories.map((cat) => cat.name);
		} catch (error) {
			console.error('❌ CategoriesService: Error en recarga forzada:', error);
			throw error;
		}
	}

	/**
	 * Limpia el cache de categorías
	 */
	static async clearCache(): Promise<void> {
		try {
			await AsyncStorage.removeItem(this.CACHE_KEY);
			console.log('🗑️ CategoriesService: Cache limpiado');
		} catch (error) {
			console.error('❌ CategoriesService: Error limpiando cache:', error);
		}
	}

	/**
	 * Limpia el cache si está vacío o corrupto
	 */
	static async clearEmptyCache(): Promise<void> {
		try {
			const cached = await this.getCachedCategories();
			if (cached && cached.categories.length === 0) {
				await AsyncStorage.removeItem(this.CACHE_KEY);
				console.log('🗑️ CategoriesService: Cache vacío limpiado');
			}
		} catch (error) {
			console.error('❌ CategoriesService: Error limpiando cache vacío:', error);
		}
	}

	/**
	 * Obtiene información del estado del cache
	 */
	static async getCacheInfo(): Promise<{
		hasCache: boolean;
		isValid: boolean;
		categoriesCount: number;
		cacheAge: number;
	} | null> {
		try {
			const cached = await this.getCachedCategories();
			if (!cached) {
				return null;
			}

			const isValid = this.isCacheValid(cached);
			const cacheAge = Date.now() - cached.timestamp;

			return {
				hasCache: true,
				isValid,
				categoriesCount: cached.categories.length,
				cacheAge
			};
		} catch (error) {
			console.error('❌ CategoriesService: Error obteniendo info del cache:', error);
			return null;
		}
	}

	// Métodos privados

	/**
	 * Obtiene las categorías desde la API con estrategia de fallback
	 */
	private static async fetchCategoriesFromAPI(): Promise<ICategory[]> {
		console.log('🌐 CategoriesService: Obteniendo categorías desde API...');

		// Intentar primero con autenticación
		try {
			const response = await apiService<IGroupCategoriesResponse>(API_CONFIG.GROUPS_ENDPOINTS.CATEGORIES, {
				method: 'GET',
				needsAuth: true
			});

			const categories = response.data || [];
			if (!Array.isArray(categories)) {
				throw new Error('La respuesta de la API no contiene un array válido');
			}

			console.log('✅ CategoriesService: Categorías obtenidas con autenticación');
			return categories;
		} catch (authError) {
			console.log('⚠️ CategoriesService: Error con autenticación, intentando sin auth...', authError);

			// Si falla con autenticación, intentar sin ella
			try {
				const response = await apiService<IGroupCategoriesResponse>(API_CONFIG.GROUPS_ENDPOINTS.CATEGORIES, {
					method: 'GET',
					needsAuth: false
				});

				const categories = response.data || [];
				if (!Array.isArray(categories)) {
					throw new Error('La respuesta de la API no contiene un array válido');
				}

				console.log('✅ CategoriesService: Categorías obtenidas sin autenticación');
				return categories;
			} catch (noAuthError) {
				console.error('❌ CategoriesService: Error también sin autenticación:', noAuthError);
				throw noAuthError;
			}
		}
	}

	/**
	 * Obtiene las categorías desde el cache
	 */
	private static async getCachedCategories(): Promise<ICachedCategories | null> {
		try {
			const cached = await AsyncStorage.getItem(this.CACHE_KEY);
			if (!cached) {
				return null;
			}

			const parsedCache: ICachedCategories = JSON.parse(cached);

			// Verificar versión del cache
			if (parsedCache.version !== this.CACHE_VERSION) {
				console.log('📦 CategoriesService: Versión de cache obsoleta, ignorando');
				return null;
			}

			return parsedCache;
		} catch (error) {
			console.error('❌ CategoriesService: Error leyendo cache:', error);
			return null;
		}
	}

	/**
	 * Verifica si el cache es válido (no ha expirado)
	 */
	private static isCacheValid(cached: ICachedCategories): boolean {
		const now = Date.now();
		const cacheAge = now - cached.timestamp;
		const isValid = cacheAge < this.CACHE_DURATION;

		console.log(`📦 CategoriesService: Cache age: ${Math.round(cacheAge / (60 * 1000))} minutos, válido: ${isValid}`);
		return isValid;
	}

	/**
	 * Guarda las categorías en el cache
	 */
	private static async saveCategoriesCache(categories: ICategory[]): Promise<void> {
		try {
			const cacheData: ICachedCategories = {
				categories,
				timestamp: Date.now(),
				version: this.CACHE_VERSION
			};

			await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
			console.log('💾 CategoriesService: Categorías guardadas en cache');
		} catch (error) {
			console.error('❌ CategoriesService: Error guardando cache:', error);
			// No lanzamos el error porque el cache es opcional
		}
	}
}
