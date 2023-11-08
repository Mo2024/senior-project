import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Pressable, TouchableWithoutFeedback } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton';
import SubmitButton from '../../../components/SubmitButton';
import { logout } from '../../../network/user_api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp, useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react'
import MessageBox from '../../../components/MessageBox';
import TopBar from '../../../components/TopBar';
import TopBarBtn from '../../../components/TopBarBtn';
import AppLoader from '../../../components/AppLoader';
import RoundedBox from '../../../components/RoundedBox';
import { Category } from '../../../models/user';
import newItemInBranch, * as EmployeeApi from '../../../network/employee_api'
import RoundedBoxItem2 from '../../../components/RoundedBoxItem2';
import SelectDropdownIndex from '../../../components/SelectDropdownIndex';
import Field from '../../../components/Field';


interface AddProductItemProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function AddProductItem({ navigation, route }: AddProductItemProp) {
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [fetchedItems, setFetchedItems] = useState<any[]>([])
    const { categoryId } = route.params || {};

    const [itemNames, setItemNames] = useState([])
    const [itemIds, setItemIds] = useState([])
    const [selectedItem, setSelectedItem] = useState('Select an Item')
    const [selectedItemId, setSelectedItemId] = useState('Select an Item')
    const [qty, setQty] = useState('')
    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);

                    console.log(categoryId)
                    const fetchedItems = await EmployeeApi.getItems(categoryId) as any
                    setFetchedItems(fetchedItems)


                    const itemNames = fetchedItems.map((item: { name: any; }) => item.name);
                    setItemNames(itemNames as any)
                    const itemIds = fetchedItems.map((item: { _id: any; }) => item._id);
                    setItemIds(itemIds as any)

                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchLoggedInUserInfo()
        }, [])
    )


    function handleItemOptionChange(index: any) {
        const selectedItemName = itemNames[index as number]
        setSelectedItem(selectedItemName)
        const itemId = itemIds[index as number]
        setSelectedItemId(itemId)
    }


    async function onSubmit() {

        try {

            let credentials = { itemId: selectedItemId, qty, categoryId } as any
            await EmployeeApi.addItemToBranch(credentials);
            navigation.goBack();
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

                        <TopBar title={'Stocks'} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={true} />
                        <View style={styles.formBox}>


                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Category</Text>
                            </View>
                            <SelectDropdownIndex
                                options={itemNames}
                                selectedOption={selectedItem}
                                handleOptionChange={handleItemOptionChange}
                            />

                            <View style={styles.labelView}>
                                <Text style={styles.Label}>Quantity</Text>
                            </View>
                            <Field
                                handleChange={(updatedCredential) => {
                                    setQty(updatedCredential)
                                }}
                                placeholder={'Quantity'}
                                defaultValue={qty}

                            />
                            <SubmitButton buttonName="Add Item" handlePress={onSubmit} />


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
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    addButton: {
        backgroundColor: '#72063c',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        // fontWeight: 'bold',
        textAlign: 'center',
    },

});

export default AddProductItem;