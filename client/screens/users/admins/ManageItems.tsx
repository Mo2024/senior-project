import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton';
import SubmitButton from '../../../components/SubmitButton';
import { logout } from '../../../network/user_api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp } from '@react-navigation/native';
import { useState } from 'react'
import MessageBox from '../../../components/MessageBox';
import TopBar from '../../../components/TopBar';
import TopBarBtn from '../../../components/TopBarBtn';

interface ManageItemsProp {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function ManageItems({ navigation }: ManageItemsProp) {

    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');

    const [itemsIsActive, setItemsIsActive] = useState(true)
    const [categoriesIsActive, setCategoriesIsActive] = useState(false)

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



                                </>
                            }

                            {categoriesIsActive &&
                                <>

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