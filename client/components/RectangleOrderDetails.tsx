import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

interface RectangleProps {
    orderName: string;
    quantity: number;
    price: number;
}

const RectangleOrderDetails: React.FC<RectangleProps> = ({ price, orderName, quantity }) => {
    const totalCost = (quantity * price).toFixed(2);

    return (
        <View style={styles.rectangle}>
            <View style={styles.row}>
                <Text style={styles.ordername}>{orderName}</Text>
                <View style={styles.buttonContainer}>
                    <Text style={styles.button}>Quantity: {quantity}</Text>
                    <Text style={styles.button}>Price: ${totalCost}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    rectangle: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        width: '85%',
        paddingVertical: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ordername: {
        flex: 1, // This ensures the orderName takes up all available space
    },
    buttonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        marginHorizontal: 5, // Adjust the margin as needed
    },
    TotalItem: {
        flex: 1, // This ensures it takes up remaining space
        justifyContent: 'center', // Center content vertically
        alignItems: 'flex-end', // Align content to the right
    },
});

export default RectangleOrderDetails;
