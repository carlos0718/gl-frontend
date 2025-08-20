# 🔧 Troubleshooting - Error de Categorías de Grupos

## 📋 **Problema Identificado**

```
API Request: http://localhost:3000/api/groups/categories
📡 Request config: {"body": undefined, "headers": {"Content-Type": "application/json"}, "method": "GET"}
❌ Error en apiService: [TypeError: Network request failed]
❌ Error fetching group categories: [TypeError: Network request failed]
```

## 🔍 **Causas Posibles**

### **1. Backend No Disponible**

-   El servidor backend no está corriendo en `http://localhost:3000`
-   El endpoint `/api/groups/categories` no está implementado

### **2. Problema de Autenticación**

-   El endpoint requiere autenticación pero el token no es válido
-   El usuario no está autenticado

### **3. Problema de Red**

-   Error de conectividad entre la app y el backend
-   CORS no configurado correctamente

### **4. Endpoint No Implementado**

-   El backend no tiene el endpoint `/groups/categories` implementado

## 🛠️ **Soluciones Implementadas**

### **1. Fallback a Categorías por Defecto**

```typescript
// Si el endpoint falla, se usan categorías por defecto
const defaultCategories = [
	'Running',
	'Crossfit',
	'Yoga',
	'Fútbol',
	'Baloncesto',
	'Natación',
	'Ciclismo',
	'Gimnasio',
	'Calistenia',
	'Tenis',
	'Paddle',
	'Voleibol',
	'Atletismo',
	'Boxeo',
	'Kickboxing',
	'Pilates',
	'Danza',
	'Esquí',
	'Snowboard',
	'Otros'
];
```

### **2. Doble Intento de Conexión**

```typescript
// Primero intenta con autenticación
try {
	const categories = await apiService(ENDPOINT, {needsAuth: true});
} catch (authError) {
	// Si falla, intenta sin autenticación
	const categories = await apiService(ENDPOINT, {needsAuth: false});
}
```

### **3. Logs Detallados**

```typescript
console.log('📋 Obteniendo categorías de grupos...');
console.log('🔐 Estado de autenticación:', isAuthenticated ? '✅' : '❌');
console.log('✅ Categorías obtenidas exitosamente:', categories);
```

## 🔧 **Configuración Backend Requerida**

### **Endpoint de Categorías**

```bash
GET /api/groups/categories
```

### **Respuesta Esperada**

```json
["Running", "Crossfit", "Yoga", "Fútbol", "Baloncesto", "Natación", "Ciclismo", "Gimnasio", "Otros"]
```

### **Headers Requeridos**

```bash
Content-Type: application/json
Authorization: Bearer <token>  # Si requiere autenticación
```

## 🧪 **Testing y Debugging**

### **1. Verificar Backend**

```bash
# Verificar si el servidor está corriendo
curl http://localhost:3000/api/groups/categories

# Verificar con autenticación
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/groups/categories
```

### **2. Verificar Variables de Entorno**

```bash
# En tu archivo .env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### **3. Logs a Observar**

```bash
📋 Obteniendo categorías de grupos...
🔐 Estado de autenticación: ✅ Autenticado
🌐 API Request: http://localhost:3000/api/groups/categories
📡 Request config: { method: "GET", needsAuth: true }
✅ Categorías obtenidas exitosamente: 20 categorías
```

## 🚨 **Si el Problema Persiste**

### **Opción 1: Implementar Endpoint en Backend**

```javascript
// En tu backend (Node.js/Express)
app.get('/api/groups/categories', (req, res) => {
	const categories = ['Running', 'Crossfit', 'Yoga', 'Fútbol', 'Baloncesto', 'Natación', 'Ciclismo', 'Gimnasio', 'Otros'];
	res.json(categories);
});
```

### **Opción 2: Endpoint Sin Autenticación**

```javascript
// Endpoint público para categorías
app.get('/api/groups/categories', (req, res) => {
  // No requiere autenticación
  const categories = [...];
  res.json(categories);
});
```

### **Opción 3: Usar Categorías por Defecto**

-   El sistema ya está configurado para usar categorías por defecto
-   No es necesario implementar el endpoint inmediatamente

## 🔍 **Verificación de Funcionamiento**

### **1. Con Backend Funcionando**

-   Las categorías se cargan desde el backend
-   Logs muestran "✅ Categorías obtenidas exitosamente"

### **2. Sin Backend**

-   Se usan categorías por defecto
-   Logs muestran "🔄 Usando categorías por defecto..."
-   El modal funciona normalmente

### **3. Debug Visual**

-   En modo desarrollo, se muestra "Categorías cargadas: X"
-   Ayuda a verificar que las categorías se cargaron correctamente

## 📱 **Flujo de Usuario**

1. **Usuario abre modal de crear grupo**
2. **Sistema intenta cargar categorías del backend**
3. **Si falla, usa categorías por defecto**
4. **Usuario puede seleccionar categoría normalmente**
5. **Modal funciona sin interrupciones**

## 🎯 **Resultado Esperado**

-   ✅ El modal se abre sin errores
-   ✅ Las categorías se cargan (backend o por defecto)
-   ✅ El usuario puede seleccionar una categoría
-   ✅ El proceso de crear grupo continúa normalmente
