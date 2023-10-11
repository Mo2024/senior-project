import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton';
import SubmitButton from '../../../components/SubmitButton';
import { logout } from '../../../network/user_api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native';
import TopBar from '../../../components/TopBar';
import MessageBox from '../../../components/MessageBox';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import * as OwnerApi from "../../../network/owner_api";
import { Businesses } from '../../../models/user';
import mongoose from 'mongoose';
import RoundedBoxWithText from '../../../components/RoundedBoxWithText';
import AppLoader from '../../../components/AppLoader';
import TopBarBtn from '../../../components/TopBarBtn';

interface ManageBusinessessProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ManageBusinessess({ navigation }: ManageBusinessessProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [currentSubScreen, setCurrentSubScreen] = useState('viewBusiness');
    const [isLoading, setIsLoading] = useState(true);
    const [businessess, setBusinessess] = useState<Businesses>([])
    const [activeArray, setActiveArray] = useState([true])

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

    async function deleteBusiness(businessId: mongoose.Types.ObjectId) {
        try {
            console.log('clicked')
            await OwnerApi.deleteBusiness(businessId)
            setBusinessess((prevBusinesses) => {
                return prevBusinesses.filter((business) => business._id !== businessId);
            });
            setIsError(false)
            setIsMessageVisible(true)
            setMessage('Business Deleted successfully')
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

                        <TopBar title={'Businessess'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={false} />
                        <TopBarBtn buttonName='bdsdsdstn' isActive={activeArray[0]} handlePress={() => { }} />
                        <View style={styles.formBox}>
                            {currentSubScreen == 'viewBusiness' &&

                                (
                                    businessess.map((business, i) =>
                                        <React.Fragment key={i}>
                                            {/* <View style={styles.labelView}>
                                                <Text style={styles.Label}>{placeholderData[key]}</Text>
                                            </View>
                                            <Field
                                                handleChange={(updatedCredential) => {
                                                    setCredentialsObject({ ...credentialsObject, [key]: updatedCredential });
                                                }}
                                                placeholder={placeholderData[key]}
                                                defaultValue={`${credentialsObject[key]}`}
                                                label={placeholderData[key]}
                                            /> */}
                                            <RoundedBoxWithText
                                                deleteBusiness={() => {
                                                    console.log('Deleting business...');

                                                    deleteBusiness(business._id as mongoose.Types.ObjectId)
                                                }}
                                                title={business.name as string}
                                                subtitle={`Number of branches ${business.branches?.length}`}
                                            />
                                            {/* <Text>{business.name}</Text> */}
                                        </React.Fragment>
                                    )
                                )
                            }
                            {/* <SubmitButton buttonName="Submit" handlePress={() => onSubmit(credentialsObject)} /> */}
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