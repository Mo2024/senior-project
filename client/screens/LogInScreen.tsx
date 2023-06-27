import { StyleSheet, View, Text, TextInput } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

function LogInScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.loginTitle}>Log In</Text>
            <View style={styles.formBox}>
                <Text style={styles.formBoxTitle}>Welcome Back</Text>

                <TextInput placeholder='Username' style={styles.FormTextInput} placeholderTextColor={"#72063c"} />

            </View>
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
    loginTitle: {
        color: "#72063c",
        fontSize: 40,
        fontWeight: 'bold',
        // marginVertical: 10,
        marginTop: 50,
        padding: 0,
        flex: 1,
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
        textAlign: 'center'
    },
    FormTextInput: {
        borderRadius: 100,
        color: "#72063c",
        paddingHorizontal: 10,
        width: '80%',
        height: 45,
        borderBottomColor: 'white',
        backgroundColor: 'rgb(220,220,220)'
    }
});

export default LogInScreen;