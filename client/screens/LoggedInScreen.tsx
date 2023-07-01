import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SubmitButton from '../components/SubmitButton';

function LoggedInScreen() {
    return (
        <View style={styles.container}>
            <Text>Is logged in!</Text>
            <SubmitButton buttonName="Submit" handlePress={() => { }} />

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