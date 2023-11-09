import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, ScrollView } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton';
import SubmitButton from '../../../components/SubmitButton';
import { logout } from '../../../network/user_api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native';
import TopBar from '../../../components/TopBar';
import MessageBox from '../../../components/MessageBox';
import Field from '../../../components/Field';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import TopBarBtn from '../../../components/TopBarBtn';
import * as OwnerApi from "../../../network/owner_api";
import { Businesses, Category, Employee, newAdmin, newEmployee } from '../../../models/user';
import SelectDropdownIndex from '../../../components/SelectDropdownIndex';
import mongoose from 'mongoose';
import SelectDropdownComponent from '../../../components/SelectDropdownComponent';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-bootstrap';
import PromptBox from '../../../components/PromptBox';
import * as SecureStore from 'expo-secure-store';
import RoundedBox from '../../../components/RoundedBox';
import * as EmployeeApi from '../../../network/employee_api'
import Rectangle from '../../../components/Rectangle';
import AppLoader from '../../../components/AppLoader';
interface props {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}
function ViewOrderDetails({ navigation, route }: props) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [message, setMessage] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const { order } = route.params || {};
    const [totalPrice, setTotalPrice] = useState<number>()
    useFocusEffect(
        React.useCallback(() => {
            async function fetchItemsNeeded() {
                try {
                    setIsLoading(true);

                    setTotalPrice(() => {
                        let totalSum = 0
                        order.items.map((item: any) => {
                            totalSum += item.qty * item.price

                        })

                        return totalSum
                    })
                    // console.log(totalPrice)
                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchItemsNeeded()
        }, [])
    )


    if (isLoading) {
        return (
            <>
                <AppLoader />
            </>
        );

    }

    return (
        <>
            {
                isMessageVisible &&

                <MessageBox
                    type={isError}
                    message={message}
                    onClose={() => {
                        setIsMessageVisible(false)
                    }}

                />
            }
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.SafeAreaView}>
                <ScrollView>

                    <View style={styles.container}>

                        <TopBar title={'Checkout'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>
                            {/* {customerOrderObjects.map((orderObject: any) => (
                                <Rectangle
                                    key={orderObject._id}
                                    orderName={orderObject.name}
                                    quantity={orderObject.qty}
                                    onIncrement={() => handleIncrement(orderObject._id)}
                                    onDecrement={() => handleDecrement(orderObject._id)}
                                    price={orderObject.price}
                                />
                            ))}
                            <Text style={styles.totalPriceText}>
                                Total: ${totalPrice ? totalPrice.toFixed(2) : '0.00'}
                            </Text>
                            <SubmitButton
                                buttonName='Place Order'
                                handlePress={() => { setIsPromptVisible(true) }}
                            /> */}

                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    SafeAreaView: {
        flex: 1,
    },
    formBox: {
        // backgroundColor: "#72063c",
        flex: 9,
        width: "100%",
        borderTopRightRadius: 150,
        alignItems: 'center',
        // height: 2000,
        height: '100%',
        // paddingBottom: '100%'

    },
    formBoxTitle: {
        marginTop: 50,
        fontSize: 35,
        color: "#72063c",
        fontWeight: 'bold',
        textAlign: 'center',
    },
    submitBtn: {
        marginTop: 100
    },
    Label: {
        color: '#72063c',
        fontWeight: 'bold'

    },
    labelView: {
        width: '75%'
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    icon: {
        marginRight: 30,
        marginLeft: 30,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rectangle: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
    },
    totalPriceText: {
        fontWeight: 'bold',
        fontSize: 18, // Adjust the font size as needed
        marginTop: 10, // Adjust the margin as needed
    },

});


export default ViewOrderDetails;