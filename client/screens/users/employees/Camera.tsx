// CameraScreen.js
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { View, Text, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import SubmitButton from '../../../components/SubmitButton';
import MessageBox from '../../../components/MessageBox';
import AppLoader from '../../../components/AppLoader';
import * as EmployeeApi from '../../../network/employee_api'

const CameraScreen = () => {
    // const [scannedData, setScannedData] = useState();
    const [hasPerms, setHasPerms] = useState(false);
    const [isScanned, setIsScanned] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPerms(status === 'granted')
        })()
    })



    async function handleBarCodeScanned({ data }: any) {
        console.log('Scanned data:', data);
        // setScannedData(data);

        try {
            setIsLoading(true)
            const attendance = await EmployeeApi.submitAttendance({ attendanceCode: data })
            let msg = (
                attendance.isLate
                    ?
                    "Late Check-In! Your attendance has been recorded successfully."
                    :
                    "Your attendance has been recorded successfully."
            )
            setIsError(false)
            setMessage(msg)
            setIsMessageVisible(true)
            setIsScanned(true)
            setIsLoading(false)

        } catch (error) {
            setIsError(true)
            let errorMessage = ''
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setMessage(errorMessage)
            setIsMessageVisible(true)
            setIsScanned(true)
            setIsLoading(false)



        }
    };

    if (isLoading) {
        return (
            <>
                <AppLoader />
            </>
        );

    }

    if (!hasPerms) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    Please grant camera permissions to the app.
                </Text>
            </View>
        )
    }

    if (isScanned) {
        return (
            <>
                {
                    (isMessageVisible || true) &&

                    <MessageBox
                        type={isError}
                        message={message}
                        onClose={() => {
                            setIsMessageVisible(false)
                            setIsScanned(false)
                        }}

                    />
                }
            </>
        )
    }

    // if (!isScanned) {

    return (
        <View style={styles.conatiner2}>
            <BarCodeScanner
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={handleBarCodeScanned}
            />
            {/* {scannedData && <SubmitButton buttonName='Scan Again?' handlePress={() => { setScannedData(undefined) }} />
                } */}
            <StatusBar style="auto" />
        </View>
    );
    // }
};
const styles = StyleSheet.create({
    conatiner2: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
export default CameraScreen;
