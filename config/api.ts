// Configuración de APIs
export const API_CONFIG = {
	// Google Places API
	GOOGLE_PLACES_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
	GOOGLE_PLACES_API_URL: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_URL || 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
	GOOGLE_GEOCODING_API_URL: process.env.EXPO_PUBLIC_GOOGLE_GEOCODING_API_URL || 'https://maps.googleapis.com/maps/api/geocode/json',
	// Backend API
	API_URL: process.env.EXPO_PUBLIC_API_URL_REDIRECT || process.env.EXPO_PUBLIC_API_URL,
	// Endpoints de grupos
	GROUPS_ENDPOINTS: {
		NEARBY: 'groups/nearby',
		CREATE: 'groups',
		DETAILS: (groupId: string) => `groups/${groupId}`,
		CATEGORIES: 'categories'
	},

	// Endpoints de autenticación
	AUTH_ENDPOINTS: {
		LOGIN: 'auth/login',
		REGISTER: 'auth/register',
		LOGOUT: 'auth/logout',
		FORGOT_PASSWORD: 'auth/forgot-password',
		CHANGE_PASSWORD: 'auth/change-password',
		REFRESH_TOKEN: 'auth/refresh-token',
		MARK_ONBOARDING_COMPLETE: 'auth/update-onboarding'
	}
};

// Validación de configuración
export const validateApiConfig = () => {
	const missingKeys = [];

	if (!API_CONFIG.GOOGLE_PLACES_API_KEY) {
		missingKeys.push('EXPO_PUBLIC_GOOGLE_PLACES_API_KEY');
	}

	if (!API_CONFIG.API_URL) {
		missingKeys.push('EXPO_PUBLIC_API_URL');
	}

	if (missingKeys.length > 0) {
		console.warn('⚠️ Variables de entorno faltantes:', missingKeys.join(', '));
		console.warn('📝 Asegúrate de configurar estas variables en tu archivo .env');
	}

	return missingKeys.length === 0;
};
