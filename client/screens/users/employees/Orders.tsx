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
import { Businesses, Employee, newAdmin, newEmployee } from '../../../models/user';
import SelectDropdownIndex from '../../../components/SelectDropdownIndex';
import mongoose from 'mongoose';
import SelectDropdownComponent from '../../../components/SelectDropdownComponent';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-bootstrap';
import PromptBox from '../../../components/PromptBox';
import * as SecureStore from 'expo-secure-store';


interface ManageEmployeeProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function Orders({ navigation }: ManageEmployeeProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [customerOrdersNames, setCustomerOrdersNames] = useState<any>([]);
    const [customerOrdersObjects, setCustomerOrdersObjects] = useState<any>([]);
    const [currentCustomerOrder, setCurrentCustomerOrder] = useState('Select An Order');
    const [currentCustomerIndex, setCurrentCustomerIndex] = useState<number>();

    const [createOrders, setCreateOrders] = useState(true)
    const [viewOrders, setViewOrders] = useState(false)
    const [newOrderName, setNewOrderName] = useState<string>('')
    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);
                    const fetchedCustomerOrdersNames = await SecureStore.getItemAsync('customerOrdersNames')
                    const fetchedCustomerOrdersObjects = await SecureStore.getItemAsync('customerOrdersObjects')
                    const parsedCustomerOrdersNames = JSON.parse(fetchedCustomerOrdersNames as string);
                    const parsedCustomerOrdersObjects = JSON.parse(fetchedCustomerOrdersObjects as string);

                    if (parsedCustomerOrdersNames !== null) {
                        setCustomerOrdersNames(parsedCustomerOrdersNames);
                    }

                    if (parsedCustomerOrdersObjects !== null) {
                        setCustomerOrdersObjects(parsedCustomerOrdersObjects);
                    }

                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchLoggedInUserInfo()
        }, [])
    )



    async function onSubmit() {
        try {
            setIsError(false)
            setIsMessageVisible(true)
            setMessage(`Created Successfully`)
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

    function handleCurrentCustomerChange(index: any) {
        setCurrentCustomerIndex(index)
    }

    async function handleAddIconPress() {
        let newCustomerOrdersNames = await SecureStore.setItemAsync('customerOrdersNames', JSON.stringify([...customerOrdersNames, newOrderName]));
        let newCustomerOrdersObjects = await SecureStore.setItemAsync('customerOrdersObjects', JSON.stringify([...customerOrdersObjects, []]));

        setCustomerOrdersNames(newCustomerOrdersNames);
        setCustomerOrdersObjects(newCustomerOrdersObjects);
        setIsPromptVisible(false)

    }
    async function handleDeleteIconPress() {
        const fetchedCustomerOrdersNames = await SecureStore.getItemAsync('customerOrdersNames')
        const fetchedCustomerOrdersObjects = await SecureStore.getItemAsync('customerOrdersObjects')
        let parsedCustomerOrdersNames = JSON.parse(fetchedCustomerOrdersNames as string);
        let parsedCustomerOrdersObjects = JSON.parse(fetchedCustomerOrdersObjects as string);
        // Assuming currentCustomerIndex is the index you want to remove
        parsedCustomerOrdersNames = parsedCustomerOrdersNames.filter((element: any, index: any) => index !== currentCustomerIndex);
        parsedCustomerOrdersObjects = parsedCustomerOrdersObjects.filter((element: any, index: any) => index !== currentCustomerIndex);
        await SecureStore.setItemAsync('customerOrdersNames', JSON.stringify(parsedCustomerOrdersNames));
        await SecureStore.setItemAsync('customerOrdersObjects', JSON.stringify(parsedCustomerOrdersObjects));
        setCustomerOrdersNames(parsedCustomerOrdersNames)
        setCustomerOrdersObjects(parsedCustomerOrdersObjects)
        setCurrentCustomerOrder('Select An Order')
        setCurrentCustomerIndex(-1)
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
                    placeholder='Order Name'
                    handleChange={(text) => { setNewOrderName(text) }}
                    onClose={() => {
                        setIsPromptVisible(false)
                    }}
                    onSubmit={handleAddIconPress}
                />
            }
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.SafeAreaView}>
                <ScrollView>

                    <View style={styles.container}>

                        <TopBar title={'Orders'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={false} />
                        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            <TopBarBtn
                                buttonName='Create Orders'
                                handlePress={() => {
                                    setViewOrders(prevState => false);
                                    setCreateOrders(prevState => true);
                                }}
                                isActive={createOrders}
                            />
                            <View style={{ marginRight: 10 }} />
                            <TopBarBtn
                                buttonName='View Orders'
                                handlePress={() => {
                                    setCreateOrders(prevState => false);
                                    setViewOrders(prevState => true);
                                }}
                                isActive={viewOrders}
                            />
                        </View>
                        <View style={styles.formBox}>

                            <View style={styles.iconRow}>
                                <TouchableOpacity onPress={() => { setIsPromptVisible(true) }}>
                                    <Ionicons name="ios-add-circle" color={'#72063c'} size={30} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDeleteIconPress}>
                                    <Ionicons name="ios-trash" color={'#72063c'} size={30} style={styles.icon} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { }}>
                                    <Ionicons name="ios-cart" color={'#72063c'} size={30} />
                                </TouchableOpacity>
                            </View>
                            <SelectDropdownIndex
                                options={customerOrdersNames}
                                selectedOption={currentCustomerOrder}
                                handleOptionChange={handleCurrentCustomerChange}
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


});


export default Orders;