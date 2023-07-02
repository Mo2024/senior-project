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
import FontAwesome from '@expo/vector-icons/FontAwesome'
import TopBar from '../components/TopBar';
import SelectDropdownComponent from '../components/SelectDropdownComponent';
import AuthFormBox from '../components/AuthFormBox';

interface SignUpScreenProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function SignUpScreen({ navigation }: SignUpScreenProps) {
    const [selectedOption, setSelectedOption] = useState("Choose user type");

    async function onSubmit(credentials: object) {
        try {
            console.log(credentials)
            const user = await UserApi.signup(credentials as UserApi.SignupCredentials);
            await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'LoggedInScreen' }],
                })
            );
        } catch (error) {
            alert(error)
            console.error(error)

        }
    }

    const placeholderData = {
        email: "Email",
        username: "Username",
        fullName: "Full Name",
        telephone: "Telephone",
        password: "Password",
        confirmPassword: "Confirm Password"
    }
    const credentialsObject = {
        email: "",
        username: "",
        fullName: "",
        telephone: "",
        password: "",
        confirmPassword: ""
    }
    return (
        <AuthFormBox
            credentialsObjectProps={credentialsObject}
            placeholderData={placeholderData}
            navigation={navigation}
            onSubmit={onSubmit}
        />

    );
}



export default SignUpScreen;