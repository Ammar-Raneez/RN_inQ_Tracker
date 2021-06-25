import { useEffect, useState } from 'react'
import React from 'react'
import { Button, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { LineChart } from 'react-native-chart-kit'

const App = () => {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [total, setTotal] = useState("");
	const [labels, setLabes] = useState([]);
	const [dataPoints, setDataPoints] = useState([]);
	const [gigs, setGigs] = useState([
		{
			description: 'Freelance job',
			amount: 500,
			timestamp: new Date()
		},
		{
			description: 'Freelance job',
			amount: 700,
			timestamp: new Date()
		},
	]);

	useEffect(() => {
		setTotal(gigs.reduce((total, gig) => total + Number(gig.amount), 0));
	}, [gigs])

	const addGig = () => {
		setGigs([...gigs, {
			description,
			amount,
			timestamp: new Date()
		}]);

		setDescription("")
		setAmount("")
	}

	return (
		<SafeAreaView>
			<LineChart 
				data={{
					labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
					datasets: [
						{
							data: [
								gigs[0].amount,
								gigs[1].amount,
								gigs[0].amount,
								gigs[1].amount,
								gigs[0].amount,
								gigs[1].amount,
								gigs[0].amount,
								gigs[1].amount,
								gigs[0].amount,
								gigs[1].amount,
							]
						}
					]
				}}
				width={Dimensions.get("window").width}
				height={220}
				yAxisLabel="Rs."
				yAxisInterval={1}
				chartConfig={{
					backgroundColor: "#e26a00",
					backgroundGradientFrom: "green",
					backgroundGradientTo: "blue",
					decimalPlaces: 2,
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16
					},
					propsForDots: {
						r: "6",
						strokeWidth: "2",
						stroke: "#ffa726"
					}
				}}
				bezier
				style={{
					marginVertical: 8,
					borderRadius: 16
				}}
			/>

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
