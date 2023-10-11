import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import TopBar from '../../../components/TopBar';
import MessageBox from '../../../components/MessageBox';
import React, { useState } from 'react';
import * as OwnerApi from "../../../network/owner_api";
import { Businesses } from '../../../models/user';
import mongoose from 'mongoose';
import RoundedBoxWithText from '../../../components/RoundedBoxWithText';
import AppLoader from '../../../components/AppLoader';
import TopBarBtn from '../../../components/TopBarBtn';
import SubmitButton from '../../../components/SubmitButton';

interface ManageBusinessessProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ManageBusinessess({ navigation, route }: ManageBusinessessProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [currentSubScreen, setCurrentSubScreen] = useState('viewBusiness');
    const [isLoading, setIsLoading] = useState(true);
    const [businessess, setBusinessess] = useState<Businesses>([])

    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);
                    const businessess = await OwnerApi.getMyBusinessess() as Businesses
                    setBusinessess(businessess)

                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchLoggedInUserInfo()
        }, [])
    )

    function deleteBusiness(businessId: mongoose.Types.ObjectId) {
        setBusinessess((prevBusinesses) => {
            return prevBusinesses.filter((business) => business._id !== businessId);
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
                        <TopBar title={'My Business'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={false} />
                        <View style={styles.formBox}>
                            {currentSubScreen == 'viewBusiness' &&

                                (
                                    businessess.map((business, i) =>
                                        <React.Fragment key={i}>
                                            <RoundedBoxWithText
                                                title={business.name as string}
                                                deleteBusinessProp={deleteBusiness}
                                                businessId={business._id as mongoose.Types.ObjectId}
                                                subtitle={business.description as string}
                                                handleMessage={handleMessage} navigation={navigation} route={route} />
                                        </React.Fragment>
                                    )
                                )
                            }
                            <SubmitButton buttonName='Create Business' handlePress={() => { console.log('ss'); navigation.navigate('CreateBusiness') }} />

                            {currentSubScreen == 'createBusiness' &&

                                (
                                    <>
                                        <AppLoader />
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
    }


});

export default ManageBusinessess;