import React, { useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements'
import Gig from '../components/Gig'
import { db, auth } from '../firebase'

const Gigs = ({ navigation }) => {
    const [gigs, setGigs] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: { marginLeft: -20 },
        })
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

    console.log(gigs);

    return (
        <SafeAreaView style={{ backgroundColor: '#282828', flex: 1 }}>
            <View style={{ padding: 16 }}>
                <Text h4 style={styles.title}>ALL GIGS</Text>

                <ScrollView>
                    {
                        gigs.map((gig, index) => <Gig key={index} description={gig.description} date={gig.date} amount={gig.amount} />)
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Gigs

const styles = StyleSheet.create({
    title: {
        color: 'white', 
		marginTop: 20, 
        marginBottom: 20,
		alignItems: 'center',
		display: 'flex',
		color: '#E74C3C',
		fontWeight: 'bold',
    }
})
