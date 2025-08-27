# Refactorización del Storage Service

## 📋 **Resumen de Cambios**

Se ha separado la lógica de almacenamiento local de la lógica de APIs para mejorar la organización del código y facilitar el mantenimiento.

## 🔧 **Cambios Implementados**

### 1. **Nuevo archivo: `services/storageService.ts`**

-   **Propósito**: Manejar todas las operaciones de AsyncStorage
-   **Métodos principales**:
    -   `saveAuthData()` - Guardar token y datos de usuario
    -   `getAuthToken()` - Obtener token de autenticación
    -   `getCurrentUser()` - Obtener datos del usuario actual
    -   `isAuthenticated()` - Verificar si el usuario está autenticado
    -   `isOnboardingComplete()` - Verificar estado del onboarding
    -   `updateUserData()` - Actualizar datos del usuario
    -   `markOnboardingComplete()` - Marcar onboarding como completo
    -   `clearAuthData()` - Limpiar todos los datos de auth
    -   `clearOnboardingStatus()` - Limpiar solo el estado de onboarding

### 2. **Refactorización de `services/authService.ts`**

-   **Eliminado**: Métodos de storage local
-   **Mantenido**: Métodos de API (login, register, logout, etc.)
-   **Agregado**: Método `markOnboardingComplete()` para actualizar backend
-   **Cambio**: Ahora usa `storageService` para operaciones locales

### 3. **Actualización de endpoints**

-   **Endpoint corregido**: `auth/update-onboarding` (PUT en lugar de POST)
-   **Parámetros agregados**: `{ userId: string, doneOnboarding: true }` en el body

### 4. **Archivos actualizados**

-   `app/_layout.tsx` - Usa `storageService.isOnboardingComplete()`
-   `app/AuthStack.tsx` - Usa `storageService` para limpiar datos
-   `app/OnboardingWizard.tsx` - Usa `storageService` para actualizar datos
-   `services/tokenValidator.ts` - Usa `storageService` para validar tokens

## 🎯 **Beneficios de la Refactorización**

### **Separación de Responsabilidades**

-   **APIs**: Solo manejan comunicación con el backend
-   **Storage**: Solo maneja almacenamiento local
-   **AuthService**: Orquesta operaciones entre APIs y storage

### **Mantenibilidad**

-   Código más organizado y fácil de entender
-   Cambios en storage no afectan lógica de APIs
-   Testing más sencillo por separación de concerns

### **Reutilización**

-   `storageService` puede ser usado por otros servicios
-   Métodos específicos para diferentes tipos de datos

## 📝 **Flujo de Onboarding Corregido**

### **Antes (Problemático)**

1. Usuario hace login → Se asume `doneOnboarding: true` automáticamente
2. No se sincronizaba con el estado real del backend
3. Inconsistencias entre frontend y backend

### **Después (Corregido)**

1. Usuario hace login → Se verifica `doneOnboarding` del backend
2. Si `doneOnboarding: false` → Va al onboarding
3. Si `doneOnboarding: true` → Va al home
4. Al completar onboarding → Se actualiza `doneOnboarding: true` en backend

## 🔄 **Métodos de API vs Storage**

### **API Methods (authService)**

```typescript
// Comunicación con backend
login(email, password);
register(userData);
logout();
markOnboardingComplete(); // PUT /auth/update-onboarding con userId
changePassword(passwordData);
forgotPassword(email);
```

### **Storage Methods (storageService)**

```typescript
// Operaciones locales
saveAuthData(token, user);
getAuthToken();
getCurrentUser();
isAuthenticated();
isOnboardingComplete();
updateUserData(userData);
markOnboardingComplete(); // Solo local
clearAuthData();
clearOnboardingStatus();
```

## 🧪 **Testing**

### **Scripts de Prueba**

-   `scripts/test-onboarding-sync.js` - Prueba sincronización de onboarding
-   `scripts/clear-auth.js` - Limpia datos de autenticación
-   `scripts/test-auth-flows.js` - Prueba flujos de autenticación

### **Escenarios Cubiertos**

1. Usuario nuevo → Onboarding
2. Usuario existente con `doneOnboarding: false` → Onboarding
3. Usuario existente con `doneOnboarding: true` → Home
4. Token expirado → Login

## 🚀 **Próximos Pasos**

1. **Verificar backend**: Confirmar que existe el endpoint `PUT /auth/update-onboarding` que acepta `{ userId, doneOnboarding }`
2. **Testing**: Probar el flujo completo con usuario existente
3. **Documentación**: Actualizar documentación de APIs
4. **Monitoreo**: Verificar logs para confirmar sincronización correcta
