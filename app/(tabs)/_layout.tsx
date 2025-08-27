import {Ionicons} from '@expo/vector-icons';
import {Tabs} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Colors} from '../../constants/Colors';

export default function TabLayout() {
	return (
		<View style={styles.container}>
			<StatusBar style='dark' />
			<SafeAreaView style={styles.safeArea} edges={['top']}>
				<View style={styles.content}>
					<Tabs
						screenOptions={{
							tabBarActiveTintColor: Colors.dark.tabIconSelected,
							tabBarInactiveTintColor: Colors.light.tabIconDefault,
							headerShown: false,
							tabBarStyle: styles.tabBar,
							tabBarLabelStyle: styles.tabBarLabel,
							tabBarItemStyle: styles.tabBarItem
						}}
					>
						<Tabs.Screen
							name='index'
							options={{
								title: 'Home',
								tabBarIcon: ({color}) => <Ionicons name='home' size={24} color={color} />
							}}
						/>
						<Tabs.Screen
							name='explore'
							options={{
								title: 'Explorar',
								tabBarIcon: ({color}) => (
									<View style={styles.middleTab}>
										<Ionicons name='search' size={24} color={Colors.dark.background} />
									</View>
								)
							}}
						/>
						<Tabs.Screen
							name='profile'
							options={{
								title: 'Perfil',
								tabBarIcon: ({color}) => <Ionicons name='person' size={24} color={color} />
							}}
						/>
					</Tabs>
				</View>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background
	},
	safeArea: {
		flex: 1
		//backgroundColor: Colors.light.background
	},
	content: {
		flex: 1
		//backgroundColor: Colors.light.background
	},
	logoText: {
		fontSize: 28,
		fontWeight: 'bold',
		color: Colors.dark.tint,
		letterSpacing: 1
	},
	tabBar: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		elevation: 0,
		backgroundColor: Colors.dark.background,
		height: 85,
		paddingBottom: 15,
		marginBottom: 8,
		marginHorizontal: 10,
		borderTopWidth: 1,
		borderTopColor: Colors.light.tabIconDefault,
		borderRadius: 20,
		...Platform.select({
			ios: {
				shadowColor: Colors.light.text,
				shadowOffset: {
					width: 0,
					height: -2
				},
				shadowOpacity: 0.1,
				shadowRadius: 3
			},
			android: {
				elevation: 3
			}
		})
	},
	tabBarLabel: {
		fontSize: 12,
		fontWeight: '500',
		marginTop: 5
	},
	tabBarItem: {
		paddingVertical: 10
	},
	middleTab: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: Colors.dark.tint,
		justifyContent: 'center',
		alignItems: 'center',
		top: -25,
		...Platform.select({
			ios: {
				shadowColor: Colors.light.text,
				shadowOffset: {
					width: 0,
					height: 2
				},
				shadowOpacity: 0.25,
				shadowRadius: 3.84
			},
			android: {
				elevation: 5
			}
		})
	}
});
