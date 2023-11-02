import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Pressable, TouchableWithoutFeedback } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton';
import SubmitButton from '../../../components/SubmitButton';
import { logout } from '../../../network/user_api';
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
    const { categoryId } = route.params || {};


    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);

                    const fetchedItems = await EmployeeApi.getItemsInBranch(categoryId) as any
                    setFetchedItems(fetchedItems)


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

                        <TopBar title={'Stocks'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>
                            <TouchableOpacity style={styles.addButton} onPress={() => { navigation.navigate('AddProductItem', { categoryId }) }}>
                                <Text style={styles.addButtonText}>Add Product to Branch</Text>
                            </TouchableOpacity>

                            {fetchedItems.map((item, index) => (

                                <RoundedBoxItem2
                                    key={index}
                                    text={item.itemId.name}
                                    quantity={item.quantity}
                                    itemId={item.itemId._id}
                                    deleteProp={deleteItemInCategory}
                                    handleMessage={handleMessage}
                                />
                            ))}


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