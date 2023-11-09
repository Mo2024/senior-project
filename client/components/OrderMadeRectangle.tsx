import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

interface RectangleProps {
    orderName: string;
    date: Date;
    onPress?: () => void; // Optional onPress callback
}

const OrderMadeRectangle: React.FC<RectangleProps> = ({ date, orderName, onPress }) => {
    // Format the date to display in a readable way
    const formattedDate = new Date(date).toLocaleString();

    return (
        <TouchableOpacity onPress={onPress} style={styles.rectangle}>
            <View style={styles.row}>
                <View style={styles.ordername}>
                    <Text>{orderName}</Text>
                </View>
                <View style={styles.TotalItem}>
                    <Text>{formattedDate}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    rectangle: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        width: '90%',
        paddingVertical: 25,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ordername: {
        flex: 1, // This ensures the orderName takes up all available space
    },
    TotalItem: {
        flex: 1, // This ensures it takes up remaining space
        justifyContent: 'center', // Center content vertically
        alignItems: 'flex-end', // Align content to the right
    },
});

export default OrderMadeRectangle;
