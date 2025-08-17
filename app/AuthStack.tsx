import {Colors} from '@/constants/Colors';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
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

export default function AuthStack({onAuthSuccess}: {onAuthSuccess: () => void}) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleLogin = async () => {
		if (!email.trim() || !password.trim()) {
			setError('Por favor completa todos los campos');
			return;
		}

		try {
			// Aquí iría la lógica de autenticación real
			// Por ahora simulamos un login exitoso
			await AsyncStorage.setItem('authToken', 'dummy-token');
			onAuthSuccess();
		} catch (error) {
			setError('Error al iniciar sesión: ' + error);
		}
	};

	const handleRegister = () => {
		// Limpiar el estado de autenticación y onboarding
		AsyncStorage.multiRemove(['authToken', 'onboardingComplete', 'userData'])
			.then(() => {
				onAuthSuccess(); // Esto llevará al usuario al onboarding
			})
			.catch((error) => {
				console.error('Error al limpiar el estado:', error);
			});
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
							<TouchableOpacity style={styles.button} onPress={handleLogin}>
								<Text style={styles.buttonText}>Iniciar Sesión</Text>
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
