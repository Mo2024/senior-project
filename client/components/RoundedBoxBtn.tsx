import mongoose from "mongoose";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface roundedBoxBtnProps {
    buttonName: string,
    handlePress: () => void
}

function RoundedBoxBtn({ buttonName, handlePress }: roundedBoxBtnProps) {
    return (
        <View style={styles.buttontOuterContainer}>
            <Pressable
                style={({ pressed }) =>
                    pressed ? [styles.buttonInnerContainer, styles.pressed] : styles.buttonInnerContainer
                }
                onPress={handlePress}
                android_ripple={{ color: "#640233" }}
            >
                <Text style={[styles.buttonText]}>
                    {buttonName}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttontOuterContainer: {
        borderRadius: 28,
        // marginTop: 20,
        overflow: "hidden",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2.5%',
        // borderWidth: 1,
        // borderColor: '#72063c',
    },
    buttonInnerContainer: {
        backgroundColor: 'white',
        paddingVertical: 10,
        width: 200,
        elevation: 2,
        borderRadius: 28,

    },
    buttonText: {
        color: '#72063c',
        textAlign: 'center'
    },
    pressed: {
        opacity: 0.75,
    },
    disabledButtonText: {
        color: "gray", // Customize the color for disabled text
    },
});

export default RoundedBoxBtn;