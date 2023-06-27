import { View, Text, Pressable, StyleSheet } from "react-native";

interface PrimaryButton {
    buttonName: string,
    handlePress: () => void
}

function SubmitButton({ buttonName, handlePress }: PrimaryButton) {
    return (
        <View style={styles.buttontOuterContainer}>
            <Pressable
                style={({ pressed }) => pressed ? [styles.buttonInnerContainer, styles.pressed] : styles.buttonInnerContainer}
                onPress={handlePress}
                android_ripple={{ color: "#640233" }}
            >
                <Text style={styles.buttonText}>{buttonName}</Text>
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
    }
});

export default SubmitButton;