import { Dimensions, StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Platform, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import Field from '../components/Field';
import React, { useState } from 'react';
import SubmitButton from '../components/SubmitButton';
import * as UserApi from "../network/user_api";
import * as SecureStore from 'expo-secure-store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp } from '@react-navigation/native';
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import TopBar from '../components/TopBar';
import SelectDropdownComponent from '../components/SelectDropdownComponent';
import MessageBox from './MessageBox';

interface AuthFormBoxProps {
    title: string
    formBoxTitle: string | null
    placeholderData: { [key: string]: string }
    navigation: NativeStackNavigationProp<any>
    credentialsObject: object
    onSubmit: (credentials: object) => void
    isMessageVisible: boolean
    isError: boolean
    message: string
    onClose: () => void
    login: boolean
    credentialsObjectUpdate: (credentialsObject: { [key: string]: string }) => void
}
const AuthFormComponent = ({ login, message, isMessageVisible, isError, onClose, credentialsObject, placeholderData, navigation, onSubmit, title, formBoxTitle, credentialsObjectUpdate }: AuthFormBoxProps) => {
    return (
        // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
            {
                isMessageVisible &&

                <MessageBox
                    type={isError}
                    message={message}
                    onClose={() => {
                        onClose()
                    }}

                />
            }
            <SafeAreaView style={styles.SafeAreaView}>
                <ScrollView>

                    <View style={styles.container}>

                        <TopBar title={title} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>
                            {formBoxTitle !== null &&

                                <Text style={styles.formBoxTitle}>{formBoxTitle}</Text>
                            }
                            {Object.keys(credentialsObject).map(key =>
                                <React.Fragment key={key}>
                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>{placeholderData[key]}</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            credentialsObjectUpdate({ ...credentialsObject, [key]: updatedCredential });
                                        }}
                                        placeholder={placeholderData[key]}
                                    />
                                </React.Fragment>
                            )}
                            <SubmitButton buttonName="Submit" handlePress={() => onSubmit(credentialsObject)} />
                            {login &&
                                <TouchableOpacity onPress={() => navigation.navigate('ForgetPasswordScreen')}>
                                    <Text style={styles.forgetPasswordText}>
                                        Forget Password
                                    </Text>
                                </TouchableOpacity>
                            }

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>

        // </TouchableWithoutFeedback >
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
    forgetPasswordText: {
        color: "#72063c",
    }
});

export default AuthFormComponent;