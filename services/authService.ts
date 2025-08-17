import {AuthResponse} from '@/interfaces/user';

import apiService from './apiService';

const login = async (email: string, password: string): Promise<AuthResponse> => {
	const response = await apiService<AuthResponse>('auth/login', {
		method: 'POST',
		body: {email, password}
	});
	return response;
};

// Aquí podrías agregar otras funciones como register, logout, etc.

export const authService = {
	login
};
