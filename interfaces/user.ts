// Adaptada de la interfaz del backend
export interface IUser {
	id: string;
	name: string;
	lastName: string;
	email: string;
	age?: number;
	gender?: 'male' | 'female' | 'Otro';
	// ... puedes agregar más campos que necesites en el frontend
}

// Interfaz para la respuesta de la API de login
export interface IAuthResponse {
	token: string;
	user: IUser;
}
