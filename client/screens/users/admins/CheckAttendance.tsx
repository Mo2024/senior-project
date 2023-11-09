import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton';
import SubmitButton from '../../../components/SubmitButton';
import { logout } from '../../../network/user_api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native';
import TopBar from '../../../components/TopBar';
import MessageBox from '../../../components/MessageBox';
import Field from '../../../components/Field';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import TopBarBtn from '../../../components/TopBarBtn';
import * as AdminApi from "../../../network/admin_api";
import { Businesses, Employee, newAdmin, newEmployee } from '../../../models/user';
import SelectDropdownIndex from '../../../components/SelectDropdownIndex';
import mongoose from 'mongoose';
import SelectDropdownComponent from '../../../components/SelectDropdownComponent';


interface prop {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function CheckAttendance({ navigation }: prop) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true)

    const [fetchedEmployeesNames, setFetchedEmployeesNames] = useState<string[]>([])
    const [fetchedEmployeesIds, setFetchedEmployeesIds] = useState<mongoose.Types.ObjectId[]>([])
    const [fetchedEmployees, setFetchedEmployees] = useState<any[]>()

    const [fetchedBranchesNames, setFetchedBranchesNames] = useState<string[]>([])
    const [fetchedBranchesIds, setFetchedBranchesIds] = useState<mongoose.Types.ObjectId[]>([])
    const [fetchedBranches, setFetchedBranches] = useState<any[]>()
    const [selectedBranchName, setSelectedBranchName] = useState('Select a branch')
    const [selectedBranchId, setSelectedBranchId] = useState<mongoose.Types.ObjectId>()
    const [selectedEmployee, setSelectedEmployee] = useState('Select an employee')

    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);
                    const fetchedBranches = await AdminApi.getBranches()
                    setFetchedBranches(fetchedBranches)
                    const branchesNames = fetchedBranches.map((branch: any) => branch.name);
                    setFetchedBranchesNames(branchesNames as any)
                    const branchesIds = fetchedBranches.map((branch: any) => branch._id);
                    setFetchedBranchesIds(branchesIds as any)
                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchLoggedInUserInfo()
        }, [])
    )


    async function handleBranchOptionChange(index: any) {
        const selectedBranchName = fetchedBranchesNames[index as number]
        const branchId = fetchedBranchesIds[index as number]
        setSelectedBranchName(selectedBranchName)
        setSelectedBranchId(branchId)
        const fetchedEmployees = await AdminApi.getEmployees(branchId)
        setFetchedEmployees(fetchedEmployees)
        const employeesNames = fetchedEmployees.map((employee: any) => employee.fullName);
        setFetchedEmployeesNames(employeesNames as any)
        const employeesIds = fetchedEmployees.map((employee: any) => employee._id);
        setFetchedEmployeesIds(employeesIds as any)

    }

    async function handleEmployeeOptionChange(index: any) {
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

                        if (!isError) {

                        }

                    }}

                />
            }
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.SafeAreaView}>
                <ScrollView>

                    <View style={styles.container}>

                        <TopBar title={'Attendance'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={false} />
                        <View style={styles.formBox}>

                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Branch</Text>
                            </View>
                            <SelectDropdownIndex
                                options={fetchedBranchesNames}
                                selectedOption={selectedBranchName}
                                handleOptionChange={handleBranchOptionChange}
                            />
                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Employees</Text>
                            </View>
                            <SelectDropdownIndex
                                options={fetchedEmployeesNames}
                                selectedOption={selectedEmployee}
                                handleOptionChange={handleEmployeeOptionChange}
                            />

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


export default CheckAttendance;