import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

const LoginPage = ({ navigation }) => {
    return (
        <View>
            <Text>Login page</Text>
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
    )
}

export default LoginPage

const styles = StyleSheet.create({})
