import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';

const LoginPage = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {
        if (username === 'me' && password === 'admin') {
            navigation.navigate('Home');
        }
    }

    return (
        <View>
            <TextInput 
				value={username}
                style={styles.input}
				placeholder="Enter username"
				onChangeText={text => setUsername(text)}
			/>
			<TextInput  
				value={password}
                style={styles.input}
				placeholder="Enter password"
                secureTextEntry={true}
				onChangeText={text => setPassword(text)}
			/>
            <Button title="Go Back" onPress={login} />
        </View>
    )
}

export default LoginPage

const styles = StyleSheet.create({
	input: {
		marginTop: 20,
		height: 40,
		borderColor: 'red',
		borderWidth: 1
	}
})
