import { useEffect, useState } from 'react'
import React from 'react'
import { Button, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { LineChart } from 'react-native-chart-kit'
import moment from 'moment'

const App = () => {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [total, setTotal] = useState("");
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

	const [data, setData] = useState([
		{
			date: moment().format('LL'), 
			amount: 2000
		},
		{
			date: moment().subtract(1, 'days').format('LL'),
			amount: 2500
		},
		{
			date: moment().subtract(1, 'days').format('LL'),
			amount: 2550
		},
		{
			date: moment().subtract(2, 'days').format('LL'),
			amount: 3500
		},
		{
			date: moment().subtract(3, 'days').format('LL'),
			amount: 4500
		},
		{
			date: moment().subtract(4, 'days').format('LL'),
			amount: 5500
		}
	]);

	const [transformedData, setTranformedData] = useState([]);

	useEffect(() => {
		setTotal(gigs.reduce((total, gig) => total + Number(gig.amount), 0));
	}, [gigs])

	useEffect(() => {
		setTranformedData(transformData(groupBy(data, 'date')))
	}, [data])

	const getDates = () => transformedData.map(pair => pair.date);
	const getAmounts = () => transformedData.map(pair => pair.amount);

	const addGig = () => {
		setGigs([...gigs, {
			description,
			amount,
			timestamp: new Date()
		}]);

		setDescription("")
		setAmount("")
	}

	const groupBy = (array, key) =>
		array.reduce((rv, x) => {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
		}, {})

	const transformData = groupedData => {
		const transformedArray = [];

		Object.entries(groupedData).forEach(entry => {
			const total = entry[1].reduce((total, pair) => total + pair.amount, 0)
			transformedArray.push({
				date: entry[0],
				amount: total
			})
		})

		const sortedArray = transformedArray.sort((a, b) => moment(a['date']).diff(moment(b['date'])))

		return sortedArray;
	}

	console.log("The Dates: ", getDates());
	console.log("The Amounts: ", getAmounts());
	console.log("Grouped values: ", Object.entries(groupBy(data, 'date')))
	console.log("Total grouped value:", transformData(groupBy(data, 'date')))

	return (
		<SafeAreaView>
			<LineChart 
				data={{
					labels: getDates(),
					datasets: [
						{
							data: getAmounts()
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
