import { SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import * as UserApi from "../network/user_api";
import MessageBox from '../components/MessageBox';
import SubmitButton from '../components/SubmitButton';


function AttendanceQrCode() {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');

    async function refresh(credentials: object) {
        // try {
        //     await UserApi.updatePassword(credentials as UserApi.UpdatePasswordInfoBody)
        //     navigation.navigate('Profile')
        // } catch (error) {
        //     setIsError(true)
        //     let errorMessage = ''
        //     if (error instanceof Error) {
        //         errorMessage = error.message;
        //     }
        //     setMessage(errorMessage)
        //     setIsMessageVisible(true)

        // }
    }

    return (
        <>
            {
                isMessageVisible &&

                <MessageBox
                    type={isError}
                    message={message}
                    onClose={() => {
                        setIsMessageVisible(false)
                    }}

                />
            }

        </>
    );
}


const styles = StyleSheet.create({



});


export default AttendanceQrCode;