# 🏋️‍♂️ Gimnasio Libre - Frontend

## 📋 Descripción del Proyecto

**Gimnasio Libre** es una aplicación móvil desarrollada con React Native y Expo que conecta a personas interesadas en actividades físicas y deportivas. La aplicación permite a los usuarios encontrar grupos de entrenamiento cercanos, explorar ejercicios y rutinas, y gestionar su perfil de entrenamiento.

## 🎯 Funcionalidades Principales

### 🏠 **Pantalla Principal (Home)**

-   **Búsqueda de grupos cercanos**: Sistema de geolocalización para encontrar grupos de entrenamiento en la zona
-   **Autocompletado de direcciones**: Integración con Google Places API para sugerencias de ubicación
-   **Filtro por radio de búsqueda**: Slider configurable (5-30 km) para ajustar el área de búsqueda
-   **Lista de grupos**: Muestra grupos con información de distancia, número de miembros y dirección
-   **Persistencia de datos**: Almacenamiento local del perfil del usuario

### 🔍 **Explorar Ejercicios y Rutinas**

-   **Catálogo de ejercicios**: Ejercicios organizados por categorías (Piernas, Pecho, Espalda, etc.)
-   **Niveles de dificultad**: Clasificación por principiante, intermedio y avanzado
-   **Rutinas predefinidas**: Colección de rutinas con duración, nivel y número de ejercicios
-   **Navegación horizontal**: Scroll horizontal para explorar ejercicios populares

### 👤 **Perfil de Usuario**

-   **Gestión de avatar**: Selección de foto de perfil desde la galería
-   **Estadísticas personales**: Seguimiento de entrenamientos, semanas activas y porcentaje de asistencia
-   **Historial de entrenamientos**: Registro de sesiones de entrenamiento con fecha y duración
-   **Información de membresía**: Estado actual de la suscripción del usuario

### 🚀 **Onboarding Wizard**

-   **Proceso de registro guiado**: 5 pasos para completar el registro
-   **Validación de datos**: Verificación de email, edad mínima y campos obligatorios
-   **Selección de actividades**: Intereses deportivos del usuario
-   **Almacenamiento seguro**: Persistencia de datos de usuario en AsyncStorage

## 🛠️ Tecnologías Utilizadas

### **Frontend Framework**

-   **React Native 0.79.2**: Framework principal para desarrollo móvil
-   **Expo SDK 53**: Plataforma de desarrollo y herramientas
-   **TypeScript 5.8.3**: Tipado estático para mayor robustez

### **Navegación y UI**

-   **Expo Router 5.0.7**: Sistema de navegación basado en archivos
-   **React Navigation 7.x**: Navegación entre pantallas
-   **React Native Reanimated 3.17.4**: Animaciones fluidas
-   **Expo Vector Icons**: Iconografía consistente

### **Almacenamiento y Estado**

-   **AsyncStorage 2.1.2**: Almacenamiento local persistente
-   **Expo Image Picker 16.1.4**: Selección de imágenes del dispositivo

### **APIs y Servicios**

-   **Google Places API**: Autocompletado de direcciones
-   **React Native Maps 1.20.1**: Integración de mapas
-   **Google Places Autocomplete 2.5.7**: Componente de búsqueda de lugares

### **Herramientas de Desarrollo**

-   **ESLint 9.25.0**: Linting de código
-   **Babel 7.27.1**: Transpilación de JavaScript
-   **Metro**: Bundler de React Native

## 📱 Características Técnicas

### **Arquitectura**

-   **File-based routing**: Navegación basada en estructura de archivos
-   **Component-based**: Arquitectura modular y reutilizable
-   **Type-safe**: Interfaces TypeScript para datos de usuario y API
-   **Responsive design**: Adaptable a diferentes tamaños de pantalla

### **Seguridad**

-   **Token-based authentication**: Autenticación mediante JWT
-   **Secure storage**: Almacenamiento seguro de tokens
-   **Input validation**: Validación de formularios en cliente

### **Performance**

-   **Lazy loading**: Carga diferida de componentes
-   **Image optimization**: Optimización de imágenes con Expo Image
-   **Memory management**: Gestión eficiente de memoria

## 🚀 Instalación y Configuración

### **Prerrequisitos**

-   Node.js 18+
-   npm o yarn
-   Expo CLI
-   Android Studio (para desarrollo Android)
-   Xcode (para desarrollo iOS, solo macOS)

### **Pasos de Instalación**

1. **Clonar el repositorio**

    ```bash
    git clone <repository-url>
    cd gl-frontend
    ```

2. **Instalar dependencias**

    ```bash
    npm install
    # o
    yarn install
    ```

3. **Configurar variables de entorno**
   Crear archivo `.env` en la raíz del proyecto:

    ```env
    EXPO_PUBLIC_API_URL=https://tu-api-backend.com
    EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=tu-google-places-api-key
    EXPO_PUBLIC_GOOGLE_PLACES_API_URL=https://maps.googleapis.com/maps/api/place
    ```

4. **Ejecutar la aplicación**

    ```bash
    # Desarrollo
    npm start

    # Android
    npm run android

    # iOS
    npm run ios

    # Web
    npm run web
    ```

## 📁 Estructura del Proyecto

```
gl-frontend/
├── app/                    # Navegación y pantallas principales
│   ├── (tabs)/            # Pantallas con navegación por tabs
│   │   ├── index.tsx      # Pantalla principal (Home)
│   │   ├── explore.tsx    # Explorar ejercicios y rutinas
│   │   └── profile.tsx    # Perfil de usuario
│   ├── OnboardingWizard.tsx  # Proceso de registro
│   └── AuthStack.tsx      # Stack de autenticación
├── components/            # Componentes reutilizables
│   └── ui/               # Componentes de interfaz
├── services/             # Servicios de API y autenticación
├── interfaces/           # Definiciones TypeScript
├── constants/            # Constantes y configuración
├── hooks/               # Custom hooks
└── assets/              # Imágenes y recursos
```

## 🔧 Scripts Disponibles

-   `npm start`: Inicia el servidor de desarrollo Expo
-   `npm run android`: Ejecuta en emulador/dispositivo Android
-   `npm run ios`: Ejecuta en simulador/dispositivo iOS
-   `npm run web`: Ejecuta en navegador web
-   `npm run lint`: Ejecuta el linter para verificar código
-   `npm run reset-project`: Resetea el proyecto (script personalizado)

## 🌐 APIs Integradas

### **Google Places API**

-   Autocompletado de direcciones
-   Búsqueda de lugares cercanos
-   Geocodificación de direcciones

### **Backend API (Configurable)**

-   Autenticación de usuarios
-   Gestión de perfiles
-   Datos de grupos y entrenamientos

## 📊 Estado del Proyecto

### **✅ Completado**

-   [x] Estructura base del proyecto
-   [x] Navegación por tabs
-   [x] Pantalla principal con búsqueda
-   [x] Exploración de ejercicios
-   [x] Perfil de usuario
-   [x] Onboarding wizard
-   [x] Integración con Google Places
-   [x] Almacenamiento local
-   [x] Validación de formularios

### **🚧 En Desarrollo**

-   [ ] Integración completa con backend
-   [ ] Sistema de notificaciones
-   [ ] Chat entre usuarios
-   [ ] Calendario de entrenamientos
-   [ ] Métricas avanzadas

### **📋 Pendiente**

-   [ ] Tests unitarios
-   [ ] Tests de integración
-   [ ] CI/CD pipeline
-   [ ] Documentación de API
-   [ ] Optimización de performance

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para preguntas o soporte técnico, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ por el equipo de Gimnasio Libre**
