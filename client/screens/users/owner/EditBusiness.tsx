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

interface EditBusinessProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>;
}

function EditBusiness({ navigation, route }: EditBusinessProps) {
    const [credentialsObject, setCredentialsObject] = useState<{ [key: string]: string }>({ name: '', description: '' })
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { businessId, name, description } = route.params || {};


    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);
                    setCredentialsObject({ name, description })
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
            const finalCred = credentials as OwnerApi.newBusiness
            let finalObj = { name: finalCred.name, description: finalCred.description, businessId: businessId as mongoose.Types.ObjectId }
            await OwnerApi.editBusiness(finalObj);
            await SecureStore.setItemAsync('updatedBusiness', JSON.stringify(finalObj))
            navigation.navigate('ManageBusinessess')
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

    let placeholderData = {
        name: "Name",
        description: "Description",

    } as { [key: string]: string }

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
                            {Object.keys(credentialsObject).map(key =>
                                <React.Fragment key={key}>
                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>{placeholderData[key]}</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setCredentialsObject({ ...credentialsObject, [key]: updatedCredential });
                                        }}
                                        placeholder={placeholderData[key]}
                                        defaultValue={`${credentialsObject[key]}`}
                                        label={placeholderData[key]}
                                    />
                                </React.Fragment>
                            )}
                            <SubmitButton buttonName="Submit" handlePress={() => onSubmit(credentialsObject)} />
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


export default EditBusiness;