import { useEffect, useState, useLayoutEffect } from 'react'
import React from 'react'
import { Dimensions, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { Button, Input } from 'react-native-elements';
import { LineChart } from 'react-native-chart-kit'
import moment from 'moment'
import { auth, db } from './firebase'
import { Keyboard } from 'react-native';

const Home = ({ navigation }) => {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [total, setTotal] = useState("");
	const [gigs, setGigs] = useState([]);
	const [data, setData] = useState([]);
	const [transformedData, setTranformedData] = useState([]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                        <Avatar
                            rounded
                            source={{
                                uri: auth?.currentUser.photoURL
                            }}
                        />
                    </TouchableOpacity>
                </View>
            ),
		})
	}, [])

	useLayoutEffect(() => {
		const unsubscribe = db.collection('income-data').doc(auth.currentUser.displayName).collection('all-data').orderBy('date', 'desc')
			.onSnapshot(snapshot => (
				setData(
					snapshot.docs.map(doc => ({
						date: doc.data().date,
						amount: doc.data().amount,
					}))
				)
			))

		return unsubscribe;
	}, [])

	useLayoutEffect(() => {
		const unsubscribe = db.collection('gigs').doc(auth.currentUser.displayName).collection('all-gigs').orderBy('date', 'desc')
			.onSnapshot(snapshot => (
				setGigs(
					snapshot.docs.map(doc => ({
						date: doc.data().date,
						amount: doc.data().amount,
						description: doc.data().description,
					}))
				)
			))

		return unsubscribe;
	}, [])

	useEffect(() => {
		setTotal(gigs?.reduce((total, gig) => total + Number(gig.amount), 0));
	}, [gigs])

	useEffect(() => {
		setTranformedData(transformData(groupBy(data, 'date')))
	}, [data])

	const signOut = () => auth.signOut().then(() => navigation.replace("Login"))
	const getDates = () => transformedData?.map(pair => pair.date);
	const getAmounts = () => transformedData?.map(pair => pair.amount);

	const addGig = async () => {
		Keyboard.dismiss;

		setGigs([...gigs, {
			description,
			amount,
		}]);

		setData([
			...data,
			{
				date: moment().format('LL'),
				amount: Number(amount)
			}
		])

		await db.collection('income-data')
				.doc(auth.currentUser.displayName)
				.collection('all-data')
				.add({
					date: moment().format('LL'),
					amount: Number(amount)
				})
				.catch(error => alert(error.message))

		await db.collection('gigs')
				.doc(auth.currentUser.displayName)
				.collection('all-gigs')
				.add({
					description,
					amount: Number(amount),
					date: moment().format('LL'),
				})
				.catch(error => alert(error.message))

		setDescription("")
		setAmount("")
	}

	// stack overflow group by function
	const groupBy = (array, key) =>
		array.length != 0 && array.reduce((rv, x) => {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
		}, {})

	const transformData = groupedData => {
		const transformedArray = [];

		Object.entries(groupedData).forEach(entry => {
			const total = entry[1].reduce((total, pair) => total + pair.amount, 0)
			transformedArray.push({
				date: moment(entry[0]).format('MM/DD'),
				amount: total
			})
		})

		const sortedArray = transformedArray.sort((a, b) => moment(a['date']).diff(moment(b['date'])))

		return sortedArray;
	}

	return (
		<SafeAreaView>
			{data.length != 0 && 
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
					yAxisLabel="Rs. "
					yAxisInterval={1}
					chartConfig={{
						backgroundColor: "#e26a00",
						backgroundGradientFrom: "green",
						backgroundGradientTo: "blue",
						decimalPlaces: null,
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
			}

			<Text>Total Income: {total}</Text>
			<Input 
				style={{
					outline: 'none',
					height: 40,
					marginTop: 20
				}}
				value={description}
				placeholder="Enter a description"
				onChangeText={text => setDescription(text)}
			/>
			<Input 
				style={{
					outline: 'none',
					height: 40,
					marginTop: 20
				}}
				value={amount}
				keyboardType='numeric'
				placeholder="Enter amount"
				onChangeText={text => setAmount(text)}
				onSubmitEditing={addGig}
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

export default Home

const styles = StyleSheet.create({
	input: {
		marginTop: 20,
		height: 40,
		borderColor: 'red',
		borderWidth: 1
	}
})
