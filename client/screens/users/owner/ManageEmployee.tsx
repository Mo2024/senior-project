import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton';
import SubmitButton from '../../../components/SubmitButton';
import { logout } from '../../../network/user_api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp } from '@react-navigation/native';
import TopBar from '../../../components/TopBar';
import MessageBox from '../../../components/MessageBox';
import Field from '../../../components/Field';
import React, { useEffect, useLayoutEffect, useState } from 'react';


interface ManageEmployeeProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ManageEmployee({ navigation }: ManageEmployeeProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [currentSubScreen, setCurrentSubScreen] = useState('createEmployee');
    return (
        <View style={styles.container}>
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
                <StatusBar hidden={true} />

                <SafeAreaView style={styles.SafeAreaView}>
                    <ScrollView>

                        <View style={styles.container}>

                            <TopBar title={'Manage Employees'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={false} />
                            <View style={styles.formBox}>


                                {/* 
                                {currentSubScreen == 'createEmployee' &&

                                    ({
                                        Object.keys(credentialsObject).map(key =>
                                            <React.Fragment key={key}>
                                                <View style={styles.labelView}>
                                                    <Text style={styles.Label}>{placeholderData[key]}</Text>
                                                </View>
                                                <Field
                                                    handleChange={(updatedCredential) => {
                                                        setCredentialsObject({ ...credentialsObject, [key]: updatedCredential });
                                                    }}
                                                    placeholder={placeholderData[key]}
                                                    defaultValue={`${credentialsObject[key]}`}
                                                    label={placeholderData[key]}
                                                />
                                            </React.Fragment>
                                        )
                                    })
                                } */}

                                {/* <SubmitButton buttonName="Submit" handlePress={() => onSubmit(credentialsObject)} /> */}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    SafeAreaView: {
        flex: 1,
    },
    formBox: {
        // backgroundColor: "#72063c",
        flex: 9,
        width: "100%",
        borderTopRightRadius: 150,
        alignItems: 'center',
        // height: 2000,
        height: '100%',
        // paddingBottom: '100%'

    },
    formBoxTitle: {
        marginTop: 50,
        fontSize: 35,
        color: "#72063c",
        fontWeight: 'bold',
        textAlign: 'center',
    },
    submitBtn: {
        marginTop: 100
    },
    Label: {
        color: '#72063c',
        fontWeight: 'bold'

    },
    labelView: {
        width: '75%'
    }


});


export default ManageEmployee;