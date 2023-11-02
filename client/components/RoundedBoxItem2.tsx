import mongoose from 'mongoose';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import * as EmployeeApi from '../network/employee_api'

interface RoundedBox2 {
    text: string,
    quantity: number,
    itemId: mongoose.Types.ObjectId,
    deleteProp: (itemId: mongoose.Types.ObjectId) => void
    handleMessage: (isErrorParam: boolean, isVisibleParam: boolean, message: string) => void
}
function RoundedBoxItem2({ text, quantity, itemId, deleteProp, handleMessage }: RoundedBox2) {

    async function deleteItemInCategory() {
        try {
            await EmployeeApi.deleteItemInBranch(itemId)
            deleteProp(itemId)
            handleMessage(false, true, 'Item Deleted successfully')
            // setIsError(false)
            // setIsMessageVisible(true)
            // setMessage('Business Deleted successfully')
        } catch (error) {
            // setIsError(true)
            let errorMessage = ''
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            // setMessage(errorMessage)
            // setIsMessageVisible(true)
            console.log(error)
            handleMessage(true, true, errorMessage)


        }
    }
    return (
        <View style={styles.roundedBox}>
            <Text style={styles.boxText}>{text}</Text>
            <Text style={styles.quantityText}>Quantity: {quantity}</Text>
            <View style={styles.buttonContainer}>
                {/* <Button title="Edit" onPress={() => { }} color="#72063c" /> */}
                {/* <Button title="Delete" onPress={() => { }} color="#72063c" /> */}
                <View style={[styles.btn, { borderColor: '#fff', borderWidth: 1, borderRadius: 5 }]}>
                    <Button title="Edit" onPress={() => { /* handle edit */ }} color="#72063c" />
                </View>
                <View style={[styles.btn, { borderColor: '#fff', borderWidth: 1, borderRadius: 5 }]}>
                    <Button title="Delete" onPress={deleteItemInCategory} color="#72063c" />
                </View>


            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    roundedBox: {
        backgroundColor: '#72063c',
        borderRadius: 20,
        padding: 20,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
    },
    btn: {

    },
    boxText: {
        color: 'white',
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
