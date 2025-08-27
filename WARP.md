# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Gimnasio Libre Frontend** is a React Native mobile application built with Expo that connects people interested in physical activities and sports. Users can find nearby workout groups, explore exercises and routines, and manage their training profile.

## Key Technologies

- **React Native 0.79.2** with **Expo SDK 53**
- **TypeScript 5.8.3** for type safety
- **Expo Router 5.0.7** for file-based navigation
- **AsyncStorage** for local data persistence
- **Google Places API** for location services
- **React Native Maps** for map integration

## Development Commands

### Core Development
```bash
# Start development server (primary command)
npm start

# Platform-specific builds
npm run android          # Run on Android device/emulator
npm run ios              # Run on iOS simulator/device
npm run web              # Run in web browser

# Code quality
npm run lint             # Run ESLint to check code style
```

### Development Utilities
```bash
# Backend connectivity testing
npm run check-backend    # Check if backend is running on localhost:3000

# Authentication debugging
npm run clear-auth       # Clear user authentication data
npm run clear-onboarding # Clear onboarding completion status

# Testing authentication flows
npm run test-flows       # Test authentication flow scenarios
npm run test-register    # Test user registration
npm run test-login       # Test user login
npm run test-register-ip # Test registration with IP fallback
```

### Project Reset
```bash
# Clear cache and restart fresh
npx expo start --clear   # Clear Metro cache and restart
```

## Architecture Overview

### File-Based Navigation Structure
The app uses Expo Router with a file-based routing system:
- `app/(tabs)/` - Tab-based navigation screens (Home, Explore, Profile)
- `app/AuthStack.tsx` - Authentication login screen
- `app/OnboardingWizard.tsx` - 5-step user registration wizard
- `app/_layout.tsx` - Root navigation controller that manages auth state

### Authentication Flow Architecture
The app implements a sophisticated authentication flow with three states:

1. **Unauthenticated** → Shows `AuthStack` (login screen)
2. **Authenticated but onboarding incomplete** → Shows `OnboardingWizard`
3. **Authenticated with onboarding complete** → Shows main app tabs

**State Management:** Uses AsyncStorage with three key pieces of data:
- `authToken` - JWT authentication token
- `userData` - User profile information
- `onboardingComplete` - Boolean flag for wizard completion

### Service Architecture
- **`authService.ts`** - Handles login, registration, token management
- **`apiService.ts`** - HTTP client with automatic token injection
- **`groupService.ts`** - Manages workout group data and operations

### Core Features Implementation

**Location Services:**
- Google Places Autocomplete for address input
- Google Geocoding API for coordinate conversion
- Search radius selection (5-30km) for finding nearby groups

**Data Persistence:**
- User profile data stored in AsyncStorage
- Authentication tokens automatically managed
- Onboarding progress tracked across sessions

## Environment Configuration

Required environment variables (create `.env` file):
```bash
EXPO_PUBLIC_API_URL=https://your-backend-api.com
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your-google-places-api-key
EXPO_PUBLIC_GOOGLE_PLACES_API_URL=https://maps.googleapis.com/maps/api/place
```

## Component Architecture

### Key Reusable Components
- **`ValidationError`** - Error handling with retry mechanisms
- **`CreateGroupModal`** - Modal for creating workout groups
- **`EmptyGroupsState`** - Empty state with action suggestions
- **UI Components** in `components/ui/` - Themed interface elements

### Hook Pattern
- **`useGroupsValidation`** - Group data fetching and validation
- **`useLocation`** - Location services and permissions
- **`useThemeColor`** - Dynamic theming

## Backend Integration

The app is designed to work with a backend API running on `localhost:3000`. The app gracefully handles backend unavailability:

- **With Backend:** Full functionality including user authentication and group management
- **Without Backend:** Falls back to development mode with simulated data
- **Network Errors:** Provides user-friendly error messages with retry options

Use `npm run check-backend` to verify backend connectivity.

## Development Patterns

### Error Handling
- Network errors show user-friendly messages
- Automatic fallback to development data when backend unavailable
- Retry mechanisms for failed API calls

### Validation
- Form validation on client-side before API calls
- Email format validation and password strength requirements
- Location data validation before group searches

### State Management
- AsyncStorage for persistence across app restarts
- Automatic token refresh and management
- Centralized authentication state in root layout

## Common Development Tasks

### Testing Authentication Flow
1. `npm run clear-auth` to reset user state
2. `npx expo start --clear` to restart with clean cache
3. Test login with existing user credentials
4. Test registration flow through 5-step onboarding wizard

### Adding New API Endpoints
1. Update `config/api.ts` with new endpoint configuration
2. Add service method in appropriate service file
3. Add TypeScript interfaces in `interfaces/` directory
4. Update error handling in service calls

### Location Services Development
- Google Places API key must be configured in environment
- Fallback coordinates (Madrid: 40.4168, -3.7038) used when geocoding fails
- Location search has 200ms debounce to avoid excessive API calls

## Debug Features

In development mode (`__DEV__ === true`), the app shows:
- Debug panel with authentication state indicators
- "Clear Auth" button for quick testing
- Network request logging in console
- Fallback coordinate usage notifications
