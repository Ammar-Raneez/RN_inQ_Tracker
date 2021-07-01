import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Gig = ({ date, description, amount}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.description}>{description.toUpperCase()}</Text>

            <View style={styles.innerRightContainer}>
                <Text style={styles.amount}>Rs. {amount}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
        </View>
    )
}

export default Gig

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 16,
        borderRadius: 10,
        marginBottom: 20
    },

    innerRightContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end'
    },

    description: {
        color: '#3594d4',
        fontWeight: 'bold',
        fontSize: 18
    },

    amount: {
        marginRight: 20,
        color: '#2ecc71',
        fontWeight: 'bold',
        fontSize: 18
    },

    date: {
        color: '#a2b6dc',
        fontSize: 18,
    }
})
