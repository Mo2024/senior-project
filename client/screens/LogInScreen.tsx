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
import AuthFormComponent from '../components/AuthFormBox';

interface LogInScreenProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function LogInScreen({ navigation }: LogInScreenProps) {
    const [credentialsObject, setCredentialsObject] = useState<{ [key: string]: string }>({ username: '', password: '' })
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    async function onSubmit(credentials: object) {
        try {
            console.log(credentials)
            const user = await UserApi.login(credentials as UserApi.LoginCredentials);
            await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'LoggedInScreen' }],
                })
            );
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
        username: "Username",
        password: "Password",

    } as { [key: string]: string }



    return (
        <AuthFormComponent
            credentialsObject={credentialsObject}
            credentialsObjectUpdate={(updatedCredentialsObject) => { setCredentialsObject(updatedCredentialsObject); console.log(credentialsObject) }}
            placeholderData={placeholderData}
            navigation={navigation}
            onSubmit={onSubmit}
            title="Sign In"
            formBoxTitle="Welcome!"
            isMessageVisible={isMessageVisible}
            isError={isError}
            message={message}
            onClose={() => {
                setIsMessageVisible(false)
            }}
        />

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

export default LogInScreen;