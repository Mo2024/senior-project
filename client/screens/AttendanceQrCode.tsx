import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as UserApi from '../network/user_api';
import QRCode from 'react-native-qrcode-svg';
import MessageBox from '../components/MessageBox';
import AppLoader from '../components/AppLoader';
import SubmitButton from '../components/SubmitButton';
interface QrCode {
    attendanceCode: string;
    // other properties...
}

function AttendanceQrCode() {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [qrCode, setQrCode] = useState<string>();

    useEffect(() => {
        getQrCode()
    }, []);
    async function getQrCode() {
        try {
            setIsLoading(true);

            const fetchedQrCode = await UserApi.getQrCode() as any;
            setQrCode(fetchedQrCode.attendanceCode);

            setIsLoading(false);

        } catch (error) {
            console.log(error);

        }
    }
    if (isLoading) {
        return (
            <>
                <AppLoader />
            </>
        );

    }

    return (
        <>
            {isMessageVisible && (
                <MessageBox
                    type={isError}
                    message={message}
                    onClose={() => {
                        setIsMessageVisible(false);
                    }}
                />
            )}

            <View style={styles.container}>
                <QRCode value={qrCode as string} size={200} />
                <SubmitButton buttonName='Refresh' handlePress={() => { getQrCode() }} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AttendanceQrCode;
