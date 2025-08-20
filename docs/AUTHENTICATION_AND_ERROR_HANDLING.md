# 🔐 Autenticación y Manejo de Errores - Endpoints de Grupos

## 📋 **Resumen de Implementación**

Se ha implementado un sistema robusto de autenticación y manejo de errores para los endpoints de grupos, asegurando que las peticiones estén correctamente autenticadas y que los errores se manejen de manera específica y útil para el usuario.

## 🔑 **Endpoints que Requieren Autenticación**

### 1. **GET /groups/nearby** - Obtener Grupos Cercanos

-   **Autenticación**: ✅ Requerida (`needsAuth: true`)
-   **Token**: Bearer token en header `Authorization`
-   **Parámetros**: `lat`, `lng`, `radius`, `category` (opcional)

### 2. **POST /groups** - Crear Grupo

-   **Autenticación**: ✅ Requerida (`needsAuth: true`)
-   **Token**: Bearer token en header `Authorization`
-   **Body**: Datos del grupo a crear

### 3. **GET /groups/{id}** - Obtener Detalles del Grupo

-   **Autenticación**: ✅ Requerida (`needsAuth: true`)
-   **Token**: Bearer token en header `Authorization`

### 4. **GET /groups/categories** - Obtener Categorías

-   **Autenticación**: ❌ No requerida (`needsAuth: false`)
-   **Nota**: Endpoint público para obtener categorías disponibles

## 🛡️ **Manejo de Errores Implementado**

### **Errores de Autenticación**

-   **401 - Token no encontrado**: Cuando no existe token en AsyncStorage
-   **401 - Sesión expirada**: Cuando el backend rechaza el token
-   **403 - Sin permisos**: Cuando el usuario no tiene permisos para la acción

### **Errores de Red**

-   **Network request failed**: Error de conexión a internet
-   **404 - Recurso no encontrado**: Endpoint o recurso inexistente
-   **500+ - Error del servidor**: Errores internos del backend

### **Errores de Validación**

-   **400 - Datos inválidos**: Cuando los datos enviados son incorrectos

## 📝 **Logs de Debug Implementados**

### **apiService.ts**

```typescript
// Logs de configuración de petición
console.log('🌐 API Request:', fullUrl);
console.log('📡 Request config:', {method, headers, body});

// Logs de autenticación
console.log('🔐 Token de autenticación encontrado y agregado');
console.error('❌ Petición necesita autenticación pero no se encontró el token.');

// Logs de errores específicos
console.error('🔐 Error de autenticación:', errorData);
console.error('🚫 Error de autorización:', errorData);
console.error('🔍 Recurso no encontrado:', errorData);
console.error('💥 Error del servidor:', errorData);
```

### **groupService.ts**

```typescript
// Logs de getNearbyGroups
console.log('🔍 Buscando grupos cercanos con parámetros:', params);
console.log('✅ Grupos cercanos obtenidos exitosamente:', result.length, 'grupos');

// Logs de createGroup
console.log('🏗️ Creando grupo con datos:', groupData);
console.log('✅ Grupo creado exitosamente:', result);
```

## 🔧 **Configuración de API**

### **Variables de Entorno Requeridas**

```env
# Backend API
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Google Places API
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=tu_api_key_aqui
EXPO_PUBLIC_GOOGLE_PLACES_API_URL=https://maps.googleapis.com/maps/api/place/autocomplete/json
EXPO_PUBLIC_GOOGLE_GEOCODING_API_URL=https://maps.googleapis.com/maps/api/geocode/json
```

### **Endpoints Configurados**

```typescript
GROUPS_ENDPOINTS: {
  NEARBY: 'groups/nearby',
  CREATE: 'groups',
  DETAILS: (groupId: string) => `groups/${groupId}`,
  CATEGORIES: 'groups/categories'
}
```

## 🚀 **Flujo de Autenticación**

1. **Verificación de Token**: Antes de cada petición autenticada
2. **Inclusión en Headers**: Token agregado como `Bearer {token}`
3. **Validación Backend**: El backend valida el token
4. **Manejo de Respuesta**: Errores específicos según el código de estado

## 🧪 **Testing y Debugging**

### **Verificar Configuración**

```typescript
// En el componente principal
validateApiConfig();
console.log('🔧 API Config:', {
	API_URL: API_CONFIG.API_URL,
	GOOGLE_PLACES_API_KEY: API_CONFIG.GOOGLE_PLACES_API_KEY ? '✅' : '❌'
});
```

### **Verificar Token**

```typescript
// Verificar si existe token
const token = await AsyncStorage.getItem('authToken');
console.log('🔑 Token disponible:', token ? '✅' : '❌');
```

## 📱 **UI/UX para Errores**

### **Mensajes de Error Específicos**

-   **Error de conexión**: "Verifica tu conexión a internet e intenta de nuevo"
-   **Sesión expirada**: "Sesión expirada. Por favor inicia sesión nuevamente"
-   **Datos inválidos**: "Verifica la información ingresada"
-   **Error del servidor**: "Error interno del servidor. Intenta más tarde"

### **Componente ValidationError**

-   Maneja diferentes tipos de errores
-   Proporciona acciones de retry
-   Opción para aumentar radio de búsqueda

## 🔄 **Próximos Pasos**

1. **Implementar refresh token**: Para renovar tokens expirados automáticamente
2. **Redirección automática**: Al login cuando la sesión expire
3. **Cache de datos**: Para mejorar performance en grupos cercanos
4. **Offline mode**: Para funcionar sin conexión con datos cacheados

## 📊 **Métricas de Debug**

### **Indicadores Visuales**

-   Debug UI en desarrollo que muestra estado de `userLocation`, `hasGroups`, `isLoadingGroups`
-   Logs detallados en consola para tracing de peticiones
-   Manejo específico de estados de carga y error

### **Monitoreo**

-   Logs estructurados para facilitar debugging
-   Identificación clara de errores por tipo
-   Trazabilidad completa de peticiones API
