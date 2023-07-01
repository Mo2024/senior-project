import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface SignUpSignInScreenProps {
    navigation: NativeStackNavigationProp<any>
    route: RouteProp<any>
}
function SignUpSignInScreen({ navigation }: SignUpSignInScreenProps) {
    return (
        <View style={styles.container}>
            <PrimaryButton buttonName={"Sign In"} handlePress={() => navigation.navigate('LogInScreen')} />
            <PrimaryButton buttonName={"Sign Up"} handlePress={() => navigation.navigate('SignUpScreen')} />
            <StatusBar style="auto" />
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

export default SignUpSignInScreen;