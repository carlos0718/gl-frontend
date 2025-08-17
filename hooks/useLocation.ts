import {useCallback, useState} from 'react';

interface Location {
	latitude: number;
	longitude: number;
	address: string;
}

interface UseLocationReturn {
	location: Location | null;
	setLocation: (location: Location | null) => void;
	getCoordinatesFromAddress: (address: string) => Promise<Location | null>;
	isLoading: boolean;
}

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export const useLocation = (): UseLocationReturn => {
	const [location, setLocation] = useState<Location | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const getCoordinatesFromAddress = useCallback(async (address: string): Promise<Location | null> => {
		if (!GOOGLE_PLACES_API_KEY) {
			console.warn('Google Places API key not found');
			return null;
		}

		setIsLoading(true);
		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_PLACES_API_KEY}`
			);
			const data = await response.json();

			if (data.results && data.results.length > 0) {
				const locationData = data.results[0].geometry.location;
				return {
					latitude: locationData.lat,
					longitude: locationData.lng,
					address: address
				};
			}
			return null;
		} catch (error) {
			console.error('Error getting coordinates:', error);
			return null;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		location,
		setLocation,
		getCoordinatesFromAddress,
		isLoading
	};
};
