import { SafeAreaView, ScrollView, StyleSheet, View, Text, } from 'react-native';
import React, { useState } from 'react';
import * as OwnerApi from "../../../network/owner_api";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp } from '@react-navigation/native';
import AuthFormComponent from '../../../components/AuthFormBox';
import * as SecureStore from 'expo-secure-store';
import MessageBox from '../../../components/MessageBox';
import TopBar from '../../../components/TopBar';
import Field from '../../../components/Field';
import SubmitButton from '../../../components/SubmitButton';
import DatePicker from 'react-native-date-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button } from 'react-bootstrap';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdownComponent from '../../../components/SelectDropdownComponent';
import { timeArray } from '../../../utils/arrays';
import { newBranchModel } from '../../../models/user';

interface CreateBranchProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function CreateBranch({ navigation, route }: CreateBranchProps) {
    const [newBranchName, setNewBranchName] = useState('')
    const [newOpeningTime, setNewOpeningTime] = useState('')
    const [newClosingTime, setNewClosingTime] = useState('')
    const [newLateTime, setNewLateTime] = useState('')

    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const { businessId } = route.params || {};

    async function onSubmit(credentials: object) {
        try {
            //dont forget to update this
            console.log(credentials)
            await OwnerApi.createBranch(credentials as newBranchModel);
            await SecureStore.setItemAsync('newBranch', JSON.stringify(credentials))
            navigation.navigate('ManageBranches')
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
            <SafeAreaView style={styles.SafeAreaView}>
                <ScrollView>

                    <View style={styles.container}>

                        <TopBar title={'Create Branch'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>

                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Name</Text>
                            </View>
                            <Field
                                handleChange={(updatedCredential) => {
                                    setNewBranchName(updatedCredential);
                                }}
                                placeholder={'Name'}
                            />

                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Opening Time</Text>
                            </View>
                            <SelectDropdownComponent
                                options={timeArray}
                                selectedOption='Select Opening Time'
                                handleOptionChange={(selectedItem) => { setNewOpeningTime(selectedItem) }}
                            />

                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Closing Time</Text>
                            </View>
                            <SelectDropdownComponent
                                options={timeArray}
                                selectedOption='Select Closing Time'
                                handleOptionChange={(selectedItem) => { setNewClosingTime(selectedItem) }}
                            />

                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Late Time</Text>
                            </View>
                            <SelectDropdownComponent
                                options={timeArray}
                                selectedOption='Select Late Time'
                                handleOptionChange={(selectedItem) => { setNewLateTime(selectedItem) }}
                            />


                            <SubmitButton buttonName="Submit" handlePress={() => onSubmit({ businessId, name: newBranchName, openingTime: newOpeningTime, closingTime: newClosingTime, lateTime: newLateTime })} />

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
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

export default CreateBranch;