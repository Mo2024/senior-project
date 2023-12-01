import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, ScrollView, Alert, TextInput } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SubmitButton from '../components/SubmitButton';
import { logout } from '../network/user_api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import MessageBox from '../components/MessageBox';
import Field from '../components/Field';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import TopBarBtn from '../components/TopBarBtn';
import * as OwnerApi from "../network/owner_api";
import { Businesses, Category, Employee, newAdmin, newEmployee } from '../models/user';
import SelectDropdownIndex from '../components/SelectDropdownIndex';
import mongoose from 'mongoose';
import SelectDropdownComponent from '../components/SelectDropdownComponent';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import PromptBox from '../components/PromptBox';
import * as SecureStore from 'expo-secure-store';
import RoundedBox from '../components/RoundedBox';
import * as EmployeeApi from '../network/employee_api'
import Rectangle from '../components/Rectangle';
import AppLoader from '../components/AppLoader';
import { v4 } from 'uuid';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';
import { StripeProvider } from '@stripe/stripe-react-native';
import { API_URL, secret_key, pk } from '@env';
import { CardField, useStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import { Button } from 'react-bootstrap';

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
    const [customerOrderName, setCustomerOrderName] = useState<any>();
    const [isPaying, setIsPaying] = useState(false); // New state

    const [email, setEmail] = useState<string>('');
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [hasPerms, setHasPerms] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [fetchedItemsWithoutCat, setFetchedItemsWithoutCat] = useState<any[]>([])
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expirationDate: '',
        cvv: '',
    })
    let playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/barcode.mp3')
        );
        await sound.playAsync();
    };



    useFocusEffect(
        React.useCallback(() => {
            async function fetchItemsNeeded() {
                try {
                    setIsLoading(true);

                    setCustomerOrderName(v4());
                    const fetchedItemsWithoutCat = await EmployeeApi.getItemsWithoutCategory()
                    setFetchedItemsWithoutCat(fetchedItemsWithoutCat)
                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchItemsNeeded()
        }, [])
    )

    async function handleConfirmOrder() {
        try {

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const cardNumberRegex = /^[0-9]{16}$/;
            const expirationDateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
            const cvvRegex = /^[0-9]{3}$/;

            if (!emailRegex.test(email)) {
                setIsLoading(false);
                setIsError(true)
                setIsMessageVisible(true)
                setMessage(`Invalid Email`)
            } else if (!cardNumberRegex.test(cardDetails.number)) {
                setIsLoading(false);
                setIsError(true)
                setIsMessageVisible(true)
                setMessage(`Invalid Card Number`)
            } else if (!expirationDateRegex.test(cardDetails.expirationDate)) {
                setIsLoading(false);
                setIsError(true)
                setIsMessageVisible(true)
                setMessage(`Invalid Expiration Date`)
            } else if (!cvvRegex.test(cardDetails.cvv)) {
                setIsLoading(false);
                setIsError(true)
                setIsMessageVisible(true)
                setMessage(`Invalid CVV`)
            } else {
                console.log('All inputs are valid');
                await EmployeeApi.makeOrder({ email: email, order: customerOrderObjects, name: customerOrderName });
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'SelfCheckout' }],
                    })
                );
            }
        } catch (error) {
            setIsError(true)
            let errorMessage = ''
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setMessage(errorMessage)
            setIsMessageVisible(true)

        }
    }


    async function handleIncrement(_id: mongoose.Types.ObjectId) {
        let updatedCustomerOrderObjects: any;
        const foundItem = fetchedItemsWithoutCat.find(item => item.itemId._id == _id);
        let isError = false
        setCustomerOrderObjects((prevCustomerOrderObjects: any) => {
            updatedCustomerOrderObjects = prevCustomerOrderObjects.map((orderObject: any) => {
                if (orderObject._id.toString() === _id.toString()) {
                    if (foundItem.quantity <= orderObject.qty) {
                        isError = true
                        setIsLoading(false);
                        setIsError(true)
                        setIsMessageVisible(true)
                        setMessage(`Only ${foundItem.quantity} quantity is available for this item`)
                        return { ...orderObject, qty: foundItem.quantity };
                    } else {
                        return { ...orderObject, qty: orderObject.qty + 1 };
                    }
                }
                return orderObject;
            });
            return updatedCustomerOrderObjects
        });

        if (!isError) {
            setTotalPrice(() => {
                let totalSum = 0
                updatedCustomerOrderObjects.map((item: any) => {
                    // console.log(item)
                    totalSum += item.qty * item.price
                })
                return totalSum
            })
        }

    }
    async function handleBarCodeScanned({ data }: any) {
        setIsLoading(true)
        // console.log(fetchedCategories)
        // const foundItem = fetchedI.find(item => item.barcode == data);
        const foundItem = fetchedItemsWithoutCat.find(item => item.barcode == data);

        if (foundItem) {
            const existingItemIndex = customerOrderObjects.findIndex((item: any) => item._id === foundItem.itemId._id);

            if (existingItemIndex !== -1) {
                if (foundItem.quantity <= customerOrderObjects[existingItemIndex].qty) {
                    setIsLoading(false);
                    setIsError(true)
                    setIsMessageVisible(true)
                    setMessage(`Only ${foundItem.quantity} quantity is available for this item`)
                    return
                } else {
                    customerOrderObjects[existingItemIndex].qty++;
                }

            } else {
                const newItem = { name: foundItem.itemId.name, _id: foundItem.itemId._id, qty: 1, price: foundItem.itemId.price };
                customerOrderObjects.push(newItem);
            }
            // console.log(foundItem)
            setTotalPrice(() => {
                let totalSum = 0
                customerOrderObjects.map((item: any) => {
                    totalSum += item.qty * item.price
                })
                return totalSum
            })
            playSound()
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        } else {
            setIsLoading(false);
            setIsError(true)
            setIsMessageVisible(true)
            setMessage(`Item not available in branch!`)
        }

    }

    function goBackBtn() {
        setIsScanning(false)
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

        setTotalPrice(() => {
            let totalSum = 0
            updatedCustomerOrderObjects.map((item: any) => {
                console.log(item)
                totalSum += item.qty * item.price
            })
            return totalSum
        })

    }

    async function handleScanPress() {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPerms(status === 'granted')
        setIsScanning(status === 'granted')
    }

    if (isLoading) {
        return (
            <>
                <AppLoader />
            </>
        );

    }

    if (isScanning) {
        return (
            <>

                <StatusBar hidden={true} />
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
                <View style={styles.topContainer}>
                    <FontAwesome.Button
                        name='arrow-left'
                        backgroundColor={'rgba(0, 0, 0, 0)'}
                        color="rgb(0,0,0)"
                        onPress={goBackBtn}
                        size={32}
                        style={styles.topLeftContainer}
                        underlayColor='transparent'
                    />
                    <Text style={[styles.loginTitle, styles.visibleRight]}>Go back</Text>

                </View>
                <View style={styles2.conatiner2}>
                    <BarCodeScanner
                        style={StyleSheet.absoluteFillObject}
                        onBarCodeScanned={handleBarCodeScanned}
                    />
                </View>
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
            {
                isPromptVisible &&

                <PromptBox
                    placeholder='Customer Email'
                    handleChange={(text) => { setEmail(text) }}
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

                        <TopBar title={'Self Checkout'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={false} />
                        <View style={styles.formBox}>
                            {isPaying && (
                                <>
                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Email</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setEmail(updatedCredential);
                                        }}
                                        placeholder={'Email'}
                                    />

                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Card Number</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setCardDetails({ ...cardDetails, number: updatedCredential });
                                        }}
                                        placeholder={'Card Number'}
                                    />

                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Expiration Date</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setCardDetails({ ...cardDetails, expirationDate: updatedCredential });
                                        }}
                                        placeholder={'Expiration Date'}
                                    />

                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>CVV</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setCardDetails({ ...cardDetails, cvv: updatedCredential });
                                        }}
                                        placeholder={'CVV'}
                                    />
                                    <SubmitButton
                                        buttonName='Submit Payment'
                                        handlePress={handleConfirmOrder}
                                    />
                                    <SubmitButton
                                        buttonName='Cancel'
                                        handlePress={() => { setIsPaying(false) }}
                                    />
                                </>
                            )

                            }
                            {!isPaying && (
                                <>
                                    <TouchableOpacity onPress={handleScanPress}>
                                        <Ionicons name="ios-barcode" color={'#72063c'} style={styles.icon} size={30} />
                                    </TouchableOpacity>
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
                                        handlePress={() => {
                                            if (totalPrice == 0) {
                                                setIsError(true)
                                                setIsMessageVisible(true)
                                                setMessage(`Cart is Empty`)

                                            } else {
                                                setIsPaying(true)
                                            }
                                        }}
                                    />
                                </>
                            )
                            }


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
    topContainer: {
        // marginTop: '10%',
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'black'
    },
    topLeftContainer: {
        position: 'relative',
        left: 0,
    },
    loginTitle: {
        color: "#72063c",
        fontSize: 40,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    visibleRight: {
        right: 25

    },

});
const styles2 = StyleSheet.create({
    conatiner2: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});



export default Checkout;