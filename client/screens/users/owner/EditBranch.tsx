import { SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import * as OwnerApi from "../../../network/owner_api";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp } from '@react-navigation/native';
import AuthFormComponent from '../../../components/AuthFormBox';
import { useFocusEffect } from '@react-navigation/native';
import AppLoader from '../../../components/AppLoader';
import mongoose from 'mongoose';
import MessageBox from '../../../components/MessageBox';
import { StatusBar } from 'expo-status-bar';
import TopBar from '../../../components/TopBar';
import SubmitButton from '../../../components/SubmitButton';
import Field from '../../../components/Field';
import * as SecureStore from 'expo-secure-store';
import SelectDropdownComponent from '../../../components/SelectDropdownComponent';
import { timeArray } from '../../../utils/arrays';
import { newBranchModel } from '../../../models/user';

interface EditBranchProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>;
}

function EditBranch({ navigation, route }: EditBranchProps) {
    const [newBranchName, setNewBranchName] = useState('')
    const [newOpeningTime, setNewOpeningTime] = useState('')
    const [newClosingTime, setNewClosingTime] = useState('')
    const [newLateTime, setNewLateTime] = useState('')

    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { branchId, name, openingTime, closingTime, lateTime } = route.params || {};


    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);
                    setNewBranchName(name)
                    setNewOpeningTime(openingTime)
                    setNewClosingTime(closingTime)
                    setNewLateTime(lateTime)
                    // console.log(credentialsObject)



                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchLoggedInUserInfo()
        }, [])
    )

    async function onSubmit(credentials: object) {
        try {
            const finalCred = credentials as newBranchModel
            let finalObj = {
                name: finalCred.name,
                branchId,
                openingTime: finalCred.openingTime,
                closingTime: finalCred.closingTime,
                lateTime: finalCred.lateTime
            } as newBranchModel
            await OwnerApi.editBranch(finalObj)
            await SecureStore.setItemAsync('updatedBranch', JSON.stringify(finalObj))
            navigation.navigate('ManageBranches')
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

                        <TopBar title={'Edit Business'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>

                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Name</Text>
                            </View>
                            <Field
                                handleChange={(updatedCredential) => {
                                    setNewBranchName(updatedCredential);
                                }}
                                placeholder={'Name'}
                                defaultValue={newBranchName}
                            />

                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Opening Time</Text>
                            </View>
                            <SelectDropdownComponent
                                options={timeArray}
                                selectedOption={openingTime}
                                handleOptionChange={(selectedItem) => { setNewOpeningTime(selectedItem) }}
                            />

                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Closing Time</Text>
                            </View>
                            <SelectDropdownComponent
                                options={timeArray}
                                selectedOption={closingTime}
                                handleOptionChange={(selectedItem) => { setNewClosingTime(selectedItem) }}
                            />

                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Late Time</Text>
                            </View>
                            <SelectDropdownComponent
                                options={timeArray}
                                selectedOption={lateTime}
                                handleOptionChange={(selectedItem) => { setNewLateTime(selectedItem) }}
                            />


                            <SubmitButton buttonName="Submit" handlePress={() => onSubmit({ branchId, name: newBranchName, openingTime: newOpeningTime, closingTime: newClosingTime, lateTime: newLateTime })} />

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


export default EditBranch;