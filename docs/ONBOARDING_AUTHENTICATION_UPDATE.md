# 🔄 Actualización del Onboarding - Autenticación Real

## 📋 **Resumen de Cambios**

Se ha actualizado el `OnboardingWizard.tsx` para reemplazar el token dummy por un registro real de usuario utilizando el `authService.register()`.

## 🔧 **Cambios Implementados**

### **1. Integración con AuthService**

```typescript
// Antes
await AsyncStorage.multiSet([
	['onboardingComplete', 'true'],
	['userData', JSON.stringify(userData)],
	['authToken', 'dummy-token'] // ❌ Token dummy
]);

// Después
const authResponse = await authService.register(registerData);
await authService.updateUserData(onboardingData);
await AsyncStorage.setItem('onboardingComplete', 'true');
```

### **2. Flujo de Registro Completo**

1. **Recopilación de datos**: Información personal, ubicación, cuenta, actividades
2. **Validación**: Campos requeridos, formato de email, edad mínima
3. **Registro en backend**: `authService.register()`
4. **Actualización de datos**: Información adicional del onboarding
5. **Marcado de completado**: `onboardingComplete = true`

### **3. Manejo de Estados**

```typescript
const [isLoading, setIsLoading] = useState(false);

// Estado de carga durante registro
setIsLoading(true);
try {
	// Registro...
} finally {
	setIsLoading(false);
}
```

### **4. UI/UX Mejorada**

-   **Botón con estado de carga**: "Creando cuenta..." durante el registro
-   **Botón deshabilitado**: Evita múltiples registros
-   **Mensajes de error específicos**: Por tipo de error del backend

### **5. Mapeo de Género Actualizado**

```typescript
// Antes
{['M', 'F', 'Otro'].map((g) => ...)}

// Después
{[
  {value: 'male', label: 'M'},
  {value: 'female', label: 'F'},
  {value: 'Otro', label: 'Otro'}
].map((g) => ...)}
```

## 🛡️ **Manejo de Errores**

### **Errores de Registro**

-   **409 - Conflicto**: "Ya existe una cuenta con este email"
-   **400 - Datos inválidos**: "Datos inválidos. Verifica la información"
-   **Network**: "Error de conexión. Verifica tu internet"
-   **500 - Servidor**: "Error del servidor. Intenta más tarde"

### **Validaciones Frontend**

-   **Campos requeridos**: Nombre, apellido, edad, género, ubicación
-   **Email válido**: Formato correcto con regex
-   **Contraseña mínima**: Al menos 6 caracteres
-   **Edad mínima**: 13 años o más
-   **Actividades**: Al menos una seleccionada

## 📱 **Flujo de Usuario**

### **Paso 1: Bienvenida**

-   Logo y descripción de la app
-   Explicación del proceso

### **Paso 2: Información Personal**

-   Nombre y apellido
-   Edad (mínimo 13 años)
-   Género (male/female/Otro)

### **Paso 3: Ubicación**

-   País, ciudad, código postal
-   Dirección completa

### **Paso 4: Cuenta**

-   Email (validación de formato)
-   Contraseña (mínimo 6 caracteres)
-   Mostrar/ocultar contraseña

### **Paso 5: Actividades**

-   Selección múltiple de actividades deportivas
-   Al menos una actividad requerida

### **Paso 6: Registro**

-   Resumen de información
-   Botón "Comenzar" que inicia el registro
-   Estado de carga durante el proceso

## 🔄 **Integración con Backend**

### **Datos Enviados al Registro**

```typescript
{
  name: string,
  lastName: string,
  email: string,
  password: string,
  age: number,
  gender: 'male' | 'female' | 'Otro'
}
```

### **Datos Adicionales del Onboarding**

```typescript
{
  ...userData, // Datos del registro
  country: string,
  city: string,
  postalCode: string,
  address: string,
  activities: string[]
}
```

### **Respuesta Esperada**

```typescript
{
  token: string,
  user: {
    id: string,
    name: string,
    lastName: string,
    email: string,
    age: number,
    gender: string
  }
}
```

## 🧪 **Testing y Debugging**

### **Logs de Debug**

```typescript
// Inicio del registro
console.log('📝 Iniciando registro de usuario desde onboarding...');

// Registro exitoso
console.log('✅ Usuario registrado exitosamente:', authResponse.user.name);

// Onboarding completado
console.log('✅ Onboarding completado exitosamente');

// Errores
console.error('❌ Error en registro desde onboarding:', error);
```

### **Verificación de Datos**

```typescript
// Verificar datos guardados
const userData = await AsyncStorage.getItem('userData');
const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
const token = await AsyncStorage.getItem('authToken');

console.log('👤 User Data:', userData);
console.log('✅ Onboarding Complete:', onboardingComplete);
console.log('🔑 Token:', token);
```

## 🔧 **Configuración Backend Requerida**

### **Endpoint de Registro**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "age": number,
  "gender": "male" | "female" | "Otro"
}
```

### **Respuesta Exitosa**

```json
{
	"token": "jwt_token_here",
	"user": {
		"id": "user_id",
		"name": "Nombre",
		"lastName": "Apellido",
		"email": "usuario@email.com",
		"age": 25,
		"gender": "male"
	}
}
```

### **Respuesta de Error**

```json
{
	"message": "Ya existe una cuenta con este email",
	"status": 409
}
```

## 🚀 **Próximos Pasos**

### **Mejoras Pendientes**

1. **Verificación de email**: Confirmación de cuenta por email
2. **Términos y condiciones**: Aceptación obligatoria
3. **Política de privacidad**: Consentimiento de datos
4. **Foto de perfil**: Subida de imagen de usuario
5. **Preferencias**: Configuración adicional

### **Optimizaciones**

1. **Validación en tiempo real**: Feedback inmediato
2. **Guardado progresivo**: No perder datos si se cierra la app
3. **Animaciones**: Transiciones suaves entre pasos
4. **Accesibilidad**: Soporte para lectores de pantalla

### **Seguridad**

1. **Encriptación**: Datos sensibles encriptados
2. **Rate limiting**: Prevenir spam de registros
3. **Captcha**: Verificación anti-bot
4. **Auditoría**: Logs de registros

## 🔍 **Troubleshooting**

### **Problemas Comunes**

1. **Email ya existe**: Verificar si el usuario ya está registrado
2. **Datos inválidos**: Revisar validaciones del backend
3. **Timeout**: Ajustar timeouts de peticiones
4. **CORS**: Configurar headers en backend

### **Debug Commands**

```bash
# Verificar configuración
console.log('🔧 API Config:', API_CONFIG);

# Verificar datos del onboarding
console.log('📝 Onboarding Data:', {
  name, lastName, age, gender,
  country, city, email, activities
});

# Verificar respuesta del registro
console.log('📡 Register Response:', authResponse);
```
