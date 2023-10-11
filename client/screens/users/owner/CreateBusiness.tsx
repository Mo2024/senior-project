import { StyleSheet } from 'react-native';
import { useState } from 'react';
import * as OwnerApi from "../../../network/owner_api";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp } from '@react-navigation/native';
import AuthFormComponent from '../../../components/AuthFormBox';

interface CreateBusinessProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function CreateBusiness({ navigation }: CreateBusinessProps) {
    const [credentialsObject, setCredentialsObject] = useState<{ [key: string]: string }>({ name: '', description: '' })
    const [isError, setIsError] = useState(false);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [message, setMessage] = useState('');
    async function onSubmit(credentials: object) {
        try {
            await OwnerApi.createBusiness(credentials as OwnerApi.newBusiness);
            navigation.navigate('ManageBusinessess')
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

    let placeholderData = {
        name: "Name",
        description: "Description",

    } as { [key: string]: string }



    return (
        <AuthFormComponent
            credentialsObject={credentialsObject}
            credentialsObjectUpdate={(updatedCredentialsObject) => { setCredentialsObject(updatedCredentialsObject); console.log(credentialsObject) }}
            placeholderData={placeholderData}
            navigation={navigation}
            onSubmit={onSubmit}
            title="Create Business"
            formBoxTitle={null}
            isMessageVisible={isMessageVisible}
            isError={isError}
            message={message}
            onClose={() => {
                setIsMessageVisible(false)
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formBox: {
        backgroundColor: "#72063c",
        flex: 9,
        width: "100%",
        borderTopLeftRadius: 150,
        alignItems: 'center',
    },
    formBoxTitle: {
        marginTop: 50,
        fontSize: 35,
        color: "white",
        fontWeight: 'bold',
        textAlign: 'center',
    },
    submitBtn: {
        marginTop: 100
    },


});

export default CreateBusiness;