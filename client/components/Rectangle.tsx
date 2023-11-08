import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

interface RectangleProps {
    orderName: string;
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    price: number
}

const Rectangle: React.FC<RectangleProps> = ({ price, orderName, quantity, onIncrement, onDecrement }) => {
    const totalCost = quantity * price;

    return (
        <View style={styles.rectangle}>
            <View style={styles.row}>
                <View style={styles.ordername}>
                    <Text>{orderName}</Text>
                </View>
                <View style={styles.TotalItem}>
                    {/* Display total cost */}
                    <Text>{`$${totalCost.toFixed(2)}`}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={onDecrement}>
                        <Ionicons name="remove" size={20} />
                    </TouchableOpacity>
                    <Text>{` ${quantity} `}</Text>
                    <TouchableOpacity style={styles.button} onPress={onIncrement}>
                        <Ionicons name="add" size={20} />
                    </TouchableOpacity>
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
        width: '100%',
        paddingVertical: 25
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ordername: {
        flex: 1, // This ensures the orderName takes up all available space
    },
    buttonContainer: {
        flexDirection: 'row',
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

export default Rectangle;
