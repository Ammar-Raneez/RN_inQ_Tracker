import React from 'react'
import { SafeAreaView } from 'react-native'
import HomePage from './HomePage'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="home" component={HomePage} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App