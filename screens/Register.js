import React, { useLayoutEffect } from 'react'
import { useState } from 'react'
import { StatusBar } from 'react-native'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { Input, Text, Button } from 'react-native-elements'
import { auth } from '../firebase'

const Register = ({ navigation }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // similar to use effect, is used to customize the default top bar and stuff
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: { marginLeft: -20 },
        })
    }, [navigation])

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(authUser => {
                authUser.user.updateProfile({
                    displayName: fullName,
                    photoURL: imageUrl || 'https://p.kindpng.com/picc/s/78-785904_block-chamber-of-commerce-avatar-white-avatar-icon.png'
                })
            })
            .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />

            <Text h3 style={{ marginBottom: 50 }}>
                Create an InQTrack Account
            </Text>

            <View style={styles.inputContainer}>
                <Input
                    placeholder="Full Name"
                    autofocus
                    type="text"
                    value={fullName}
                    onChangeText={text => setFullName(text)}
                />
                <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <Input
                    placeholder="Password"
                    autofocus
                    type="password"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Input
                    placeholder="Profile Picture"
                    autofocus
                    type="text"
                    value={imageUrl}
                    onChangeText={text => setImageUrl(text)}
                    // on pressing enter on final field
                    onSubmitEditing={register}
                />
            </View>

            <Button 
                buttonStyle={{ backgroundColor: '#2ECC71' }} 
                containerStyle={styles.button} 
                onPress={register} 
                title="Register"
                disabled={!fullName || !email || !password || password.length < 6}
            />
        </KeyboardAvoidingView>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },

    inputContainer: {
        width: 300,
    },

    button: {
        width: 200,
        marginTop: 10
    }
})
