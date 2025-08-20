import {IGroup, INearbyGroupsRequest} from '@/interfaces/group';
import {GroupService} from '@/services/groupService';
import {useCallback, useState} from 'react';

interface UseGroupsValidationReturn {
	groups: IGroup[];
	isLoading: boolean;
	error: string | null;
	hasGroups: boolean;
	validateGroups: (params: INearbyGroupsRequest) => Promise<void>;
	clearGroups: () => void;
	refreshGroups: () => Promise<void>;
}

export const useGroupsValidation = (): UseGroupsValidationReturn => {
	const [groups, setGroups] = useState<IGroup[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastParams, setLastParams] = useState<INearbyGroupsRequest | null>(null);

	const validateGroups = useCallback(async (params: INearbyGroupsRequest) => {
		setIsLoading(true);
		setError(null);
		setLastParams(params);

		try {
			console.log('🔍 Validando grupos cercanos:', {
				lat: params.latitude,
				lng: params.longitude,
				radius: params.radius,
				category: params.category
			});

			const nearbyGroups = await GroupService.getNearbyGroups(params);

			console.log('✅ Grupos encontrados:', nearbyGroups.length);

			setGroups(nearbyGroups);
			setError(null);
		} catch (error) {
			console.error('❌ Error validando grupos:', error);

			// Manejar diferentes tipos de errores
			if (error instanceof Error) {
				if (error.message.includes('network') || error.message.includes('fetch')) {
					setError('Error de conexión. Verifica tu conexión a internet.');
				} else if (error.message.includes('401') || error.message.includes('unauthorized')) {
					setError('Sesión expirada. Por favor inicia sesión nuevamente.');
				} else if (error.message.includes('400') || error.message.includes('bad request')) {
					setError('Datos de ubicación inválidos.');
				} else {
					setError('Error al buscar grupos. Intenta de nuevo.');
				}
			} else {
				setError('Error inesperado al buscar grupos.');
			}

			// En desarrollo, usar datos mock como fallback
			if (process.env.NODE_ENV === 'development') {
				console.log('🔄 Usando datos mock como fallback...');
				const mockGroups: IGroup[] = [
					{
						id: 'mock-1',
						name: 'Grupo Running Madrid',
						description: 'Grupo de running en Madrid',
						address: 'Parque del Retiro, Madrid',
						latitude: 40.4168,
						longitude: -3.7038,
						distance: 2.5,
						members: 15,
						maxMembers: 20,
						category: 'Running',
						createdBy: 'user123',
						createdAt: new Date().toISOString(),
						isActive: true
					}
				];
				setGroups(mockGroups);
			} else {
				setGroups([]);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	const clearGroups = useCallback(() => {
		setGroups([]);
		setError(null);
		setLastParams(null);
	}, []);

	const refreshGroups = useCallback(async () => {
		if (lastParams) {
			await validateGroups(lastParams);
		}
	}, [lastParams, validateGroups]);

	const hasGroups = groups.length > 0;

	return {
		groups,
		isLoading,
		error,
		hasGroups,
		validateGroups,
		clearGroups,
		refreshGroups
	};
};
