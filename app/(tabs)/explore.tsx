import {Colors} from '@/interfaces/constants/Colors';
import {Ionicons} from '@expo/vector-icons';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const exercises = [
	{
		id: 1,
		name: 'Sentadillas',
		category: 'Piernas',
		image: 'https://example.com/squat.jpg',
		difficulty: 'Intermedio'
	},
	{
		id: 2,
		name: 'Press de Banca',
		category: 'Pecho',
		image: 'https://example.com/bench.jpg',
		difficulty: 'Intermedio'
	},
	{
		id: 3,
		name: 'Dominadas',
		category: 'Espalda',
		image: 'https://example.com/pullup.jpg',
		difficulty: 'Avanzado'
	}
];

const routines = [
	{
		id: 1,
		name: 'Rutina Full Body',
		duration: '45 min',
		level: 'Principiante',
		exercises: 8
	},
	{
		id: 2,
		name: 'Rutina Push/Pull',
		duration: '60 min',
		level: 'Intermedio',
		exercises: 12
	},
	{
		id: 3,
		name: 'Rutina Hipertrofia',
		duration: '75 min',
		level: 'Avanzado',
		exercises: 15
	}
];

export default function ExploreScreen() {
	return (
		<View style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<Ionicons name='barbell' size={26} color={Colors.light.text} />
					<Text style={styles.title}>Ejercicios y Rutinas</Text>
					<Ionicons name='barbell' size={26} color={Colors.light.text} />
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Ejercicios Populares</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exercisesScroll}>
						{exercises.map((exercise) => (
							<TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
								<View style={styles.exerciseImagePlaceholder}>
									<Ionicons name='barbell' size={40} color='#666' />
								</View>
								<Text style={styles.exerciseName}>{exercise.name}</Text>
								<Text style={styles.exerciseCategory}>{exercise.category}</Text>
								<View style={styles.difficultyBadge}>
									<Text style={styles.difficultyText}>{exercise.difficulty}</Text>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Rutinas Recomendadas</Text>
					{routines.map((routine) => (
						<TouchableOpacity key={routine.id} style={styles.routineCard}>
							<View style={styles.routineInfo}>
								<Text style={styles.routineName}>{routine.name}</Text>
								<View style={styles.routineDetails}>
									<View style={styles.routineDetail}>
										<Ionicons name='time-outline' size={16} color='#666' />
										<Text style={styles.routineDetailText}>{routine.duration}</Text>
									</View>
									<View style={styles.routineDetail}>
										<Ionicons name='fitness-outline' size={16} color='#666' />
										<Text style={styles.routineDetailText}>{routine.exercises} ejercicios</Text>
									</View>
								</View>
								<View style={styles.routineLevelDetail}>
									<Ionicons name='trending-up-outline' size={16} color='#666' />
									<Text style={styles.routineDetailText}>{routine.level}</Text>
								</View>
							</View>
							<TouchableOpacity style={styles.startButton}>
								<Text style={styles.startButtonText}>Comenzar</Text>
							</TouchableOpacity>
						</TouchableOpacity>
					))}
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
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		paddingTop: 18,
		paddingBottom: 22,
		marginTop: 5,
		marginHorizontal: 10,
		backgroundColor: Colors.light.background,
		borderBottomWidth: 0,
		borderRadius: 20
	},
	title: {
		fontSize: 25,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginHorizontal: 10
	},
	section: {
		padding: 20
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 15
	},
	exercisesScroll: {
		marginHorizontal: -20,
		paddingHorizontal: 20
	},
	exerciseCard: {
		width: 160,
		backgroundColor: '#f8f8f8',
		borderRadius: 10,
		padding: 15,
		marginRight: 15
	},
	exerciseImagePlaceholder: {
		width: '100%',
		height: 100,
		backgroundColor: '#eee',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10
	},
	exerciseName: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 5
	},
	exerciseCategory: {
		fontSize: 14,
		color: '#666',
		marginBottom: 10
	},
	difficultyBadge: {
		backgroundColor: Colors.light.tint,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 15,
		alignSelf: 'flex-start'
	},
	difficultyText: {
		color: Colors.light.background,
		fontSize: 12,
		fontWeight: '500'
	},
	routineCard: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#f8f8f8',
		padding: 15,
		borderRadius: 10,
		marginBottom: 10
	},
	routineInfo: {
		flex: 1
	},
	routineName: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10
	},
	routineDetails: {
		flexDirection: 'row',
		gap: 15
	},
	routineDetail: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5
	},
	routineDetailText: {
		fontSize: 14,
		color: '#666'
	},
	routineLevelDetail: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4
	},
	startButton: {
		backgroundColor: Colors.light.tint,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20
	},
	startButtonText: {
		color: Colors.light.background,
		fontWeight: '500'
	}
});
