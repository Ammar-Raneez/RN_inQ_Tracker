import { useEffect, useState } from 'react'
import React from 'react'
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';

const App = () => {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [total, setTotal] = useState("");
	const [gigs, setGigs] = useState([]);

	useEffect(() => {
		setTotal(gigs.reduce((total, gig) => total + Number(gig.amount), 0));
	}, [gigs])

	const addGig = () => {
		setGigs([...gigs, {
			description,
			amount
		}]);

		setDescription("")
		setAmount("")
	}

	return (
		<SafeAreaView>
			<Text>Total Income: {total}</Text>
			<TextInput 
				style={styles.input}
				value={description}
				placeholder="Enter a description"
				onChangeText={text => setDescription(text)}
			/>
			<TextInput 
				style={styles.input}
				value={amount}
				keyboardType='numeric'
				placeholder="Enter amount"
				onChangeText={text => setAmount(text)}
			/>
			{
				gigs.map(gig => (
					<View>
						<Text>{gig.description}</Text>
						<Text>{gig.amount}</Text>
					</View>
				))
			}
			<Button disabled={description == "" || amount == ""} title="Add GIG" onPress={addGig} />
		</SafeAreaView>
	)
}

export default App

const styles = StyleSheet.create({
	input: {
		margin: 20,
		padding: 20,
		height: 40,
		borderColor: 'red',
		borderWidth: 1
	}
})
