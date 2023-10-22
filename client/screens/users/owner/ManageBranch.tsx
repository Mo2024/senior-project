import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import TopBar from '../../../components/TopBar';
import MessageBox from '../../../components/MessageBox';
import React, { useState } from 'react';
import * as OwnerApi from "../../../network/owner_api";
import { Branch, Businesses, Employee } from '../../../models/user';
import mongoose from 'mongoose';
import RoundedBoxWithText from '../../../components/RoundedBoxWithText';
import AppLoader from '../../../components/AppLoader';
import TopBarBtn from '../../../components/TopBarBtn';
import SubmitButton from '../../../components/SubmitButton';
import * as SecureStore from 'expo-secure-store';
import RoundedBoxBranch from '../../../components/RoundedBoxBranch';
import RoundedBoxEmployee from '../../../components/RoundedBoxEmployee';

interface ManageBranchesProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ManageBranch({ navigation, route }: ManageBranchesProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    // const [fetchedBusinessess, setFetchedBusinessess] = useState<Businesses>([])
    const [employeesState, setEmployees] = useState<Employee[]>([])
    const { branchId, name } = route.params || {};



    useFocusEffect(
        React.useCallback(() => {
            async function fetchBranches() {
                try {
                    setIsLoading(true);

                    const fetchedBranchesApi = await OwnerApi.getEmployees(branchId as mongoose.Types.ObjectId) as Employee[]
                    setEmployees(fetchedBranchesApi)
                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchBranches()
        }, [])
    )

    function deleteEmployee(employeeId: mongoose.Types.ObjectId) {
        setEmployees((prevEmployees) => {
            return prevEmployees.filter((employee) => employee._id !== employeeId);
        });
    }

    function handleMessage(isErrorParam: boolean, isVisibleParam: boolean, message: string) {
        setIsError(isErrorParam)
        setIsMessageVisible(isVisibleParam)
        setMessage(message)
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
                        <TopBar title={name} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>
                            {

                                (
                                    employeesState.map((employee, i) =>
                                        <React.Fragment key={i}>
                                            <RoundedBoxEmployee
                                                name={employee.fullName as string}
                                                handleMessage={handleMessage}
                                                employeeId={employee._id as mongoose.Types.ObjectId}
                                                navigation={navigation}
                                                route={route}
                                                deleteEmployee={deleteEmployee}
                                            />
                                        </React.Fragment>
                                    )
                                )
                            }
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

export default ManageBranch;