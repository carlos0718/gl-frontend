import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type RequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	headers?: Record<string, string>;
	body?: any;
	needsAuth?: boolean;
};

async function apiService<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
	const {method = 'GET', body, needsAuth = false} = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...options.headers
	};

	if (needsAuth) {
		const token = await AsyncStorage.getItem('authToken');
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		} else {
			// Podrías redirigir al login o manejar el caso donde el token no existe
			console.warn('Petición necesita autenticación pero no se encontró el token.');
		}
	}

	const config: RequestInit = {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined
	};

	try {
		const response = await fetch(`${API_URL}/${endpoint}`, config);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({message: 'Error desconocido en la API'}));
			throw new Error(errorData.message || `Error en la petición: ${response.status}`);
		}

		// Si la respuesta no tiene cuerpo (ej. en un DELETE o un 204 No Content),
		// devolvemos un objeto vacío para evitar errores al parsear el JSON.
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.indexOf('application/json') !== -1) {
			return response.json();
		} else {
			return {} as T;
		}
	} catch (error) {
		console.error('Error en apiService:', error);
		// Re-lanzamos el error para que el llamador pueda manejarlo
		throw error;
	}
}

export default apiService;
