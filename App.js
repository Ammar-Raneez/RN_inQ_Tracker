import React from 'react'
import Dashboard from './screens/Dashboard'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './screens/Login';
import Register from './screens/Register';

const Stack = createStackNavigator();

const globalScreenOptions = {
	headerStyle: { backgroundColor: '#282828' },
	headerTitleStyle: { color: 'white' },
	headerTintColor: 'white',
}

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={globalScreenOptions}>
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Register" component={Register} />
				<Stack.Screen name="Dashboard" component={Dashboard} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App