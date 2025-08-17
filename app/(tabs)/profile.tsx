import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function ProfileScreen() {
	const [avatar, setAvatar] = useState<string | null>(null);
	const [userName, setUserName] = useState('Usuario');

	useEffect(() => {
		loadUserData();
	}, []);

	const loadUserData = async () => {
		try {
			const [savedAvatar, userDataStr] = await Promise.all([AsyncStorage.getItem('userAvatar'), AsyncStorage.getItem('userData')]);

			if (savedAvatar) setAvatar(savedAvatar);
			if (userDataStr) {
				const userData = JSON.parse(userDataStr);
				setUserName(`${userData.name} ${userData.lastName}`);
			}
		} catch (error) {
			console.error('Error loading user data:', error);
		}
	};

	const pickImage = async () => {
		const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status !== 'granted') {
			alert('Se necesita permiso para acceder a la galería');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5
		});

		if (!result.canceled) {
			setAvatar(result.assets[0].uri);
			AsyncStorage.setItem('userAvatar', result.assets[0].uri);
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<View style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
						{avatar ? (
							<Image source={{uri: avatar}} style={styles.avatar} />
						) : (
							<View style={styles.avatarPlaceholder}>
								<Text style={styles.avatarInitials}>{getInitials(userName)}</Text>
							</View>
						)}
						<View style={styles.cameraIconContainer}>
							<Ionicons name='camera' size={24} color='#fff' />
						</View>
					</TouchableOpacity>
					<Text style={styles.name}>{userName}</Text>
					<Text style={styles.membership}>Membresía: Básica</Text>
				</View>

				<View style={styles.statsContainer}>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>12</Text>
						<Text style={styles.statLabel}>Entrenamientos</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>3</Text>
						<Text style={styles.statLabel}>Semanas</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>85%</Text>
						<Text style={styles.statLabel}>Asistencia</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Historial de Entrenamientos</Text>
					<View style={styles.workoutItem}>
						<Text style={styles.workoutDate}>Hoy</Text>
						<Text style={styles.workoutType}>Entrenamiento de Fuerza</Text>
						<Text style={styles.workoutDuration}>45 minutos</Text>
					</View>
					<View style={styles.workoutItem}>
						<Text style={styles.workoutDate}>Ayer</Text>
						<Text style={styles.workoutType}>Cardio</Text>
						<Text style={styles.workoutDuration}>30 minutos</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	header: {
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	avatarContainer: {
		position: 'relative',
		marginBottom: 10
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50
	},
	avatarPlaceholder: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: '#111',
		justifyContent: 'center',
		alignItems: 'center'
	},
	avatarInitials: {
		color: '#fff',
		fontSize: 40,
		fontWeight: 'bold'
	},
	cameraIconContainer: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: '#111',
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#fff'
	},
	name: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 5
	},
	membership: {
		fontSize: 16,
		color: '#666'
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 20,
		marginHorizontal: 15,
		marginTop: -10,
		backgroundColor: '#fff',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3
	},
	statItem: {
		alignItems: 'center'
	},
	statNumber: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#111'
	},
	statLabel: {
		fontSize: 14,
		color: '#666',
		marginTop: 5
	},
	section: {
		padding: 20
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 15
	},
	workoutItem: {
		padding: 15,
		backgroundColor: '#f8f8f8',
		borderRadius: 10,
		marginBottom: 10
	},
	workoutDate: {
		fontSize: 14,
		color: '#666',
		marginBottom: 5
	},
	workoutType: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 5
	},
	workoutDuration: {
		fontSize: 14,
		color: '#666'
	}
});
