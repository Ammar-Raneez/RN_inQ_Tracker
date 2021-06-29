import React from 'react'
import Home from './Home'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './screens/Login';
import Register from './screens/Register';

const Stack = createStackNavigator();

const globalScreenOptions = {
	headerStyle: { backgroundColor: 'white' },
	headerTitleStyle: { color: 'black' },
	headerTintColor: 'black',
}

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={globalScreenOptions}>
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Register" component={Register} />
				<Stack.Screen name="Home" component={Home} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App