import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import TopBar from '../../../components/TopBar';
import MessageBox from '../../../components/MessageBox';
import React, { useState } from 'react';
import * as OwnerApi from "../../../network/owner_api";
import { Branch, Businesses } from '../../../models/user';
import mongoose from 'mongoose';
import RoundedBoxWithText from '../../../components/RoundedBoxWithText';
import AppLoader from '../../../components/AppLoader';
import TopBarBtn from '../../../components/TopBarBtn';
import SubmitButton from '../../../components/SubmitButton';
import * as SecureStore from 'expo-secure-store';
import RoundedBoxBranch from '../../../components/RoundedBoxBranch';

interface ManageBranchesProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ManageBranches({ navigation, route }: ManageBranchesProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [currentSubScreen, setCurrentSubScreen] = useState('viewBusiness');
    const [isLoading, setIsLoading] = useState(true);
    const [businessIdState, setBusinessId] = useState<mongoose.Types.ObjectId>();
    // const [fetchedBusinessess, setFetchedBusinessess] = useState<Businesses>([])
    const [fetchedBranches, setFetchedBranches] = useState<Branch[]>([])
    const [branchesState, setBranches] = useState<Branch[]>([])
    const { businessId } = route.params || {};

    useFocusEffect(
        React.useCallback(() => {
            async function fetchBranches() {
                try {
                    setIsLoading(true);
                    setBusinessId((prevBusinessIdState) => {
                        if (!prevBusinessIdState) {
                            return businessId;
                        }
                        return prevBusinessIdState;
                    });
                    console.log(businessIdState)
                    if (fetchedBranches.length === 0) {
                        const fetchedBranchesApi = await OwnerApi.getBranches(businessIdState as mongoose.Types.ObjectId) as Branch[]
                        setFetchedBranches(fetchedBranchesApi)
                    }
                    const newBranchInfo = await SecureStore.getItemAsync('newBranchInfo');
                    if (newBranchInfo) {
                        const newBranch = JSON.parse(newBranchInfo);
                        setFetchedBranches([...fetchedBranches, newBranch])
                        await SecureStore.deleteItemAsync('updatedBusiness');
                    }

                    setBranches(fetchedBranches)

                    // const editedInfoString = await SecureStore.getItemAsync('updatedBusiness');
                    // if (editedInfoString) {
                    //     const editedInfo = JSON.parse(editedInfoString);
                    //     updateBusinessState(editedInfo.name, editedInfo.description, editedInfo.businessId)
                    //     await SecureStore.deleteItemAsync('updatedBusiness');
                    // }

                    // setBusinessess(fetchedBusinessess)

                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchBranches()
        }, [fetchedBranches, businessIdState])
    )

    // function updateBranchState(newName: string, newDesc: string, branchId: mongoose.Types.ObjectId) {
    //     setBranches((prevBusinesses) => {
    //         return prevBusinesses.map((branch) => {
    //             if (branch._id === branchId) {
    //                 branch.name = newName;
    //                 branch.description = newDesc;
    //             }
    //             return branch;
    //         });
    //     });
    // }

    function deleteBranch(branchId: mongoose.Types.ObjectId) {
        setBranches((prevBranches) => {
            return prevBranches.filter((branch) => branch._id !== branchId);
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
                        <TopBar title={'Branches'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>
                            {currentSubScreen == 'viewBusiness' &&

                                (
                                    branchesState.map((branch, i) =>
                                        <React.Fragment key={i}>
                                            <RoundedBoxBranch
                                                title={branch.name as string}
                                                deleteBranchProp={deleteBranch}
                                                handleMessage={handleMessage}
                                                branchId={branch._id as mongoose.Types.ObjectId}
                                                navigation={navigation}
                                                route={route}
                                            />
                                        </React.Fragment>
                                    )
                                )
                            }
                            <SubmitButton buttonName='Create Branch' handlePress={() => { setFetchedBranches([]); navigation.navigate('CreateBranch', { businessId: businessIdState }) }} />

                            {currentSubScreen == 'createBusiness' &&

                                (
                                    <>
                                        <AppLoader />
                                    </>
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

export default ManageBranches;