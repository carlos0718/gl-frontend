# Reorganización de Interfaces

## 📋 **Objetivo**

Reorganizar todas las interfaces del proyecto en la carpeta `interfaces/` para mantener una mejor estructura y organización del código.

## 🔧 **Cambios Implementados**

### **1. Nuevo Archivo: `interfaces/category.ts`**

Se creó un archivo específico para todas las interfaces relacionadas con categorías:

```typescript
/**
 * Interfaz para el objeto categoría que viene de la API
 */
export interface ICategory {
	_id: string;
	name: string;
	description: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Interfaz para la respuesta de categorías de grupos
 */
export interface IGroupCategoriesResponse {
	message: string;
	data: ICategory[];
}

/**
 * Interfaz para el cache de categorías
 */
export interface ICachedCategories {
	categories: ICategory[];
	timestamp: number;
	version: number;
}
```

### **2. Actualización: `interfaces/group.ts`**

Se removió la interfaz `IGroupCategoriesResponse` y se agregó un comentario explicativo:

```typescript
// La interfaz IGroupCategoriesResponse se movió a interfaces/category.ts
// para mantener una mejor organización de las interfaces
```

### **3. Actualización: `services/categoriesService.ts`**

-   ✅ **Importaciones actualizadas**: Ahora importa desde `interfaces/category`
-   ✅ **Tipos corregidos**: Usa `ICategory[]` en lugar de `string[]`
-   ✅ **Métodos actualizados**: Extrae nombres de categorías de objetos
-   ✅ **Cache mejorado**: Almacena objetos completos de categorías

### **4. Actualización: `components/CreateGroupModal.tsx`**

-   ✅ **Interfaz local removida**: Se eliminó `CategoryObject`
-   ✅ **Importación agregada**: Ahora importa `ICategory`
-   ✅ **Tipos corregidos**: Usa `ICategory` en lugar de `CategoryObject`

## 📊 **Estructura Final de Interfaces**

```
interfaces/
├── user.ts          # Interfaces relacionadas con usuarios
├── group.ts         # Interfaces relacionadas con grupos
└── category.ts      # Interfaces relacionadas con categorías
```

### **`interfaces/user.ts`**

-   `IUser` - Interfaz principal de usuario
-   `ILoginRequest` - Datos de login
-   `IRegisterRequest` - Datos de registro

### **`interfaces/group.ts`**

-   `IGroup` - Interfaz principal de grupo
-   `ICreateGroupRequest` - Datos para crear grupo
-   `INearbyGroupsRequest` - Parámetros para buscar grupos cercanos

### **`interfaces/category.ts`**

-   `ICategory` - Interfaz principal de categoría
-   `IGroupCategoriesResponse` - Respuesta de API de categorías
-   `ICachedCategories` - Estructura del cache de categorías

## 🚀 **Beneficios de la Reorganización**

### **Organización:**

-   ✅ **Separación clara**: Cada archivo tiene un propósito específico
-   ✅ **Fácil navegación**: Encontrar interfaces es más sencillo
-   ✅ **Mantenibilidad**: Cambios en un dominio no afectan otros

### **Type Safety:**

-   ✅ **Interfaces centralizadas**: Todas las interfaces están en un lugar
-   ✅ **Reutilización**: Las interfaces se pueden importar donde sea necesario
-   ✅ **Consistencia**: Nomenclatura uniforme en todo el proyecto

### **Escalabilidad:**

-   ✅ **Fácil extensión**: Agregar nuevas interfaces es sencillo
-   ✅ **Modularidad**: Cada módulo tiene sus propias interfaces
-   ✅ **Documentación**: Cada interfaz está bien documentada

## 📝 **Reglas de Nomenclatura**

### **Prefijos:**

-   `I` - Para interfaces principales (ej: `IUser`, `IGroup`)
-   `I` + `Action` - Para interfaces de acciones (ej: `ICreateGroupRequest`)
-   `I` + `Response` - Para interfaces de respuestas de API (ej: `IGroupCategoriesResponse`)

### **Nombres de Archivos:**

-   `user.ts` - Interfaces relacionadas con usuarios
-   `group.ts` - Interfaces relacionadas con grupos
-   `category.ts` - Interfaces relacionadas con categorías

## 🔄 **Migración Completada**

### **Archivos Actualizados:**

-   ✅ `interfaces/category.ts` - Creado
-   ✅ `interfaces/group.ts` - Actualizado
-   ✅ `services/categoriesService.ts` - Actualizado
-   ✅ `components/CreateGroupModal.tsx` - Actualizado

### **Archivos que No Requirieron Cambios:**

-   ✅ `services/groupService.ts` - Ya usaba CategoriesService
-   ✅ `services/authService.ts` - No usa interfaces de categorías
-   ✅ `interfaces/user.ts` - No relacionado con categorías

## 🧪 **Verificación**

### **Funcionalidad:**

-   ✅ **Categorías cargan correctamente**: Los nombres se extraen de objetos
-   ✅ **Cache funciona**: Almacena objetos completos de categorías
-   ✅ **TypeScript sin errores**: Todas las interfaces están correctamente tipadas
-   ✅ **Compatibilidad**: No hay breaking changes en la funcionalidad

### **Código:**

-   ✅ **Imports correctos**: Todas las importaciones apuntan a los archivos correctos
-   ✅ **Tipos consistentes**: Se usan las interfaces correctas en todo el código
-   ✅ **Documentación**: Cada interfaz tiene comentarios explicativos
