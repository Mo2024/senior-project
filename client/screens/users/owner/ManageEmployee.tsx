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
import * as OwnerApi from "../../../network/owner_api";
import { Businesses, newEmployee } from '../../../models/user';
import SelectDropdownComponent from '../../../components/SelectDropdownComponent';


interface ManageEmployeeProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ManageEmployee({ navigation }: ManageEmployeeProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [createEmployeeIsActive, setCreateEmployeeIsActive] = useState(true)
    const [transferEmployeeIsActive, setTransferEmployeeIsActive] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [businessess, setBusinessess] = useState<Businesses>([])
    const [businessNames, setBusinessNames] = useState([])
    const [businessIds, setBusinessIds] = useState([])
    const [branchesNames, setBranchesNames] = useState([])
    const [branchesIds, setBranchesIds] = useState([])
    const [branchId, setBranchId] = useState<any>()
    const [employeeData, setEmployeeData] = useState({
        username: "",
        email: "",
        fullName: "",
        telephone: "",
        cpr: "",
    })


    const [emptyState, setEmptyState] = useState('')
    const [selectedBusiness, setSelectedBusiness] = useState('Select Business');
    const [selectedBranch, setSelectedBranch] = useState('Select Business');
    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);
                    const fetchedBusinessess = await OwnerApi.getMyBusinessess() as Businesses
                    setBusinessess(fetchedBusinessess)
                    const businessNames = fetchedBusinessess.map(business => business.name);
                    setBusinessNames(businessNames as any)
                    const businessIds = fetchedBusinessess.map(business => business._id);
                    setBusinessIds(businessIds as any)
                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchLoggedInUserInfo()
        }, [])
    )

    function handleBusinessOptionChange(index: any) {
        const selectedBusinessName = businessNames[index as number]
        setSelectedBusiness(selectedBusinessName)
        const businessId = businessIds[index as number]
        const business = businessess.find(business => business._id === businessId);
        setBranchesNames((prevNames) => (business?.branches?.map(branch => branch.name)) as any);
        setBranchesIds((prevIds) => (business?.branches?.map(branch => branch._id)) as any);

    }
    function handleBranchOptionChange(index: any) {
        const selectedBranchName = branchesNames[index as number]
        setSelectedBranch(selectedBranchName)
        setBranchId((prevId: any) => branchesIds[index as number])
    }

    async function onSubmit() {
        try {
            const credentials = {
                ...employeeData,
                branchId
            }
            console.log(credentials)
            await OwnerApi.createEmployee(credentials as newEmployee);

            setIsError(false)
            setIsMessageVisible(true)
            setMessage('Employee Created Successfully')
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

                        if (!isError) {
                            setEmployeeData(prevData => ({
                                ...prevData,
                                username: '', // Reset username to empty string
                                email: '', // Reset email to empty string
                                fullName: '', // Reset fullName to empty string
                                telephone: '', // Reset telephone to empty string
                                cpr: '', // Reset cpr to empty string
                                // Add more fields as needed
                            }));
                            setSelectedBranch('Select Branch')
                            setSelectedBusiness('Select Business')
                            setBranchId('')
                            setBranchesNames([])
                            setBranchesIds([])
                            setEmployeeData({
                                username: "",
                                email: "",
                                fullName: "",
                                telephone: "",
                                cpr: "",
                            })
                        }

                    }}

                />
            }
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.SafeAreaView}>
                <ScrollView>

                    <View style={styles.container}>

                        <TopBar title={'Employees'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={false} />
                        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            <TopBarBtn
                                buttonName='Create Employee'
                                handlePress={() => {
                                    setTransferEmployeeIsActive(prevState => false);
                                    setCreateEmployeeIsActive(prevState => true);
                                }}
                                isActive={createEmployeeIsActive}
                            />
                            <View style={{ marginRight: 10 }} />
                            <TopBarBtn
                                buttonName='Transfer Employee'
                                handlePress={() => {
                                    setCreateEmployeeIsActive(prevState => false);
                                    setTransferEmployeeIsActive(prevState => true);
                                }}
                                isActive={transferEmployeeIsActive}
                            />
                        </View>
                        <View style={styles.formBox}>



                            {createEmployeeIsActive &&
                                <>
                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Business</Text>
                                    </View>
                                    <SelectDropdownComponent
                                        options={businessNames}
                                        selectedOption={selectedBusiness}
                                        handleOptionChange={handleBusinessOptionChange}
                                    />
                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Branch</Text>
                                    </View>
                                    <SelectDropdownComponent
                                        options={branchesNames}
                                        selectedOption={selectedBranch}
                                        handleOptionChange={handleBranchOptionChange}
                                    />


                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Username</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setEmployeeData({ ...employeeData, username: updatedCredential })
                                        }}
                                        placeholder={'Username'}
                                        defaultValue={employeeData.username}

                                    />


                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Email</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setEmployeeData({ ...employeeData, email: updatedCredential })
                                        }}
                                        placeholder={'Email'}
                                        defaultValue={employeeData.email}

                                    />


                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Full Name</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setEmployeeData({ ...employeeData, fullName: updatedCredential })
                                        }}
                                        placeholder={'Full Name'}
                                        defaultValue={employeeData.fullName}

                                    />


                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Telephone</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setEmployeeData({ ...employeeData, telephone: updatedCredential })
                                        }}
                                        placeholder={'Telephone'}
                                        defaultValue={employeeData.telephone}

                                    />


                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>CPR</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setEmployeeData({ ...employeeData, cpr: updatedCredential })
                                        }}
                                        defaultValue={employeeData.cpr}
                                        placeholder={'CPR'}
                                    />
                                </>
                            }

                            <SubmitButton buttonName="Submit" handlePress={() => onSubmit()} />
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


export default ManageEmployee;