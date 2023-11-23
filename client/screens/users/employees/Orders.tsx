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
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-bootstrap';
import PromptBox from '../../../components/PromptBox';
import * as SecureStore from 'expo-secure-store';
import RoundedBox from '../../../components/RoundedBox';
import * as EmployeeApi from '../../../network/employee_api'
import AppLoader from '../../../components/AppLoader';
import Rectangle from '../../../components/Rectangle';
import OrderMadeRectangle from '../../../components/OrderMadeRectangle';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { v4 } from 'uuid';
import { Audio } from 'expo-av';
import { throttle } from 'lodash';
import { DeviceEventEmitter } from 'react-native';
import KeyEvent from 'react-native-keyevent';

interface ManageEmployeeProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function Orders({ navigation, route }: ManageEmployeeProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedCategories, setFetchedCategories] = useState<Category[]>([])

    const [customerOrdersNames, setCustomerOrdersNames] = useState<any>([]);
    const [customerOrdersObjects, setCustomerOrdersObjects] = useState<any>([]);
    const [currentCustomerOrder, setCurrentCustomerOrder] = useState('Select An Order');
    const [currentCustomerIndex, setCurrentCustomerIndex] = useState<number>(-1);
    const [hasPerms, setHasPerms] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [createOrders, setCreateOrders] = useState(true)
    const [viewOrders, setViewOrders] = useState(false)
    const [newOrderName, setNewOrderName] = useState<string>('')
    const [fetchedOrders, setFetchedOrders] = useState<any>()
    const [fetchedItemsWithoutCat, setFetchedItemsWithoutCat] = useState<any[]>([])
    const { isReroute } = route.params || {}
    let playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../../../assets/barcode.mp3')
        );
        await sound.playAsync();
    };

    useEffect(() => {
        async function fetchItemsNeeded() {
            try {
                setIsLoading(true);
                setCurrentCustomerIndex(-1)
                setCurrentCustomerOrder('Select an order')
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


                const fetchedCategories = await EmployeeApi.getCategories() as Category[]
                setFetchedCategories(fetchedCategories)

                const fetchedOrders = await EmployeeApi.getOrdersInBranch() as Businesses
                setFetchedOrders(fetchedOrders)

                const fetchedItemsWithoutCat = await EmployeeApi.getItemsWithoutCategory()
                setFetchedItemsWithoutCat(fetchedItemsWithoutCat)



                setIsLoading(false);

            } catch (error) {
                console.log(error)
            }
        }
        fetchItemsNeeded()
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            // Your code here will run when the screen gains focus
            async function fetchItemsNeeded() {
                // if (isReroute === true) {
                // }
                // Fetch data or perform tasks here
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

            }
            fetchItemsNeeded();
        }, [])
    );
    function handleCurrentCustomerChange(index: any) {
        setCurrentCustomerIndex(index)
        setCurrentCustomerOrder(customerOrdersNames[index])
    }

    async function handleAddIconPress() {
        await SecureStore.setItemAsync('customerOrdersNames', JSON.stringify([...customerOrdersNames, newOrderName]));
        await SecureStore.setItemAsync('customerOrdersObjects', JSON.stringify([...customerOrdersObjects, []]));

        setCustomerOrdersNames([...customerOrdersNames, newOrderName]);
        setCustomerOrdersObjects([...customerOrdersObjects, []]);
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

    async function handleScanPress() {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPerms(status === 'granted')
        setIsScanning(status === 'granted')
        if (status === 'granted') {
            if (currentCustomerIndex == -1) {
                const newUUID: string = v4();
                const index = customerOrdersNames.length
                await SecureStore.setItemAsync('customerOrdersNames', JSON.stringify([...customerOrdersNames, newUUID]));
                await SecureStore.setItemAsync('customerOrdersObjects', JSON.stringify([...customerOrdersObjects, []]));

                setCustomerOrdersNames([...customerOrdersNames, newUUID]);
                setCustomerOrdersObjects([...customerOrdersObjects, []]);
                setCurrentCustomerIndex(index)
                setCurrentCustomerOrder(newUUID)
            }
        }
    }
    async function handleBarCodeScanned({ data }: any) {
        setIsLoading(true)
        // console.log(fetchedCategories)
        // const foundItem = fetchedI.find(item => item.barcode == data);
        const foundItem = fetchedItemsWithoutCat.find(item => item.barcode == data);

        if (foundItem) {
            const fetchedCustomerOrdersObjects = await SecureStore.getItemAsync('customerOrdersObjects')
            const parsedCustomerOrdersObjects = JSON.parse(fetchedCustomerOrdersObjects as string);
            const existingItemIndex = parsedCustomerOrdersObjects[currentCustomerIndex].findIndex((item: any) => item._id === foundItem.itemId._id);

            if (existingItemIndex !== -1) {
                parsedCustomerOrdersObjects[currentCustomerIndex][existingItemIndex].qty++;

            } else {
                const newItem = { name: foundItem.itemId.name, _id: foundItem.itemId._id, qty: 1, price: foundItem.itemId.price };
                parsedCustomerOrdersObjects[currentCustomerIndex].push(newItem);
            }
            // console.log(foundItem)
            await SecureStore.setItemAsync('customerOrdersObjects', JSON.stringify(parsedCustomerOrdersObjects));
            setCustomerOrdersObjects(parsedCustomerOrdersObjects)
            console.log(parsedCustomerOrdersObjects)
            console.log(parsedCustomerOrdersObjects[currentCustomerIndex])

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
        console.log(currentCustomerOrder)
        console.log(currentCustomerIndex)
        setIsScanning(false)
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

                            {createOrders &&
                                <>
                                    <View style={styles.iconRow}>
                                        <TouchableOpacity onPress={() => { setIsPromptVisible(true) }}>
                                            <Ionicons name="ios-add-circle" color={'#72063c'} size={30} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleDeleteIconPress}>
                                            <Ionicons name="ios-trash" color={'#72063c'} size={30} style={styles.icon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            if (currentCustomerIndex == -1) {

                                            } else { navigation.navigate('Checkout', { currentCustomerIndex }) }
                                        }
                                        }>
                                            <Ionicons name="ios-cart" color={'#72063c'} size={30} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleScanPress}>
                                            <Ionicons name="ios-barcode" color={'#72063c'} style={styles.icon} size={30} />
                                        </TouchableOpacity>
                                    </View>
                                    <SelectDropdownIndex
                                        options={customerOrdersNames}
                                        selectedOption={currentCustomerOrder}
                                        handleOptionChange={handleCurrentCustomerChange}
                                    />

                                    {(() => {
                                        const rowBoxes = [];

                                        for (let i = 0; i < fetchedCategories.length; i += 2) {
                                            const category = fetchedCategories[i];
                                            const category2 = fetchedCategories[i + 1];

                                            rowBoxes.push(
                                                <View style={styles.row} key={i}>
                                                    <RoundedBox
                                                        text={category.name}
                                                        onPress={() => {
                                                            if (currentCustomerIndex == -1) {
                                                                setIsError(true)
                                                                setIsMessageVisible(true)
                                                                setMessage(`Please select an order!`)
                                                            } else {
                                                                navigation.navigate('ItemsInCategories', { categoryId: category._id, isOrder: true, currentCustomerIndex })
                                                            }
                                                        }}
                                                    />

                                                    {category2 && (
                                                        <RoundedBox
                                                            text={category2.name}
                                                            onPress={() => {
                                                                if (currentCustomerIndex == -1) {
                                                                    setIsError(true)
                                                                    setIsMessageVisible(true)
                                                                    setMessage(`Please select an order!`)
                                                                } else {
                                                                    navigation.navigate('ItemsInCategories', { categoryId: category2._id, isOrder: true, currentCustomerIndex })
                                                                }
                                                            }}
                                                        />)
                                                    }
                                                </View>
                                            );
                                        }

                                        return rowBoxes;
                                    })()}
                                </>
                            }

                            {viewOrders &&
                                <>

                                    {fetchedOrders.map((orderObject: any) => (
                                        <OrderMadeRectangle
                                            key={orderObject._id}
                                            orderName={orderObject.name}
                                            date={orderObject.dateCreated}
                                            onPress={() => { navigation.navigate('ViewOrderDetails', { order: orderObject }) }}
                                        />
                                    ))}
                                </>
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
    camera: {
        height: 200,
        width: '100%',
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

export default Orders;
