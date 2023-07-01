import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import Field from '../components/Field';
import { useState } from 'react';
import SubmitButton from '../components/SubmitButton';
import * as UserApi from "../network/user_api";
import * as SecureStore from 'expo-secure-store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import EvilIcons from '@expo/vector-icons/EvilIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Ionicons from '@expo/vector-icons/Ionicons'

interface LogInScreenProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function LogInScreen({ navigation }: LogInScreenProps) {
    const [credentialsObject, setCredentialsObject] = useState({ username: '', password: '' })
    async function onSubmit(credentials: UserApi.LoginCredentials) {
        try {
            console.log(credentials)
            const user = await UserApi.login(credentials);
            await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
            navigation.navigate('LoggedInScreen')
        } catch (error) {
            alert(error)
            console.error(error)

        }
    }
    const goBack = () => {
        navigation.goBack();
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

            <View style={styles.container}>

                <View style={styles.topContainer}>
                    <View style={styles.topLeftContainer}>
                        <FontAwesome.Button
                            name='arrow-left'
                            backgroundColor="rgba(0, 0, 0, 00)"
                            color="rgb(0,0,0)"
                            onPress={goBack}
                            size={32}
                        // style={styles.icon}
                        />
                    </View>
                    <Text style={styles.loginTitle}>Log In</Text>
                </View>

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
        // // flex: 1.,
        // // textAlign: 'center'

        // // justifyContent: 'flex-end',

        //begin
        flex: 1, // This will make the title occupy the remaining space in the middle
        textAlign: 'center',
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
    topContainer: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        marginTop: 30,
        flex: 1,
        // // alignItems: 'flex-start'

        /// begin
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        // paddingHorizontal: 16,

    },
    // icon: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'flex-start',
    //     marginTop: 5
    // },
    topLeftContainer: {
        // flex: 1,
        // // flexDirection: 'row',
        // justifyContent: 'flex-start',
        // // marginTop: 5

        position: 'absolute',
        left: 16,


    }

});

export default LogInScreen;