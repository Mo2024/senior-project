import mongoose from 'mongoose';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import RoundedBoxBtn from './RoundedBoxBtn';
import * as AdminApi from "../network/admin_api";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface RoundedBoxItem {
    name: string
    itemId: mongoose.Types.ObjectId
    navigation: NativeStackNavigationProp<any>
    deleteItem: (itemId: mongoose.Types.ObjectId) => void
    route: RouteProp<any>,
    description: string,
    price: string,
    categoryId: mongoose.Types.ObjectId
    handleMessage: (isErrorParam: boolean, isVisibleParam: boolean, message: string) => void
    barcode: string


}
const windowWidth = Dimensions.get('window').width;


const RoundedBoxItem = ({ categoryId, price, description, navigation, itemId, deleteItem: deleteItem, name, handleMessage, barcode }: RoundedBoxItem) => {
    async function deleteBranch(itemId: mongoose.Types.ObjectId): Promise<void> {
        try {
            console.log('clicked')
            await AdminApi.deleteItem(itemId)
            deleteItem(itemId)
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
        <TouchableOpacity onPress={() => { navigation.navigate('EditItem', { itemId, name, price, description, categoryId, barcode }) }}>

            <View style={styles.container}>
                <View style={styles.roundedBox}>
                    <Text style={styles.title}>{name}</Text>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => deleteBranch(itemId)}>
                        <Ionicons name="trash" color={'white'} size={25} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    roundedBox: {
        backgroundColor: '#955375', // Change the color as needed
        borderRadius: 10,
        padding: 20,
        width: windowWidth * 0.8,
        borderColor: '#72063c',
        borderWidth: 2,
        position: 'relative', // Add this line
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff', // Change the color as needed
    },
    subtitle: {
        fontSize: 16,
        color: '#fff', // Change the color as needed
        marginTop: 10,
        // marginBottom: '2.5%'
    },
    // iconButton: {
    //     position: 'absolute', // Add this line
    //     top: 20, // Adjust top and right values as needed
    //     right: 20,
    //     borderWidth: 1,
    //     borderRadius: 5,
    //     width: 30,
    //     height: 30,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     borderColor: 'white'
    // },
    iconButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        borderWidth: 1,
        borderRadius: 5,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
    },
});


export default RoundedBoxItem;
