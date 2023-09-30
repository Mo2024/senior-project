import { Dimensions, StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Platform, ScrollView, SafeAreaView } from 'react-native';
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
import FontAwesome from '@expo/vector-icons/FontAwesome'
import TopBar from '../components/TopBar';
import SelectDropdownComponent from '../components/SelectDropdownComponent';

interface AuthFormBoxProps {
    title: string
    formBoxTitle: string
    placeholderData: { [key: string]: string }
    navigation: NativeStackNavigationProp<any>
    credentialsObject: object
    onSubmit: (credentials: object) => void
    credentialsObjectUpdate: (credentialsObject: { [key: string]: string }) => void
}
const AuthFormComponent = ({ credentialsObject, placeholderData, navigation, onSubmit, title, formBoxTitle, credentialsObjectUpdate }: AuthFormBoxProps) => {
    return (
        // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.SafeAreaView}>
            <ScrollView>

                <View style={styles.container}>

                    <TopBar title={title} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} />
                    <View style={styles.formBox}>
                        <Text style={styles.formBoxTitle}>{formBoxTitle}</Text>
                        {Object.keys(credentialsObject).map(key =>
                            <Field
                                handleChange={(updatedCredential) => {
                                    credentialsObjectUpdate({ ...credentialsObject, [key]: updatedCredential });
                                }}
                                placeholder={placeholderData[key]}
                                key={key}
                            />
                        )}
                        <SubmitButton buttonName="Submit" handlePress={() => onSubmit(credentialsObject)} />

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

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



});

export default AuthFormComponent;