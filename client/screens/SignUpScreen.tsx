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

interface SignUpScreenProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function SignUpScreen({ navigation }: SignUpScreenProps) {
    const [credentialsObject, setCredentialsObject] = useState({
        email: "",
        username: "",
        fullName: "",
        telephone: "",
        password: "",
        confirmPassword: ""
    })
    const [selectedOption, setSelectedOption] = useState("Choose user type");

    async function onSubmit(credentials: UserApi.LoginCredentials) {
        try {
            console.log(credentials)
            const user = await UserApi.login(credentials);
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
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

            <View style={styles.container}>

                <TopBar title='Log In' bgColor="rgba(0, 0, 0, 0)" navigation={navigation} />
                <View style={styles.formBox}>
                    <Text style={styles.formBoxTitle}>Welcome!</Text>
                    <SelectDropdownComponent
                        options={['Business Owner', 'Customer']}
                        selectedOption={selectedOption}
                        handleOptionChange={(selectedItem) => setSelectedOption(selectedItem)}
                    />

                    <Field
                        handleChange={(email) => {
                            const currentState = { ...credentialsObject };
                            currentState.email = email
                            setCredentialsObject(currentState)
                        }}
                        placeholder='Email'
                    />
                    <Field
                        handleChange={(username) => {
                            const currentState = { ...credentialsObject };
                            currentState.username = username
                            setCredentialsObject(currentState)
                        }}
                        placeholder='Username'
                    />
                    <Field
                        handleChange={(fullName) => {
                            const currentState = { ...credentialsObject };
                            currentState.fullName = fullName
                            setCredentialsObject(currentState)
                        }}
                        placeholder='fullName'
                    />
                    <Field
                        handleChange={(password) => {
                            const currentState = { ...credentialsObject };
                            currentState.password = password
                            setCredentialsObject(currentState)
                            console.log(credentialsObject)
                        }}
                        placeholder='Password'
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
        borderTopRightRadius: 150,
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

export default SignUpScreen;