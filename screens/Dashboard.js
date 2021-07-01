import { useEffect, useState, useLayoutEffect } from 'react'
import React from 'react'
import { Dimensions, SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { Button, Input, Text } from 'react-native-elements';
import { LineChart } from 'react-native-chart-kit'
import { auth, db } from '../firebase'
import { Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const Dashboard = ({ navigation }) => {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [total, setTotal] = useState("");
	const [todayTotal, setTodayTotal] = useState(0);
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
			headerRight: () => (
				<View style={{ marginRight: 20 }}>
					<TouchableOpacity onPress={() => navigation.navigate("Gigs")} activeOpacity={0.5}>
						<MaterialIcons name="work-outline" size={24} color="white" />
					</TouchableOpacity>
				</View>
			)
		})
	}, [])

	useLayoutEffect(() => {
		const unsubscribe = db.collection('income').doc(auth.currentUser.displayName).collection('all-income').orderBy('date', 'desc')
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
		transformedData?.map(pair => pair.date === todaysDate() && setTodayTotal(pair.amount))
	}, [transformedData])

	useEffect(() => {
		setTotal(gigs?.reduce((total, gig) => total + Number(gig.amount), 0));
	}, [gigs])

	useEffect(() => {
		setTranformedData(transformData(groupBy(data, 'date')))
	}, [data])

	const signOut = () => auth.signOut().then(() => navigation.replace("Login"))
	const getDates = () => transformedData?.map(pair => pair.date);
	const getAmounts = () => transformedData?.map(pair => pair.amount);

	const todaysDate = () => {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [year, month, day].join('/');
	}

	const addGig = async () => {
		Keyboard.dismiss;

		setGigs([...gigs, {
			description,
			amount,
		}]);

		setData([
			...data,
			{
				date: todaysDate(),
				amount: Number(amount)
			}
		])

		await db.collection('income')
				.doc(auth.currentUser.displayName)
				.collection('all-income')
				.add({
					date: todaysDate(),
					amount: Number(amount),
				})
				.catch(error => alert(error.message))

		await db.collection('gigs')
				.doc(auth.currentUser.displayName)
				.collection('all-gigs')
				.add({
					description,
					amount: Number(amount),
					date: todaysDate(),
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
				date: entry[0],
				amount: total
			})
		})

		return transformedArray.sort((a, b) => new Date(a.date) - new Date(b.date))
	}

	return (
		<SafeAreaView style={{ backgroundColor: '#282828', flex: 1 }}>
			<ScrollView>
				<View style={{ padding: 16 }}>
					{getDates().length != 0 &&
						<View style={styles.chartContainer}>
							<LineChart 
								data={{
									labels: getDates(),
									datasets: [
										{
											data: getAmounts()
										}
									],
									legend: ["Income Timeline"]
								}}
								width={Dimensions.get("window").width > 1200 ? Dimensions.get("window").width - 50 : Dimensions.get("window").width - 30 }
								height={300}
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
										borderRadius: 16,
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
									borderRadius: 16,
								}}
							/>
						</View>
					}

					<View style={styles.totalIncomeContainer}>
						<Text h2 style={{ color: 'white' }}>Total: {total}</Text>
					</View>
					<View style={styles.averageIncomeContainer}>
						<Text h2 style={{ color: '#3594d4' }}>Today: {todayTotal}</Text>
					</View>

					<Text h4 style={styles.newGigTitle}>ADD NEW GIG</Text>
					<Input 
						style={styles.input}
						value={description}
						placeholder="Enter a description"
						onChangeText={text => setDescription(text)}
					/>
					<Input 
						style={styles.input}
						value={amount}
						keyboardType='numeric'
						placeholder="Enter amount"
						onChangeText={text => setAmount(text)}
						onSubmitEditing={addGig}
					/>

					<View style={styles.btnContainer}>
						<Button containerStyle={styles.button} disabled={description == "" || amount == ""} title="Add GIG" onPress={addGig} />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default Dashboard

const styles = StyleSheet.create({
	input: {
		height: 40,
		marginTop: 20,
		color: 'white'
	},

	chartContainer: {
		position: 'relative',
	},

	totalIncomeContainer: {
		display: 'flex',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#2ECC71',
		borderRadius: 16,
		backgroundColor: '#2ECC71',
		paddingTop: 40,
		paddingBottom: 40,
	},

	averageIncomeContainer: {
		marginTop: 10,
		display: 'flex',
		alignItems: 'center',
		borderColor: '#3594d4',
		borderWidth: 1,
		borderRadius: 16,
		paddingTop: 40,
		paddingBottom: 40,
	},

	btnContainer: {
		alignItems: 'center',
		width: '100%',
		marginTop: 10
	},

	button: {
		width: '50%'
	},

	newGigTitle: {
		color: 'white', 
		marginTop: 20, 
		alignItems: 'center',
		display: 'flex',
		color: '#E74C3C',
		fontWeight: 'bold',
		marginLeft: 10
	}
})
