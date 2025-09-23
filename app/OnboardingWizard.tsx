import {Ionicons} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import {
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Colors} from '../constants/Colors';
import {authService} from '../services/authService';
import {CategoriesService} from '../services/categoriesService';
import {storageService} from '../services/storageService';

function isValidEmail(email: string) {
	return /\S+@\S+\.\S+/.test(email);
}
export default function OnboardingWizard({onFinish}: {onFinish: () => void}) {
	const [step, setStep] = useState(0);
	// Datos personales
	const [name, setName] = useState('');
	const [lastName, setLastName] = useState('');
	const [age, setAge] = useState('');
	const [birthDate, setBirthDate] = useState('');
	const [gender, setGender] = useState('');
	const [phone, setPhone] = useState('');
	// Datos de ubicación
	const [country, setCountry] = useState('');
	const [city, setCity] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [address, setAddress] = useState('');
	// Datos de cuenta
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	// Datos adicionales
	const [activities, setActivities] = useState<string[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Cargar categorías cuando se llegue al step 4
	useEffect(() => {
		if (step === 4) {
			loadCategories();
		}
	}, [step]);

	const loadCategories = async () => {
		try {
			console.log('📋 OnboardingWizard: Cargando categorías para selección de actividades...');
			const cats = await CategoriesService.getCategories();

			if (Array.isArray(cats) && cats.length > 0) {
				setCategories(cats);
				console.log('✅ OnboardingWizard: Categorías cargadas exitosamente:', cats.length, 'categorías');
			} else {
				console.warn('⚠️ OnboardingWizard: No se obtuvieron categorías, usando fallback');
				// Fallback con categorías básicas si no hay conexión
				setCategories(['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Ciclismo', 'Yoga', 'Gimnasio', 'Running']);
			}
		} catch (error) {
			console.error('❌ OnboardingWizard: Error cargando categorías:', error);
			// Fallback con categorías básicas
			setCategories(['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Ciclismo', 'Yoga', 'Gimnasio', 'Running']);
		}
	};

	const handleNext = async () => {
		setError('');

		switch (step) {
			case 0: // Welcome screen
				setStep(1);
				break;

			case 1: // Personal details
				if (!name.trim() || !lastName.trim() || !age.trim() || !birthDate.trim() || !gender || !phone.trim()) {
					setError('Por favor completa todos los campos');
					return;
				}
				if (isNaN(Number(age)) || Number(age) < 13) {
					setError('Debes tener al menos 13 años');
					return;
				}
				setStep(2);
				break;

			case 2: // Location details
				if (!country.trim() || !city.trim() || !postalCode.trim()) {
					setError('Por favor completa todos los campos');
					return;
				}
				setStep(3);
				break;

			case 3:
				if (!email.trim() || !password.trim()) {
					setError('Por favor completa todos los campos');
					return;
				}
				if (!isValidEmail(email)) {
					setError('Email inválido');
					return;
				}
				if (password.length < 6) {
					setError('La contraseña debe tener al menos 6 caracteres');
					return;
				}
				setStep(4);
				break;

			case 4: // Activities selection
				if (activities.length === 0) {
					setError('Selecciona al menos una actividad');
					return;
				}

				// Registrar usuario antes de pasar al step 5
				setIsLoading(true);
				setError('');

				try {
					console.log('📝 Registrando usuario antes del step final...');

					// Preparar datos para el registro
					const registerData = {
						name,
						lastName,
						email,
						password,
						age: Number(age),
						birthDate,
						gender: gender as 'male' | 'female' | 'Otro',
						phone
					};

					// Registrar usuario en el backend
					await authService.register(registerData);

					console.log('✅ Usuario registrado exitosamente, pasando al step de login...');

					// Pasar al step 5 (login)
					setStep(5);
				} catch (error) {
					console.error('❌ Error en registro:', error);

					let errorMessage = 'Error al crear la cuenta. Por favor intenta de nuevo.';

					if (error instanceof Error) {
						if (error.message.includes('409')) {
							errorMessage = 'Ya existe una cuenta con este email.';
						} else if (error.message.includes('400')) {
							errorMessage = 'Datos inválidos. Verifica la información ingresada.';
						} else if (error.message.includes('Network request failed')) {
							errorMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
						} else if (error.message.includes('500')) {
							errorMessage = 'Error del servidor. Intenta más tarde.';
						} else {
							errorMessage = error.message;
						}
					}

					setError(errorMessage);
				} finally {
					setIsLoading(false);
				}
				break;

			case 5: // Login screen
				if (!email.trim() || !password.trim()) {
					setError('Por favor completa todos los campos');
					return;
				}

				// Validación básica de email
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(email)) {
					setError('Por favor ingresa un email válido');
					return;
				}

				setIsLoading(true);
				setError('');

				try {
					console.log('🔐 Iniciando sesión desde onboarding...');

					// Hacer login con las credenciales ingresadas
					const authResponse = await authService.login(email, password);

					console.log('✅ Login exitoso:', authResponse.data.user);

					// Preparar datos adicionales del onboarding
					const additionalData = {
						name,
						lastName,
						age: Number(age),
						birthDate,
						gender: gender as 'male' | 'female' | 'Otro',
						phone,
						country,
						city,
						postalCode,
						address,
						activities
					};

					// Marcar onboarding como completado en el backend
					await authService.markOnboardingComplete();

					// Actualizar datos del usuario con información del onboarding
					const updatedUserData = {
						...authResponse.data.user,
						...additionalData,
						doneOnboarding: true
					};
					await storageService.updateUserData(updatedUserData);
					await storageService.markOnboardingComplete();

					console.log('✅ Onboarding completado exitosamente');

					// Refrescar el estado para que _layout.tsx detecte los cambios
					setTimeout(() => {
						onFinish();
					}, 100);
				} catch (error) {
					console.error('❌ Error en login desde onboarding:', error);

					let errorMessage = 'Error al iniciar sesión. Por favor intenta de nuevo.';

					if (error instanceof Error) {
						if (error.message.includes('401')) {
							errorMessage = 'Email o contraseña incorrectos.';
						} else if (error.message.includes('Network request failed')) {
							errorMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
						} else if (error.message.includes('404')) {
							errorMessage = 'Usuario no encontrado.';
						} else if (error.message.includes('500')) {
							errorMessage = 'Error del servidor. Intenta más tarde.';
						} else {
							errorMessage = error.message;
						}
					}

					setError(errorMessage);
				} finally {
					setIsLoading(false);
				}
				break;
		}
	};

	const handleBack = () => {
		if (step > 0) {
			setStep(step - 1);
		}
	};

	const toggleActivity = (activity: string) => {
		setActivities((prev) => (prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]));
	};

	const renderStep = () => {
		switch (step) {
			case 0:
				return (
					<View style={styles.stepContainer}>
						<Image source={require('../assets/images/logo.png')} style={styles.logo} />
						<Text style={styles.title}>¡Bienvenido a Gimnasio Libre!</Text>
						<Text style={styles.subtitle}>Tu espacio para entrenar y conectar</Text>
						<Text style={styles.description}>
							Vamos a configurar tu perfil para que puedas empezar a entrenar y conocer a otros deportistas.
						</Text>
					</View>
				);

			case 1:
				return (
					<View style={styles.stepContainer}>
						<Text style={styles.stepTitle}>Información Personal</Text>
						<TextInput
							style={styles.input}
							placeholder='Nombre'
							placeholderTextColor={Colors.light.icon}
							value={name}
							onChangeText={setName}
						/>
						<TextInput
							style={styles.input}
							placeholder='Apellido'
							placeholderTextColor={Colors.light.icon}
							value={lastName}
							onChangeText={setLastName}
						/>
						<TextInput
							style={styles.input}
							placeholder='Edad'
							placeholderTextColor={Colors.light.icon}
							value={age}
							onChangeText={setAge}
							keyboardType='numeric'
						/>
						<TextInput
							style={styles.input}
							placeholder='Fecha de nacimiento (YYYY-MM-DD)'
							placeholderTextColor={Colors.light.icon}
							value={birthDate}
							onChangeText={setBirthDate}
						/>
						<TextInput
							style={styles.input}
							placeholder='Teléfono'
							placeholderTextColor={Colors.light.icon}
							value={phone}
							onChangeText={setPhone}
							keyboardType='phone-pad'
						/>
						<View style={styles.genderRow}>
							{[
								{value: 'male', label: 'M'},
								{value: 'female', label: 'F'},
								{value: 'Otro', label: 'Otro'}
							].map((g) => (
								<TouchableOpacity
									key={g.value}
									style={[styles.genderButton, gender === g.value && styles.genderButtonSelected]}
									onPress={() => setGender(g.value)}
								>
									<Text style={[styles.genderText, gender === g.value && styles.genderTextSelected]}>{g.label}</Text>
								</TouchableOpacity>
							))}
						</View>

						<View style={styles.divider}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>ó</Text>
							<View style={styles.dividerLine} />
						</View>

						<TouchableOpacity style={styles.socialButton}>
							<Ionicons name='logo-google' size={24} color={Colors.light.text} style={styles.socialIcon} />
							<Text style={styles.socialButtonText}>Continuar con Google</Text>
						</TouchableOpacity>
						{Platform.OS === 'ios' && (
							<TouchableOpacity style={styles.socialButton}>
								<Ionicons name='logo-apple' size={24} color={Colors.light.text} style={styles.socialIcon} />
								<Text style={styles.socialButtonText}>Continuar con Apple</Text>
							</TouchableOpacity>
						)}
					</View>
				);

			case 2:
				return (
					<View style={styles.stepContainer}>
						<Text style={styles.stepTitle}>Ubicación</Text>
						<TextInput
							style={styles.input}
							placeholder='País'
							placeholderTextColor={Colors.light.icon}
							value={country}
							onChangeText={setCountry}
						/>
						<TextInput
							style={styles.input}
							placeholder='Ciudad'
							placeholderTextColor={Colors.light.icon}
							value={city}
							onChangeText={setCity}
						/>
						<TextInput
							style={styles.input}
							placeholder='Código Postal'
							placeholderTextColor={Colors.light.icon}
							value={postalCode}
							onChangeText={setPostalCode}
							keyboardType='numeric'
						/>
						<TextInput
							style={styles.input}
							placeholder='Dirección (opcional)'
							placeholderTextColor={Colors.light.icon}
							value={address}
							onChangeText={setAddress}
						/>
					</View>
				);

			case 3:
				return (
					<View style={styles.stepContainer}>
						<Text style={styles.stepTitle}>Cuenta</Text>
						<TextInput
							style={styles.input}
							placeholder='Email'
							placeholderTextColor={Colors.light.icon}
							value={email}
							onChangeText={setEmail}
							keyboardType='email-address'
							autoCapitalize='none'
						/>
						<View style={styles.passwordContainer}>
							<TextInput
								style={[styles.input, styles.passwordInput]}
								placeholder='Contraseña'
								placeholderTextColor={Colors.light.icon}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
							/>
							<TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
								<Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={Colors.light.icon} />
							</TouchableOpacity>
						</View>
					</View>
				);

			case 4:
				return (
					<View style={styles.stepContainer}>
						<Text style={styles.stepTitle}>¿Qué te gusta hacer?</Text>
						<Text style={styles.subtitle}>Selecciona tus actividades favoritas</Text>
						<View style={styles.activitiesGrid}>
							{categories.length > 0
								? categories.map((category) => (
										<TouchableOpacity
											key={category}
											style={[styles.activityButton, activities.includes(category) && styles.activityButtonSelected]}
											onPress={() => toggleActivity(category)}
										>
											<Text style={[styles.activityText, activities.includes(category) && styles.activityTextSelected]}>
												{category}
											</Text>
										</TouchableOpacity>
								  ))
								: // Mostrar skeleton mientras se cargan las categorías
								  Array.from({length: 8}).map((_, index) => (
										<View key={`skeleton-${index}`} style={[styles.activityButton, styles.activityButtonSkeleton]}>
											<View style={styles.skeletonText} />
										</View>
								  ))}
						</View>
					</View>
				);

			case 5:
				return (
					<View style={styles.stepContainer}>
						<Image source={require('../assets/images/logo.png')} style={styles.logo} />
						<Text style={styles.title}>¡Perfil creado!</Text>
						<Text style={styles.subtitle}>Ahora inicia sesión para continuar</Text>
						<Text style={styles.description}>Tu cuenta ha sido creada exitosamente. Inicia sesión para acceder a tu perfil.</Text>

						<View style={styles.loginContainer}>
							<TextInput
								style={styles.input}
								placeholder='Email'
								placeholderTextColor={Colors.light.icon}
								value={email}
								onChangeText={setEmail}
								keyboardType='email-address'
								autoCapitalize='none'
							/>
							<View style={styles.passwordContainer}>
								<TextInput
									style={[styles.input, styles.passwordInput]}
									placeholder='Contraseña'
									placeholderTextColor={Colors.light.icon}
									value={password}
									onChangeText={setPassword}
									secureTextEntry={!showPassword}
								/>
								<TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
									<Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={Colors.light.icon} />
								</TouchableOpacity>
							</View>
						</View>
					</View>
				);
		}
	};

	return (
		<KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<SafeAreaView style={styles.container}>
					<ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
						{renderStep()}
						{error ? <Text style={styles.error}>{error}</Text> : null}
						<View style={styles.buttonContainer}>
							{step > 0 && step < 5 && (
								<TouchableOpacity style={styles.backButton} onPress={handleBack}>
									<Text style={styles.backButtonText}>Atrás</Text>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
								onPress={handleNext}
								disabled={isLoading}
							>
								{isLoading ? (
									<Text style={styles.nextButtonText}>
										{step === 4 ? 'Creando cuenta...' : step === 5 ? 'Iniciando sesión...' : 'Cargando...'}
									</Text>
								) : (
									<Text style={styles.nextButtonText}>
										{step === 4 ? 'Crear Cuenta' : step === 5 ? 'Iniciar Sesión' : 'Siguiente'}
									</Text>
								)}
							</TouchableOpacity>
						</View>
					</ScrollView>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background
	},
	scrollContent: {
		flexGrow: 1,
		padding: 24
	},
	stepContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	logo: {
		width: 120,
		height: 120,
		resizeMode: 'contain',
		marginBottom: 24
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.light.text,
		textAlign: 'center',
		marginBottom: 12
	},
	subtitle: {
		fontSize: 16,
		color: Colors.light.icon,
		textAlign: 'center',
		marginBottom: 24
	},
	description: {
		fontSize: 14,
		color: Colors.light.icon,
		textAlign: 'center',
		marginBottom: 24,
		lineHeight: 20
	},
	stepTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 24
	},
	input: {
		width: '100%',
		borderWidth: 1,
		borderColor: Colors.light.icon,
		borderRadius: 12,
		padding: 12,
		fontSize: 16,
		marginBottom: 12,
		backgroundColor: Colors.light.card,
		color: Colors.light.text
	},
	passwordContainer: {
		width: '100%',
		position: 'relative',
		marginBottom: 12
	},
	passwordInput: {
		width: '100%',
		paddingRight: 48 // Espacio para el icono
	},
	eyeIcon: {
		position: 'absolute',
		right: 12,
		top: '35%',
		transform: [{translateY: -12}],
		padding: 4
	},
	genderRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 12,
		width: '100%'
	},
	genderButton: {
		borderWidth: 1,
		borderColor: Colors.light.icon,
		borderRadius: 16,
		paddingHorizontal: 18,
		paddingVertical: 8,
		marginHorizontal: 6,
		backgroundColor: Colors.light.background
	},
	genderButtonSelected: {
		backgroundColor: Colors.light.tint,
		borderColor: Colors.light.tint
	},
	genderText: {
		color: Colors.light.text,
		fontWeight: '500'
	},
	genderTextSelected: {
		color: '#fff'
	},
	activitiesGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginTop: 12
	},
	activityButton: {
		borderWidth: 1,
		borderColor: Colors.light.icon,
		borderRadius: 16,
		paddingHorizontal: 16,
		paddingVertical: 8,
		margin: 4,
		backgroundColor: Colors.light.background
	},
	activityButtonSelected: {
		backgroundColor: Colors.light.tint,
		borderColor: Colors.light.tint
	},
	activityText: {
		color: Colors.light.text,
		fontWeight: '500'
	},
	activityTextSelected: {
		color: '#fff'
	},
	activityButtonSkeleton: {
		backgroundColor: Colors.light.tabIconDefault + '20',
		borderColor: Colors.light.tabIconDefault + '40'
	},
	skeletonText: {
		width: '60%',
		height: 16,
		backgroundColor: Colors.light.tabIconDefault + '30',
		borderRadius: 8
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 24,
		gap: 12
	},
	backButton: {
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 24,
		borderWidth: 1,
		borderColor: Colors.light.icon
	},
	backButtonText: {
		color: Colors.light.text,
		fontWeight: '500'
	},
	nextButton: {
		backgroundColor: Colors.light.tint,
		paddingHorizontal: 32,
		paddingVertical: 12,
		borderRadius: 24,
		shadowColor: Colors.light.tint,
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 2
	},
	nextButtonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16
	},
	nextButtonDisabled: {
		opacity: 0.6
	},
	error: {
		color: 'red',
		marginTop: 12,
		textAlign: 'center'
	},
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 24,
		width: '100%'
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: Colors.light.icon
	},
	dividerText: {
		color: Colors.light.icon,
		marginHorizontal: 10,
		fontSize: 14,
		fontWeight: 'bold'
	},
	socialButton: {
		backgroundColor: Colors.light.background,
		borderWidth: 1,
		borderColor: Colors.light.icon,
		borderRadius: 24,
		paddingVertical: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
		width: '100%'
	},
	socialIcon: {
		marginRight: 8
	},
	socialButtonText: {
		color: Colors.light.text,
		fontWeight: '500',
		fontSize: 16
	},
	loginContainer: {
		width: '100%',
		marginTop: 24
	}
});
