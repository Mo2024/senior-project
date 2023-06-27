import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

function SignUpSignInScreen() {
    return (
        <View style={styles.container}>
            <PrimaryButton buttonName={"Sign In"} handlePress={() => { }} />
            <PrimaryButton buttonName={"Sign Up"} handlePress={() => { }} />
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