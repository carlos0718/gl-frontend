// Adaptada de la interfaz del backend
export interface IUser {
	id: string;
	name: string;
	lastName: string;
	email: string;
	age?: number;
	gender?: 'male' | 'female' | 'Otro';
	doneOnboarding?: boolean; // Campo para indicar si el usuario completó el onboarding
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
