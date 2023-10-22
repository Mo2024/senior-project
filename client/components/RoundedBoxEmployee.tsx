import mongoose from 'mongoose';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import RoundedBoxBtn from './RoundedBoxBtn';
import * as OwnerApi from "../network/owner_api";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface RoundedBoxBranch {
    name: string
    employeeId: mongoose.Types.ObjectId
    navigation: NativeStackNavigationProp<any>
    deleteEmployee: (employeeId: mongoose.Types.ObjectId) => void
    route: RouteProp<any>,
    handleMessage: (isErrorParam: boolean, isVisibleParam: boolean, message: string) => void


}
const windowWidth = Dimensions.get('window').width;


const RoundedBoxEmployee = ({ employeeId, deleteEmployee, name, handleMessage }: RoundedBoxBranch) => {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    async function deleteBranch(employeeId: mongoose.Types.ObjectId): Promise<void> {
        try {
            console.log('clicked')
            await OwnerApi.deleteEmployee(employeeId)
            deleteEmployee(employeeId)
            handleMessage(false, true, 'Business Deleted successfully')
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
                <Text style={styles.title}>{name}</Text>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => deleteBranch(employeeId)}>
                    <Ionicons name="trash" color={'white'} size={25} />
                </TouchableOpacity>
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


export default RoundedBoxEmployee;
