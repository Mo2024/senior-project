import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import TopBar from '../../../components/TopBar';
import MessageBox from '../../../components/MessageBox';
import React, { useState } from 'react';
import * as AdminApi from "../../../network/admin_api";
import { Branch, Businesses, Employee } from '../../../models/user';
import mongoose from 'mongoose';
import RoundedBoxWithText from '../../../components/RoundedBoxWithText';
import AppLoader from '../../../components/AppLoader';
import TopBarBtn from '../../../components/TopBarBtn';
import SubmitButton from '../../../components/SubmitButton';
import * as SecureStore from 'expo-secure-store';
import RoundedBoxBranch from '../../../components/RoundedBoxBranch';
import RoundedBoxEmployee from '../../../components/RoundedBoxEmployee';
import RoundedBoxItem from '../../../components/RoundedBoxItem';

interface ViewCategoryProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ViewCategory({ navigation, route }: ViewCategoryProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [itemsState, setItems] = useState<any[]>([])
    const { name, categoryId } = route.params || {};



    useFocusEffect(
        React.useCallback(() => {
            async function fetchBranches() {
                try {
                    setIsLoading(true);

                    const fetchedItemsApi = await AdminApi.getItems(categoryId as mongoose.Types.ObjectId)
                    setItems(fetchedItemsApi)
                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchBranches()
        }, [])
    )

    function deleteItem(itemId: mongoose.Types.ObjectId) {
        setItems((prevItems) => {
            return prevItems.filter((item) => item._id !== itemId);
        });
    }

    function handleMessage(isErrorParam: boolean, isVisibleParam: boolean, message: string) {
        setIsError(isErrorParam)
        setIsMessageVisible(isVisibleParam)
        setMessage(message)
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
                        <TopBar title={name} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>
                            {

                                (
                                    itemsState.map((item, i) =>
                                        <React.Fragment key={i}>
                                            <RoundedBoxItem
                                                name={item.name as string}
                                                handleMessage={handleMessage}
                                                itemId={item._id as mongoose.Types.ObjectId}
                                                navigation={navigation}
                                                route={route}
                                                deleteItem={deleteItem}
                                                description={item.description}
                                                price={item.price}
                                                categoryId={item.categoryId}
                                            />
                                        </React.Fragment>
                                    )
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
    }


});

export default ViewCategory;