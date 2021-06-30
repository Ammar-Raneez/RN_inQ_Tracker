import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, View, Image } from 'react-native'
import { Button, Input } from 'react-native-elements';
import { auth } from '../firebase';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: { alignSelf: 'center' },
        })
    }, [])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
            if (authUser) {
                // we dont put home to stack
                // we then we can navigate back to login thru the top nav bar
                navigation.replace("Dashboard")
            }
        })
        
        return unsubscribe;
    }, [])

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
            .then(() => navigation.replace("Home"))
            .catch(error => alert(error.message))
    }

    const register = () => {
        navigation.navigate("Register")
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <Image
                source={require('./logo.png')}
                style={{ width: 200, height: 200 }}
            />

            <View style={styles.inputContainer}>
                <Input 
                    placeholder="Email" 
                    autofocus 
                    type="email"
                    value={email}
                    style={{ outline: "none" }}
                    onChangeText={text => setEmail(text)}
                />
                <Input 
                    placeholder="Password" 
                    autofocus 
                    type="password" 
                    secureTextEntry 
                    value={password}
                    style={{ outline: "none" }}
                    onChangeText={text => setPassword(text)}
                    onSubmitEditing={signIn}
                />
            </View>

            <Button 
                onPress={signIn} 
                containerStyle={styles.button} 
                buttonStyle={{ backgroundColor: '#2ECC71' }} 
                title="Login"
                disabled={!email || !password}
            />
            <Button 
                onPress={register} 
                containerStyle={styles.button} 
                buttonStyle={{ borderColor: '#2ECC71' }} 
                titleStyle={{ color: '#2ECC71' }} 
                type="outline" 
                title="Register"
                />

            <View style={{ height: 100 }} />
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },

    inputContainer: {
        width: 300,
    },

    button: {
        width: 200,
        marginTop: 10,
    }
})
