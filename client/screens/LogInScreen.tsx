import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import Field from '../components/Field';
import { useState } from 'react';
import SubmitButton from '../components/SubmitButton';
import * as UserApi from "../network/user_api";
import * as SecureStore from 'expo-secure-store';


interface LogInScreenProps {
    // route: RouteProp<any, any>

}

function LogInScreen({ }: LogInScreenProps) {
    const [credentialsObject, setCredentialsObject] = useState({ username: '', password: '' })
    async function onSubmit(credentials: UserApi.LoginCredentials) {
        try {
            console.log(credentials)
            const user = await UserApi.login(credentials);
            await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
        } catch (error) {
            alert(error)
            console.error(error)

        }
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

            <View style={styles.container}>
                <Text style={styles.loginTitle}>Log In</Text>
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
    loginTitle: {
        color: "#72063c",
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 50,
        padding: 0,
        flex: 1,
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
        textAlign: 'center'
    },
    submitBtn: {
        marginTop: 100
    }

});

export default LogInScreen;