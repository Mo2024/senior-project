import mongoose from 'mongoose';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import RoundedBoxBtn from './RoundedBoxBtn';
import * as OwnerApi from "../network/owner_api";

interface RoundedBoxWithTextProps {
    title: string
    subtitle: string
    deleteBusinessProp: (businessId: mongoose.Types.ObjectId) => void
    businessId: mongoose.Types.ObjectId
    handleMessage: (isErrorParam: boolean, isVisibleParam: boolean, message: string) => void
}
const windowWidth = Dimensions.get('window').width;


const RoundedBoxWithText = ({ title, handleMessage, subtitle, businessId, deleteBusinessProp }: RoundedBoxWithTextProps) => {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    async function deleteBusiness(businessId: mongoose.Types.ObjectId): Promise<void> {
        try {
            console.log('clicked')
            await OwnerApi.deleteBusiness(businessId)
            deleteBusinessProp(businessId)
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
                {/* <TouchableOpacity hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                    onPress={deleteBusiness} style={styles.iconButton}>
                    <FontAwesome name="trash" size={24} color="#fff" />
                </TouchableOpacity> */}
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <RoundedBoxBtn buttonName='Delete' handlePress={() => { deleteBusiness(businessId) }} />
                {/* <RoundedBoxBtn buttonName='Edit' handlePress={() => { }} /> */}
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


export default RoundedBoxWithText;
