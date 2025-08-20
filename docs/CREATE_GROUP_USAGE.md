# Guía de Uso - Crear Grupos

## Resumen

Esta funcionalidad permite a los usuarios crear grupos cuando no encuentran grupos cercanos en su zona. La implementación incluye una interfaz intuitiva y validaciones completas.

## Flujo de Usuario

### 1. Estado Inicial

-   El usuario ve la pantalla principal con búsqueda de ubicación
-   Si no hay grupos cercanos, se muestra el componente `EmptyGroupsState`

### 2. Selección de Ubicación

-   El usuario debe seleccionar su ubicación usando el campo de búsqueda
-   Se integra con Google Places API para autocompletado
-   Al seleccionar ubicación, se cargan automáticamente los grupos cercanos

### 3. Estado Sin Grupos

Cuando no hay grupos cercanos, se muestra:

-   **Icono y mensaje** explicativo
-   **Botón principal**: "Crear el primer grupo"
-   **Botón secundario**: "Buscar en radio mayor"
-   **Información educativa** sobre beneficios de crear grupos

### 4. Creación de Grupo

Al hacer clic en "Crear el primer grupo":

-   Se abre el modal `CreateGroupModal`
-   Formulario con validaciones en tiempo real
-   Campos requeridos: nombre, descripción, categoría
-   Ubicación automática desde la selección previa

## Componentes Principales

### EmptyGroupsState

```typescript
interface EmptyGroupsStateProps {
	onCreateGroup: () => void;
	onIncreaseRadius: () => void;
	currentRadius: number;
	hasLocation: boolean;
}
```

**Funcionalidades:**

-   Muestra estado vacío cuando no hay grupos
-   Call-to-action principal para crear grupo
-   Opción para aumentar radio de búsqueda
-   Información educativa sobre beneficios

### CreateGroupModal

```typescript
interface CreateGroupModalProps {
	visible: boolean;
	onClose: () => void;
	onGroupCreated: (group: IGroup) => void;
	userLocation: {
		latitude: number;
		longitude: number;
		address: string;
	} | null;
}
```

**Campos del formulario:**

-   **Nombre del grupo** (requerido, máximo 50 caracteres)
-   **Descripción** (requerida, máximo 200 caracteres)
-   **Categoría** (requerida, selección de lista)
-   **Máximo de miembros** (opcional, default: 10)
-   **Ubicación** (automática desde selección previa)

## Configuración Requerida

### Variables de Entorno

```env
# Google Places API
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=tu_api_key_aqui
EXPO_PUBLIC_GOOGLE_PLACES_API_URL=https://maps.googleapis.com/maps/api/place/autocomplete/json

# Backend API
EXPO_PUBLIC_API_URL=url_de_tu_backend
```

### Backend API Endpoints

```typescript
// Obtener grupos cercanos
GET /groups/nearby?lat={latitude}&lng={longitude}&radius={radius}

// Crear grupo
POST /groups
Body: {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  maxMembers: number;
  category: string;
}

// Obtener categorías
GET /groups/categories

// Unirse a grupo
POST /groups/{id}/join

// Detalles de grupo
GET /groups/{id}
```

## Validaciones

### Frontend

-   **Nombre**: Requerido, máximo 50 caracteres
-   **Descripción**: Requerida, máximo 200 caracteres
-   **Categoría**: Requerida, selección obligatoria
-   **Ubicación**: Requerida, automática desde selección

### Backend (Recomendadas)

-   Validación de datos de entrada
-   Verificación de límites de caracteres
-   Validación de coordenadas geográficas
-   Verificación de permisos de usuario

## Estados de la Aplicación

### 1. Sin Ubicación

```
Mensaje: "Selecciona tu ubicación para ver grupos cercanos"
```

### 2. Con Ubicación, Sin Grupos

```
- EmptyGroupsState se muestra
- Opciones: Crear grupo o aumentar radio
- Información educativa visible
```

### 3. Cargando Grupos

```
Mensaje: "Buscando grupos cercanos..."
```

### 4. Con Grupos

```
- Lista de grupos disponibles
- Información: nombre, dirección, distancia, miembros
- Botón "Ver grupo" para cada grupo
```

### 5. Creando Grupo

```
- Modal abierto con formulario
- Estados de carga en botón
- Validaciones en tiempo real
```

## Manejo de Errores

### Errores de API

-   **Sin conexión**: Fallback a datos mock en desarrollo
-   **API key inválida**: Warning en consola
-   **Error de creación**: Alert con mensaje de error

### Errores de Validación

-   **Campos vacíos**: Alert específico por campo
-   **Límites excedidos**: Validación en tiempo real
-   **Ubicación faltante**: Mensaje guía al usuario

## Testing

### Casos de Prueba Recomendados

1. **Flujo completo de creación**

    - Seleccionar ubicación
    - Ver estado vacío
    - Crear grupo exitosamente
    - Verificar grupo en lista

2. **Validaciones de formulario**

    - Campos requeridos vacíos
    - Límites de caracteres
    - Selección de categoría

3. **Manejo de errores**

    - Sin conexión a internet
    - API key inválida
    - Errores de backend

4. **Estados de ubicación**
    - Sin ubicación seleccionada
    - Ubicación inválida
    - Cambio de ubicación

## Mejoras Futuras

### Funcionalidades Adicionales

1. **Fotos de grupos**: Subir imágenes
2. **Horarios**: Configurar horarios de actividades
3. **Nivel requerido**: Especificar nivel de experiencia
4. **Notificaciones**: Alertar sobre nuevos grupos

### Optimizaciones

1. **Caché de ubicaciones**: Evitar geocodificación repetida
2. **Offline support**: Guardar grupos localmente
3. **Filtros avanzados**: Por categoría, horarios, nivel
4. **Búsqueda**: Buscar grupos por nombre o descripción

## Monitoreo

### Métricas Recomendadas

-   Número de grupos creados por día/semana
-   Tasa de conversión (usuarios que crean grupos)
-   Tiempo promedio de creación de grupo
-   Errores más comunes en creación

### Logs Importantes

-   Errores de API de Google Places
-   Errores de creación de grupos
-   Validaciones fallidas
-   Performance de geocodificación
