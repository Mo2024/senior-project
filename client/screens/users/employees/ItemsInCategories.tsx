import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Pressable, TouchableWithoutFeedback } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react'
import MessageBox from '../../../components/MessageBox';
import TopBar from '../../../components/TopBar';
import TopBarBtn from '../../../components/TopBarBtn';
import AppLoader from '../../../components/AppLoader';
import RoundedBox from '../../../components/RoundedBox';
import { Category } from '../../../models/user';
import * as EmployeeApi from '../../../network/employee_api'
import RoundedBoxItem2 from '../../../components/RoundedBoxItem2';
import mongoose from 'mongoose';
import * as SecureStore from 'expo-secure-store';


interface ItemsInCategoriesProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ItemsInCategories({ navigation, route }: ItemsInCategoriesProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [fetchedItems, setFetchedItems] = useState<any[]>([])
    const [fetchedItemsInBranch, setFetchedItemsInBranch] = useState<any[]>([])
    const { categoryId, isOrder, currentCustomerIndex } = route.params || {};


    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);
                    let fetchedItemsInBranch: any[] = await EmployeeApi.getItemsInBranch(categoryId) as any
                    let fetchedItems
                    if (isOrder) {
                        fetchedItems = await EmployeeApi.getItems(categoryId) as any
                        const updatedFetchedItems = fetchedItems.map((item: any) => {
                            const matchingItemInBranch = fetchedItemsInBranch.find(
                                (itemInBranch) => {
                                    return itemInBranch.itemId._id.toString() === item._id.toString()
                                }
                            );

                            if (matchingItemInBranch) {
                                return {
                                    ...item,
                                    quantity: matchingItemInBranch.quantity,
                                };

                            } else {
                                return item;
                            }
                        });
                        console.log(updatedFetchedItems)
                        setFetchedItems(updatedFetchedItems)
                    }



                    setFetchedItemsInBranch(fetchedItemsInBranch)


                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchLoggedInUserInfo()
        }, [])
    )

    function handleMessage(isErrorParam: boolean, isVisibleParam: boolean, message: string) {
        setIsError(isErrorParam)
        setIsMessageVisible(isVisibleParam)
        setMessage(message)
    }

    function deleteItemInCategory(itemId: mongoose.Types.ObjectId) {
        setFetchedItems((prevItems) => {
            return prevItems.filter((item) => item.itemId._id !== itemId);
        });
    }

    async function handleAddToCartItem(qty: number, name: string, _id: mongoose.Types.ObjectId, price: number) {
        const fetchedCustomerOrdersObjects = await SecureStore.getItemAsync('customerOrdersObjects')
        const parsedCustomerOrdersObjects = JSON.parse(fetchedCustomerOrdersObjects as string);

        const existingItemIndex = parsedCustomerOrdersObjects[currentCustomerIndex].findIndex((item: any) => item._id === _id);
        // console.log(existingItemIndex)
        if (existingItemIndex !== -1) {
            parsedCustomerOrdersObjects[currentCustomerIndex][existingItemIndex].qty += qty;

        } else {
            const newItem = { name, _id, qty, price };
            parsedCustomerOrdersObjects[currentCustomerIndex].push(newItem);
        }
        await SecureStore.setItemAsync('customerOrdersObjects', JSON.stringify(parsedCustomerOrdersObjects));
        console.log(parsedCustomerOrdersObjects)
        console.log(parsedCustomerOrdersObjects[currentCustomerIndex])

    }
    if (isLoading) {
        return (
            <>
                <AppLoader />
            </>
        );

    }
    return (
        <>
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.SafeAreaView}>
                <ScrollView>

                    <View style={styles.container}>

                        <TopBar title={isOrder ? 'Items' : 'Stocks'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>

                            {!isOrder &&
                                <>
                                    <TouchableOpacity style={styles.addButton} onPress={() => { navigation.navigate('AddProductItem', { categoryId }) }}>
                                        <Text style={styles.addButtonText}>Add Product to Branch</Text>
                                    </TouchableOpacity>

                                    {fetchedItemsInBranch.map((item, index) => (

                                        <RoundedBoxItem2
                                            key={index}
                                            text={item.itemId.name}
                                            quantity={item.quantity}
                                            itemId={item.itemId._id}
                                            deleteProp={deleteItemInCategory}
                                            handleMessage={handleMessage}
                                            navigation={navigation}
                                            route={route}
                                            categoryId={categoryId}
                                        />
                                    ))}
                                </>
                            }

                            {isOrder &&
                                <>
                                    {(() => {
                                        const rowBoxes = [];

                                        for (let i = 0; i < fetchedItems.length; i += 2) {
                                            const item = fetchedItems[i];
                                            const item2 = fetchedItems[i + 1];

                                            rowBoxes.push(
                                                <View style={styles.row} key={i}>
                                                    <RoundedBox
                                                        text={item.name}
                                                        onPress={() => { item.quantity ? handleAddToCartItem(1, item.name, item._id, item.price) : null }}
                                                        qty={item.quantity}
                                                        isItem={true}
                                                    />

                                                    {item2 && (
                                                        <RoundedBox
                                                            text={item2.name}
                                                            onPress={() => { item2.quantity ? handleAddToCartItem(1, item2.name, item2._id, item2.price) : null }}
                                                            qty={item2.quantity}
                                                            isItem={true}

                                                        />)
                                                    }
                                                </View>
                                            );
                                        }

                                        return rowBoxes;
                                    })()}
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    addButton: {
        backgroundColor: '#72063c',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        // fontWeight: 'bold',
        textAlign: 'center',
    },

});

export default ItemsInCategories;
