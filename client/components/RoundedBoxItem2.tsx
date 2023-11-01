import mongoose from 'mongoose';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';

function RoundedBoxItem2({ text, quantity, itemId }: { text: string, quantity: number, itemId: mongoose.Types.ObjectId }) {
    return (
        <View style={styles.roundedBox}>
            <Text style={styles.boxText}>{text}</Text>
            <Text style={styles.quantityText}>Quantity: {quantity}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Add" onPress={() => { }} color="#72063c" />
                <Button title="Edit" onPress={() => { }} color="#72063c" />
                <Button title="Delete" onPress={() => { }} color="#72063c" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    roundedBox: {
        backgroundColor: '#72063c',
        borderRadius: 20,
        padding: 20,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
    },
    boxText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
    },
    quantityText: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default RoundedBoxItem2;
