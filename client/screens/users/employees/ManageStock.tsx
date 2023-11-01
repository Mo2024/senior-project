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


interface ManageStockProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ManageStock({ navigation, route }: ManageStockProp) {

    const [isLoading, setIsLoading] = useState(true);

    const [fetchedCategories, setFetchedCategories] = useState<Category[]>([])


    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);

                    const fetchedCategories = await EmployeeApi.getCategories() as Category[]
                    setFetchedCategories(fetchedCategories)


                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchLoggedInUserInfo()
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
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.SafeAreaView}>
                <ScrollView>

                    <View style={styles.container}>

                        <TopBar title={'Stocks'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={false} />
                        <View style={styles.formBox}>


                            {(() => {
                                const rowBoxes = [];

                                for (let i = 0; i < Math.ceil(fetchedCategories.length / 2); i++) {
                                    let extraCat = i + 1;
                                    const category = fetchedCategories[i];
                                    const category2 = fetchedCategories[extraCat];
                                    rowBoxes.push(
                                        <View style={styles.row} key={i}>
                                            <RoundedBox
                                                text={category.name}
                                                onPress={() => { navigation.navigate('ItemsInCategories', { category: category._id }) }}
                                            />

                                            {category2 && (
                                                <RoundedBox
                                                    text={category2.name}
                                                    onPress={() => { navigation.navigate('ItemsInCategories', { category: category._id }) }}
                                                />)
                                            }
                                        </View>
                                    );
                                }
                                return rowBoxes;
                            })()}


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

});

export default ManageStock;