import { SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import * as UserApi from "../network/user_api";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import MessageBox from '../components/MessageBox';
import { StatusBar } from 'expo-status-bar';
import TopBar from '../components/TopBar';
import SubmitButton from '../components/SubmitButton';
import Field from '../components/Field';

interface ForgetPasswordScreenProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>;
}

function ForgetPasswordScreen({ navigation, route }: ForgetPasswordScreenProps) {
    const [email, setEmail] = useState<string>()
    const [verCode, setVerCode] = useState<string>()
    const [newPwd, setNewPwd] = useState<string>()
    const [newConfirmPwd, setNewConfirmPwd] = useState<string>()

    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');

    const [emailSection, setEmailSection] = useState(true);
    const [verCodeSection, setVerCodeSection] = useState(false);

    async function onSubmitEmail(email: object) {
        try {
            await UserApi.forgetPasswordEmail(email as { email: string })
            setEmailSection(false)
            setVerCodeSection(true)
            // navigation.navigate('ManageBranches')
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
    async function onSubmitVerCode(credentials: object) {
        try {
            await UserApi.forgetPasswordVerCode(credentials as UserApi.forgotPasswordCodeI)
            navigation.navigate('LogInScreen')
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

                        <TopBar title={'Forget Password'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>

                            {emailSection &&
                                <>

                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Email</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setEmail(updatedCredential);
                                        }}
                                        placeholder={'Email'}
                                    />

                                    <SubmitButton buttonName="Submit" handlePress={() => onSubmitEmail({ email })} />
                                </>
                            }
                            {verCodeSection &&
                                <>

                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Verification Code</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setVerCode(updatedCredential);
                                        }}
                                        placeholder={'Verification Code'}
                                    />

                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>New Password</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setNewPwd(updatedCredential);
                                        }}
                                        placeholder={'New Password'}
                                    />

                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Confirm New Password</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setNewConfirmPwd(updatedCredential);
                                        }}
                                        placeholder={'Confirm New Password'}
                                    />

                                    <SubmitButton buttonName="Submit" handlePress={() => onSubmitVerCode({ code: verCode, newPwd, confirmNewPwd: newConfirmPwd })} />
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
    }


});


export default ForgetPasswordScreen;