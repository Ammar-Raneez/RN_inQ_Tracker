import React from 'react'
import HomePage from './HomePage'
import LoginPage from './LoginPage'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen name="Home" component={HomePage} />
				<Stack.Screen 
					name="Login" 
					component={LoginPage}
					options={{
						title: 'Sign in or Sign Up'
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App