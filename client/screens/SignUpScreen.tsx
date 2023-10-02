import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Platform, ScrollView } from 'react-native';
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
import { validateSignup } from '../utils/functions';

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
        confirmPassword: "",
        area: "",
        road: "",
        block: "",
        building: "",
        ownerCpr: "",
    })
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');

    async function onSubmit(credentials: object) {
        try {
            await validateSignup(credentials as UserApi.SignupCredentials)
            const user = await UserApi.signup(credentials as UserApi.SignupCredentials);
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
    return (
        <AuthFormComponent
            credentialsObject={credentialsObject}
            credentialsObjectUpdate={(updatedCredentialsObject) => { setCredentialsObject(updatedCredentialsObject); console.log(credentialsObject) }}
            placeholderData={placeholderData}
            navigation={navigation}
            onSubmit={onSubmit}
            title="Sign Up"
            formBoxTitle="Welcome!"
            isMessageVisible={isMessageVisible}
            isError={isError}
            message={message}
            onClose={() => {
                setIsMessageVisible(false)
            }}
        />
        // <ScrollView>

        //     <View style={styles.container}>

        //         <TopBar title={'Sign Up'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} />
        //         <View style={styles.formBox}>
        //             <Text style={styles.formBoxTitle}>{'Welcome!'}</Text>
        //             {Object.keys(credentialsObject).map(key =>
        //                 <Field
        //                     handleChange={(updatedCredential) => {
        //                         setCredentialsObject({ ...credentialsObject, [key]: updatedCredential });
        //                     }}
        //                     placeholder={placeholderData[key]}
        //                     key={key}
        //                 />
        //             )}
        //             <SubmitButton buttonName="Submit" handlePress={() => onSubmit(credentialsObject)} />

        //         </View>
        //     </View>
        // </ScrollView>

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
        // backgroundColor: "#72063c",
        flex: 9,
        width: "100%",
        borderTopRightRadius: 150,
        alignItems: 'center',
        // height: 2000,
        paddingBottom: '100%'
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
    }

});


export default SignUpScreen;