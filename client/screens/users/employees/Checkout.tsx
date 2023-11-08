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
interface props {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}
function Checkout({ navigation, route }: props) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [customerOrderObjects, setCustomerOrderObjects] = useState<any>([]);
    const [customerOrdersObjects, setCustomerOrdersObjects] = useState<any>([]);

    const [reciptEmail, setReciptEmail] = useState<string>('')
    const { currentCustomerIndex } = route.params || {};
    const [totalPrice, setTotalPrice] = useState<number>()
    useFocusEffect(
        React.useCallback(() => {
            async function fetchItemsNeeded() {
                try {
                    setIsLoading(true);
                    const fetchedCustomerOrdersObjects = await SecureStore.getItemAsync('customerOrdersObjects')
                    const parsedCustomerOrdersObjects = JSON.parse(fetchedCustomerOrdersObjects as string);
                    if (parsedCustomerOrdersObjects !== null) {
                        setCustomerOrdersObjects(parsedCustomerOrdersObjects)
                        setCustomerOrderObjects(parsedCustomerOrdersObjects[currentCustomerIndex]);
                    }

                    setTotalPrice(() => {
                        let totalSum = 0
                        parsedCustomerOrdersObjects[currentCustomerIndex].map((item: any) => {
                            totalSum += item.qty * item.price
                        })
                        return totalSum
                    })
                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchItemsNeeded()
        }, [])
    )

    async function handleConfirmOrder() {

    }


    async function handleIncrement(_id: mongoose.Types.ObjectId) {
        let updatedCustomerOrderObjects: any;
        setCustomerOrderObjects((prevCustomerOrderObjects: any) => {
            updatedCustomerOrderObjects = prevCustomerOrderObjects.map((orderObject: any) => {
                if (orderObject._id.toString() === _id.toString()) {
                    return { ...orderObject, qty: orderObject.qty + 1 };
                }
                return orderObject;
            });
            return updatedCustomerOrderObjects
        });
        const fetchedCustomerOrdersObjects = await SecureStore.getItemAsync('customerOrdersObjects')
        const parsedCustomerOrdersObjects = JSON.parse(fetchedCustomerOrdersObjects as string);

        let updatedCustomerOrdersObjects = parsedCustomerOrdersObjects.map((item: any, index: number) => {
            if (index == currentCustomerIndex) {
                return updatedCustomerOrderObjects
            }
            return item
        })
        setTotalPrice(() => {
            let totalSum = 0
            updatedCustomerOrderObjects.map((item: any) => {
                console.log(item)
                totalSum += item.qty * item.price
            })
            return totalSum
        })
        setCustomerOrdersObjects(updatedCustomerOrdersObjects);
        await SecureStore.setItemAsync('customerOrdersObjects', JSON.stringify(updatedCustomerOrdersObjects))
    }
    async function handleDecrement(_id: mongoose.Types.ObjectId) {
        let updatedCustomerOrderObjects: any;
        setCustomerOrderObjects((prevCustomerOrderObjects: any) => {
            updatedCustomerOrderObjects = prevCustomerOrderObjects.map((orderObject: any) => {
                if (orderObject._id.toString() === _id.toString() && orderObject.qty > 0) {
                    return { ...orderObject, qty: orderObject.qty - 1 };
                }
                return orderObject;
            });
            updatedCustomerOrderObjects = updatedCustomerOrderObjects.filter((orderObject: any) => orderObject.qty > 0);

            return updatedCustomerOrderObjects
        });
        const fetchedCustomerOrdersObjects = await SecureStore.getItemAsync('customerOrdersObjects')
        const parsedCustomerOrdersObjects = JSON.parse(fetchedCustomerOrdersObjects as string);

        let updatedCustomerOrdersObjects = parsedCustomerOrdersObjects.map((item: any, index: number) => {
            if (index == currentCustomerIndex) {
                return updatedCustomerOrderObjects
            }
            return item
        })
        setTotalPrice(() => {
            let totalSum = 0
            updatedCustomerOrderObjects.map((item: any) => {
                console.log(item)
                totalSum += item.qty * item.price
            })
            return totalSum
        })
        setCustomerOrdersObjects(updatedCustomerOrdersObjects);
        await SecureStore.setItemAsync('customerOrdersObjects', JSON.stringify(updatedCustomerOrdersObjects))
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
            {
                isPromptVisible &&

                <PromptBox
                    placeholder='Customer Email'
                    handleChange={(text) => { setReciptEmail(text) }}
                    onClose={() => {
                        setIsPromptVisible(false)
                    }}
                    onSubmit={handleConfirmOrder}
                />
            }
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.SafeAreaView}>
                <ScrollView>

                    <View style={styles.container}>

                        <TopBar title={'Checkout'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>
                            {customerOrderObjects.map((orderObject: any) => (
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
                            />

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


export default Checkout;