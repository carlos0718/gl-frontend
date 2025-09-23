// Adaptada de la interfaz del backend
export interface IUser {
	_id: string; // MongoDB usa _id, no id
	id?: string; // Mantener compatibilidad si es necesario
	name: string;
	lastName: string;
	email: string;
	age?: number;
	gender?: 'male' | 'female' | 'Otro';
	doneOnboarding?: boolean; // Campo para indicar si el usuario completó el onboarding
	phone?: string;
	country?: string;
	city?: string;
	postalCode?: string;
	address?: string;
	activities?: string[];
	role?: string[];
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
	// ... puedes agregar más campos que necesites en el frontend
}

// Interfaz para la respuesta de la API de login
export interface IAuthResponse {
	success: boolean;
	message: string;
	data: {
		token: string;
		user: IUser;
	};
}

export interface IRegisterResponse {
	success: boolean;
	message: string;
	data: IUser;
}
