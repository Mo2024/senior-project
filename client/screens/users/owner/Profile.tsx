import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import SubmitButton from '../../../components/SubmitButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as UserApi from "../../../network/user_api";
import MessageBox from '../../../components/MessageBox';
import TopBar from '../../../components/TopBar';
import Field from '../../../components/Field';
import AppLoader from '../../../components/AppLoader';


interface LoggedInScreenProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function Profile({ navigation }: LoggedInScreenProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [credentialsObject, setCredentialsObject] = useState<{ [key: string]: string }>({
        email: "",
        username: "",
        fullName: "",
        telephone: "",
        area: "",
        road: "",
        block: "",
        building: "",
        cpr: ""

    })
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    let placeholderData = {
        email: "Email",
        username: "Username",
        fullName: "Full Name",
        telephone: "Telephone",
        area: "Area",
        road: "Road",
        block: "Block",
        building: "Building",
        cpr: "CPR"


    } as { [key: string]: string }

    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);
                    const storedUserInfo = await SecureStore.getItemAsync('userInfo');

                    if (storedUserInfo) {
                        const user = await UserApi.getLoggedInUserInfo() as any
                        const {
                            email,
                            username,
                            fullName,
                            telephone,
                            cpr,
                            area,
                            road,
                            block,
                            building
                        } = user

                        setCredentialsObject({
                            email,
                            username,
                            fullName,
                            telephone,
                            area,
                            road,
                            block,
                            building,
                            cpr
                        })

                    }


                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchLoggedInUserInfo()
        }, [])
    )

    async function onSubmit(credentialsObject: object) {
        try {
            // await validateSignup(credentials as UserApi.userInfoUpdateCredentials)
            const user = await UserApi.updateUserInfo(credentialsObject as UserApi.userInfoUpdateCredentials);
            setIsError(false)
            setIsMessageVisible(true)
            setMessage('Information Updated successfully')
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

                        <TopBar title={'Profile'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={false} />
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

export default Profile;