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
import AuthFormComponent from '../components/AuthFormBox';

interface SignUpScreenProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function SignUpScreen({ navigation }: SignUpScreenProps) {

    const [credentialsObject, setCredentialsObject] = useState<{ [key: string]: string }>({
        email: "",
        username: "",
        fullName: "",
        telephone: "",
        password: "",
        confirmPassword: ""
    })

    async function onSubmit(credentials: object, selectedOption: string) {
        try {
            console.log(selectedOption)
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

    const options = ['Business Owner', 'Customer']
    let placeholderData = {
        email: "Email",
        username: "Username",
        fullName: "Full Name",
        telephone: "Telephone",
        password: "Password",
        confirmPassword: "Confirm Password",
        area: "Area",
        road: "Road",
        block: "Block",
        building: "Building",
        ownerCpr: "CPR",
    } as { [key: string]: string }

    function credentialsObjectChanger(selectedItem: string) {

        if (selectedItem == "Business Owner") {
            setCredentialsObject({
                ...credentialsObject,
                area: "",
                road: "",
                block: "",
                building: "",
                ownerCpr: "",
            })
        } else if (selectedItem == "Customer") {
            let { email, username, fullName, telephone, password, confirmPassword, } = credentialsObject
            setCredentialsObject({
                email, username, fullName, telephone, password, confirmPassword
            })
        }

    }
    return (
        <AuthFormComponent
            credentialsObject={credentialsObject}
            credentialsObjectUpdate={(updatedCredentialsObject) => { setCredentialsObject(updatedCredentialsObject); console.log(credentialsObject) }}
            placeholderData={placeholderData}
            navigation={navigation}
            onSubmit={onSubmit}
            options={options}
            title="Sign Up"
            formBoxTitle="Welcome!"
            credentialsObjectChanger={credentialsObjectChanger}
        />

    );
}



export default SignUpScreen;