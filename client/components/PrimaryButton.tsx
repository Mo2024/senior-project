import { View, Text, Pressable, StyleSheet } from "react-native";

interface PrimaryButton {
    buttonName: string,
    handlePress: () => void,
}

function PrimaryButton({ buttonName, handlePress: handleSignUpButton }: PrimaryButton) {
    return (
        <View style={styles.buttontOuterContainer}>
            <Pressable style={({ pressed }) => pressed ? [styles.buttonInnerContainer, styles.pressed] : styles.buttonInnerContainer} onPress={handleSignUpButton} android_ripple={{ color: "#640233" }}>
                <Text style={styles.buttonText}>{buttonName}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttontOuterContainer: {
        borderRadius: 28,
        margin: 4,
        overflow: "hidden",
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonInnerContainer: {
        backgroundColor: '#72063c',
        paddingVertical: 15,
        width: 250,
        elevation: 2,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    },
    pressed: {
        opacity: 0.75
    }
});

export default PrimaryButton;