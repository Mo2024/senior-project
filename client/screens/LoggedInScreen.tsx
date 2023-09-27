import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SubmitButton from '../components/SubmitButton';
import { logout } from '../network/user_api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, RouteProp } from '@react-navigation/native';


interface LoggedInScreenProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}

function LoggedInScreen({ navigation }: LoggedInScreenProps) {

    function logoutBtn() {
        logout()
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'SignUpSignInScreen' }],
            })
        );
    }
    return (
        <View style={styles.container}>
            <Text>Is logged in!</Text>
            <SubmitButton buttonName="Submit" handlePress={() => { logoutBtn() }} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoggedInScreen;