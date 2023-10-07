import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";

interface FieldProps {
    [x: string]: any
    handleChange: (text: string) => void
    // label: string
}

function Field({ handleChange, placeholder, ...props }: FieldProps) {
    return (
        <>
            <TextInput
                secureTextEntry={placeholder.includes("Password")}
                {...props}
                placeholder={placeholder}
                style={styles.FormTextInput}
                placeholderTextColor={"#72063c"}
                onChangeText={(newValue) => handleChange(newValue)}
            />
        </>

    );
}

const styles = StyleSheet.create({
    FormTextInput: {
        marginTop: 25,
        borderRadius: 100,
        color: "#72063c",
        paddingHorizontal: 10,
        width: '80%',
        height: 45,
        borderBottomColor: 'white',
        backgroundColor: 'rgb(220,220,220)'
    },
    Label: {
        color: '#72063c',
        // fontSize: 16,
        fontWeight: 'bold',
        marginBottom: -20,
        marginRight: '50%'
        // textAlign: 'left', // Align to the left

    },
});

export default Field;