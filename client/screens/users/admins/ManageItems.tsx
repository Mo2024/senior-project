import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
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
import { Category, newItem } from '../../../models/user';
import * as AdminApi from '../../../network/admin_api'
import RoundedBoxWithText from '../../../components/RoundedBoxWithText';
import mongoose from 'mongoose';
import CategoryTextBox from '../../../components/CategoryTextBox';
import SelectDropdownIndex from '../../../components/SelectDropdownIndex';
import Field from '../../../components/Field';

interface ManageItemsProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ManageItems({ navigation, route }: ManageItemsProp) {

    const [itemData, setItemData] = useState({
        name: "",
        description: "",
        price: "",
    })
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [itemsIsActive, setItemsIsActive] = useState(true)
    const [categoriesIsActive, setCategoriesIsActive] = useState(false)
    const [fetchedCategories, setFetchedCategories] = useState<Category[]>([])


    const [categoryNames, setCategoryNames] = useState([])
    const [categoryIds, setCategoryIds] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('Select a Category')
    const [selectedCategoryId, setSelectedCategoryId] = useState<mongoose.Types.ObjectId>()

    useFocusEffect(
        React.useCallback(() => {
            async function fetchLoggedInUserInfo() {
                try {
                    setIsLoading(true);

                    const fetchedCategories = await AdminApi.getCategories() as Category[]
                    setFetchedCategories(fetchedCategories)


                    const categoryNames = fetchedCategories.map(category => category.name);
                    setCategoryNames(categoryNames as any)
                    const categoryIds = fetchedCategories.map(category => category._id);
                    setCategoryIds(categoryIds as any)

                    setIsLoading(false);

                } catch (error) {
                    console.log(error)
                }
            }
            fetchLoggedInUserInfo()
        }, [])
    )

    function handleMessage(isErrorParam: boolean, isVisibleParam: boolean, message: string) {
        setIsError(isErrorParam)
        setIsMessageVisible(isVisibleParam)
        setMessage(message)
    }

    function deleteBusiness(businessId: mongoose.Types.ObjectId) {
        setFetchedCategories((prevCategories) => {
            return prevCategories.filter((category) => category._id !== businessId);
        });
    }

    async function onSubmit() {

        try {

            let credentials = { ...itemData, categoryId: selectedCategoryId }
            await AdminApi.createItem(credentials);

            setIsError(false)
            setIsMessageVisible(true)
            setMessage(`Item Created Successfully`)
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


    function handleCategoryOptionChange(index: any) {
        const selectedCategoryName = categoryNames[index as number]
        setSelectedCategory(selectedCategoryName)
        const categoryId = categoryIds[index as number]
        console.log(categoryId)
        setSelectedCategoryId(categoryId)

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
                        if (!isError) {
                            setSelectedCategory('Select a Category')
                            setItemData({
                                name: "",
                                description: "",
                                price: "",
                            })

                        }

                    }}

                />
            }
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.SafeAreaView}>
                <ScrollView>

                    <View style={styles.container}>

                        <TopBar title={(itemsIsActive ? 'Items' : 'Categories')} bgColor="rgba(0, 0, 0, 0)" navigation={navigation} navBtnVisible={false} />
                        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            <TopBarBtn
                                buttonName='Items'
                                handlePress={() => {
                                    setCategoriesIsActive(prevState => false);
                                    setItemsIsActive(prevState => true);
                                }}
                                isActive={itemsIsActive}
                            />
                            <View style={{ marginRight: 10 }} />
                            <TopBarBtn
                                buttonName='Categories'
                                handlePress={() => {
                                    setItemsIsActive(prevState => false);
                                    setCategoriesIsActive(prevState => true);
                                }}
                                isActive={categoriesIsActive}
                            />
                        </View>
                        <View style={styles.formBox}>



                            {itemsIsActive &&
                                <>
                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>Category</Text>
                                    </View>
                                    <SelectDropdownIndex
                                        options={categoryNames}
                                        selectedOption={selectedCategory}
                                        handleOptionChange={handleCategoryOptionChange}
                                    />

                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>name</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setItemData({ ...itemData, name: updatedCredential })
                                        }}
                                        placeholder={'Name'}
                                        defaultValue={itemData.name}

                                    />

                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>description</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setItemData({ ...itemData, description: updatedCredential })
                                        }}
                                        placeholder={'Description'}
                                        defaultValue={itemData.description}

                                    />

                                    <View style={styles.labelView}>
                                        <Text style={styles.Label}>price</Text>
                                    </View>
                                    <Field
                                        handleChange={(updatedCredential) => {
                                            setItemData({ ...itemData, price: updatedCredential })
                                        }}
                                        placeholder={'Price'}
                                        defaultValue={itemData.price}

                                    />
                                    <SubmitButton buttonName='Create Item' handlePress={onSubmit} />

                                </>
                            }

                            {categoriesIsActive &&
                                <>
                                    {
                                        (
                                            fetchedCategories.map((category, i) =>
                                                <React.Fragment key={i}>
                                                    <CategoryTextBox
                                                        title={category.name as string}
                                                        deleteCategoryProp={deleteBusiness}
                                                        categoryId={category._id as mongoose.Types.ObjectId}
                                                        handleMessage={handleMessage}
                                                        navigation={navigation}
                                                        route={route}
                                                    />
                                                </React.Fragment>
                                            )
                                        )
                                    }
                                    <SubmitButton buttonName='Create Category' handlePress={() => { navigation.navigate('CreateCategory') }} />

                                </>
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

export default ManageItems;