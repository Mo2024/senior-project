import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import Field from '../components/Field';
import { useState } from 'react';
import SubmitButton from '../components/SubmitButton';
import * as UserApi from "../network/user_api";
import * as SecureStore from 'expo-secure-store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp } from '@react-navigation/native';
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import TopBar from '../components/TopBar';

const AuthFormTemplate = () => {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

            <View style={styles.container}>

                <TopBar title='Log In' bgColor="rgba(0, 0, 0, 0)" navigation={navigation} />
                <View style={styles.formBox}>
                    <Text style={styles.formBoxTitle}>Welcome Back</Text>
                    <Field
                        handleChange={(username) => {
                            const currentState = { ...credentialsObject };
                            currentState.username = username
                            setCredentialsObject(currentState)
                        }}
                        placeholder='Username'
                        value={credentialsObject.username}
                    />
                    <Field
                        handleChange={(password) => {
                            const currentState = { ...credentialsObject };
                            currentState.password = password
                            setCredentialsObject(currentState)
                            console.log(credentialsObject)
                        }}
                        placeholder='Password'
                        value={credentialsObject.password}
                        secureTextEntry
                    />
                    <SubmitButton buttonName="Submit" handlePress={() => onSubmit(credentialsObject)} />
                </View>
            </View>
        </TouchableWithoutFeedback >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formBox: {
        backgroundColor: "#72063c",
        flex: 9,
        width: "100%",
        borderTopLeftRadius: 150,
        alignItems: 'center',
    },
    formBoxTitle: {
        marginTop: 50,
        fontSize: 35,
        color: "white",
        fontWeight: 'bold',
        textAlign: 'center',
    },
    submitBtn: {
        marginTop: 100
    },


});

export default AuthFormTemplate;