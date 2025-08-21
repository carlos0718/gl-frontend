import {Colors} from '@/constants/Colors';
import {authService} from '@/services/authService';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
	ActivityIndicator,
	Alert,
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

export default function AuthStack({onAuthSuccess}: {onAuthSuccess: () => void}) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
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
			console.log('🔐 Intentando login con:', email);

			const response = await authService.login(email, password);

			console.log('✅ Login exitoso:', response.data.user.name);

			// Mostrar mensaje de bienvenida y refrescar el estado
			Alert.alert('¡Bienvenido!', `Hola ${response.data.user.name}, has iniciado sesión exitosamente.`, [
				{
					text: 'OK',
					onPress: () => {
						// Refrescar el estado para que _layout.tsx detecte los cambios
						setTimeout(() => {
							onAuthSuccess();
						}, 100);
					}
				}
			]);
		} catch (error) {
			console.error('❌ Error en login:', error);

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
	};

	const handleForgotPassword = async () => {
		if (!email.trim()) {
			setError('Por favor ingresa tu email para recuperar la contraseña');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError('Por favor ingresa un email válido');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			await authService.forgotPassword(email);

			Alert.alert('Email enviado', 'Se ha enviado un enlace de recuperación a tu email.', [{text: 'OK'}]);
		} catch (error) {
			console.error('❌ Error en forgot password:', error);

			let errorMessage = 'Error al enviar el email de recuperación.';

			if (error instanceof Error) {
				if (error.message.includes('404')) {
					errorMessage = 'No se encontró una cuenta con este email.';
				} else if (error.message.includes('Network request failed')) {
					errorMessage = 'Error de conexión. Verifica tu internet.';
				}
			}

			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegister = async () => {
		console.log('📝 Usuario quiere registrarse, limpiando estado y redirigiendo al onboarding...');

		try {
			// Limpiar todo el estado y marcar onboarding como incompleto en una sola operación
			await AsyncStorage.multiRemove(['authToken', 'userData']);
			await AsyncStorage.setItem('onboardingComplete', 'false');
			console.log('✅ Estado limpiado y onboarding marcado como incompleto');

			// Verificar que se guardó correctamente
			const onboardingStatus = await AsyncStorage.getItem('onboardingComplete');
			console.log('🔍 Verificación - onboardingComplete:', onboardingStatus);

			// Pequeño delay para asegurar que AsyncStorage se actualice
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Redirigir al onboarding
			console.log('🔄 Redirigiendo al onboarding...');
			onAuthSuccess();
		} catch (error) {
			console.error('❌ Error al limpiar el estado:', error);
			// Continuar de todas formas
			onAuthSuccess();
		}
	};

	return (
		<KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<SafeAreaView style={styles.container}>
					<ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
						<View style={styles.centered}>
							<Image source={require('@/assets/images/logo.png')} style={styles.logo} />
							<Text style={styles.title}>Bienvenido</Text>
							<TextInput
								style={styles.input}
								placeholder='Email'
								placeholderTextColor={Colors.light.icon}
								value={email}
								onChangeText={setEmail}
								keyboardType='email-address'
								autoCapitalize='none'
							/>
							<TextInput
								style={styles.input}
								placeholder='Contraseña'
								placeholderTextColor={Colors.light.icon}
								value={password}
								onChangeText={setPassword}
								secureTextEntry
							/>
							{error ? <Text style={styles.error}>{error}</Text> : null}
							<TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleLogin} disabled={isLoading}>
								{isLoading ? <ActivityIndicator color='#fff' size='small' /> : <Text style={styles.buttonText}>Iniciar Sesión</Text>}
							</TouchableOpacity>
							<TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword} disabled={isLoading}>
								<Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
							</TouchableOpacity>
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
							<TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
								<Text style={styles.registerButtonText}>¿No tienes cuenta? Regístrate</Text>
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
		justifyContent: 'center',
		padding: 24
	},
	centered: {
		alignItems: 'center',
		justifyContent: 'center'
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
	button: {
		backgroundColor: Colors.light.tint,
		paddingHorizontal: 32,
		paddingVertical: 14,
		borderRadius: 24,
		marginTop: 12,
		shadowColor: Colors.light.tint,
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 2
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16
	},
	buttonDisabled: {
		opacity: 0.6
	},
	forgotPasswordButton: {
		marginTop: 12,
		padding: 8
	},
	forgotPasswordText: {
		color: Colors.light.tint,
		fontSize: 14,
		textDecorationLine: 'underline'
	},
	error: {
		color: 'red',
		marginBottom: 8,
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
	registerButton: {
		marginTop: 16
	},
	registerButtonText: {
		color: Colors.light.tint,
		fontSize: 14
	}
});
