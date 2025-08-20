# Validación de Grupos - Implementación con APIs

## Resumen

Esta implementación valida la existencia de grupos cercanos usando las APIs del backend, proporcionando una experiencia robusta y manejo de errores completo.

## Arquitectura de Validación

### Hook Personalizado: `useGroupsValidation`

```typescript
interface UseGroupsValidationReturn {
	groups: IGroup[];
	isLoading: boolean;
	error: string | null;
	hasGroups: boolean;
	validateGroups: (params: INearbyGroupsRequest) => Promise<void>;
	clearGroups: () => void;
	refreshGroups: () => Promise<void>;
}
```

**Funcionalidades:**

-   ✅ Validación automática de grupos cercanos
-   ✅ Manejo de estados de carga
-   ✅ Gestión de errores específicos
-   ✅ Fallback a datos mock en desarrollo
-   ✅ Función de recarga automática

## Flujo de Validación

### 1. Inicialización

```typescript
const {groups, isLoading, error, hasGroups, validateGroups, refreshGroups} = useGroupsValidation();
```

### 2. Validación de Grupos

```typescript
const params: INearbyGroupsRequest = {
	latitude: userLocation.latitude,
	longitude: userLocation.longitude,
	radius: searchRadius
};

await validateGroups(params);
```

### 3. Estados de Respuesta

-   **Cargando**: `isLoading = true`
-   **Con grupos**: `hasGroups = true, groups.length > 0`
-   **Sin grupos**: `hasGroups = false, groups.length = 0`
-   **Error**: `error !== null`

## API Endpoints Utilizados

### GET /groups/nearby

**Propósito:** Obtener grupos cercanos a una ubicación

**Parámetros:**

```typescript
{
  lat: number;        // Latitud del usuario
  lng: number;        // Longitud del usuario
  radius: number;     // Radio de búsqueda en km
  category?: string;  // Categoría opcional
}
```

**Respuesta:**

```typescript
IGroup[] = [
  {
    id: string;
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    distance?: number;
    members: number;
    maxMembers: number;
    category: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
  }
]
```

## Manejo de Errores

### Tipos de Errores Detectados

1. **Errores de Red**

    ```typescript
    if (error.message.includes('network') || error.message.includes('fetch')) {
    	setError('Error de conexión. Verifica tu conexión a internet.');
    }
    ```

2. **Errores de Autenticación**

    ```typescript
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
    	setError('Sesión expirada. Por favor inicia sesión nuevamente.');
    }
    ```

3. **Errores de Datos**
    ```typescript
    if (error.message.includes('400') || error.message.includes('bad request')) {
    	setError('Datos de ubicación inválidos.');
    }
    ```

### Componente de Error: `ValidationError`

**Características:**

-   🎯 **Errores específicos** según el tipo de problema
-   🔄 **Botón de reintento** para errores recuperables
-   📍 **Opción de aumentar radio** para errores de ubicación
-   💡 **Consejos útiles** para errores de conexión
-   🎨 **Iconografía contextual** según el tipo de error

## Estados de la Aplicación

### 1. Sin Ubicación

```
Mensaje: "Selecciona tu ubicación para ver grupos cercanos"
Acción: Usuario debe seleccionar ubicación
```

### 2. Validando Grupos

```
Mensaje: "Buscando grupos cercanos..."
Indicador: Loading spinner
```

### 3. Error de Validación

```
Componente: ValidationError
Opciones: Reintentar, aumentar radio, consejos
```

### 4. Sin Grupos Encontrados

```
Componente: EmptyGroupsState
Opciones: Crear grupo, buscar en radio mayor
```

### 5. Con Grupos Disponibles

```
Lista: Grupos con información completa
Acciones: Ver grupo, unirse
```

## Configuración de Desarrollo

### Variables de Entorno Requeridas

```env
# Backend API
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Google Places API (para geocodificación)
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=tu_api_key
EXPO_PUBLIC_GOOGLE_PLACES_API_URL=https://maps.googleapis.com/maps/api/place/autocomplete/json
```

### Fallback en Desarrollo

```typescript
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
}
```

## Logging y Monitoreo

### Logs de Validación

```typescript
console.log('🔍 Validando grupos cercanos:', {
	lat: params.latitude,
	lng: params.longitude,
	radius: params.radius,
	category: params.category
});

console.log('✅ Grupos encontrados:', nearbyGroups.length);
console.error('❌ Error validando grupos:', error);
```

### Métricas Recomendadas

-   **Tiempo de respuesta** de la API
-   **Tasa de éxito** de validaciones
-   **Errores más comunes** por tipo
-   **Uso de fallback** en desarrollo

## Testing

### Casos de Prueba

1. **Validación Exitosa**

    ```typescript
    // Simular respuesta exitosa
    const mockGroups = [
    	/* grupos de prueba */
    ];
    // Verificar que hasGroups = true
    // Verificar que groups.length > 0
    ```

2. **Validación Sin Grupos**

    ```typescript
    // Simular respuesta vacía
    const mockGroups = [];
    // Verificar que hasGroups = false
    // Verificar que EmptyGroupsState se muestra
    ```

3. **Error de Red**

    ```typescript
    // Simular error de red
    throw new Error('Network error');
    // Verificar que ValidationError se muestra
    // Verificar mensaje de error apropiado
    ```

4. **Error de Autenticación**
    ```typescript
    // Simular error 401
    throw new Error('401 Unauthorized');
    // Verificar mensaje de sesión expirada
    ```

## Optimizaciones Futuras

### Caché de Resultados

```typescript
// Implementar caché local para evitar requests repetidos
const cacheKey = `${lat}-${lng}-${radius}`;
const cachedResult = await AsyncStorage.getItem(cacheKey);
```

### Validación Inteligente

```typescript
// Validar solo cuando cambie la ubicación o radio
useEffect(() => {
	if (userLocation && searchRadius) {
		validateGroups({...userLocation, radius: searchRadius});
	}
}, [userLocation, searchRadius]);
```

### Debounce de Requests

```typescript
// Evitar requests múltiples en corto tiempo
const debouncedValidate = useCallback(debounce(validateGroups, 500), [validateGroups]);
```

## Conclusión

Esta implementación proporciona una validación robusta y confiable de grupos cercanos, con manejo completo de errores y una experiencia de usuario fluida. El sistema es escalable y mantenible, siguiendo las mejores prácticas de React Native y TypeScript.
