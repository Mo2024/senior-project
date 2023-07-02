import { View, Text, Pressable, StyleSheet } from "react-native";

interface SubmitButtonProps {
    buttonName: string,
    handlePress: () => void
    disabled?: boolean;
}

function SubmitButton({ buttonName, handlePress, disabled = false }: SubmitButtonProps) {
    return (
        <View style={styles.buttontOuterContainer}>
            <Pressable
                style={({ pressed }) =>
                    pressed ? [styles.buttonInnerContainer, styles.pressed] : styles.buttonInnerContainer
                }
                onPress={disabled ? undefined : handlePress}
                android_ripple={{ color: "#640233" }}
                disabled={disabled}
            >
                <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>
                    {buttonName}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttontOuterContainer: {
        borderRadius: 28,
        marginTop: 20,
        overflow: "hidden",
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonInnerContainer: {
        backgroundColor: 'white',
        paddingVertical: 15,
        width: 200,
        elevation: 2,
    },
    buttonText: {
        color: '#72063c',
        textAlign: 'center'
    },
    pressed: {
        opacity: 0.75
    },
    disabledButtonText: {
        color: "gray", // Customize the color for disabled text
    },
});

export default SubmitButton;