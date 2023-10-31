import mongoose from 'mongoose';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import RoundedBoxBtn from './RoundedBoxBtn';
import * as AdminApi from "../network/admin_api";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

interface CategoryTextBoxProps {
    title: string
    deleteCategoryProp: (categoryId: mongoose.Types.ObjectId) => void
    categoryId: mongoose.Types.ObjectId
    handleMessage: (isErrorParam: boolean, isVisibleParam: boolean, message: string) => void
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>,

}
const windowWidth = Dimensions.get('window').width;


const CategoryTextBox = ({ title, handleMessage, categoryId, deleteCategoryProp, navigation }: CategoryTextBoxProps) => {
    async function deleteBusiness(categoryId: mongoose.Types.ObjectId): Promise<void> {
        try {
            console.log('clicked')
            await AdminApi.deleteCategory(categoryId)
            deleteCategoryProp(categoryId)
            handleMessage(false, true, 'Category Deleted successfully')
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
        <View style={styles.container}>
            <View style={styles.roundedBox}>
                <Text style={styles.title}>{title}</Text>
                <RoundedBoxBtn buttonName='Edit' handlePress={() => { navigation.navigate('EditCategory', { name: title, categoryId }); }} />
                <RoundedBoxBtn buttonName='Delete' handlePress={() => { deleteBusiness(categoryId) }} />
            </View>
        </View>
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
});


export default CategoryTextBox;
