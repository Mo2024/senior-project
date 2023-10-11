import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";

interface TopBarBtnProps {
    buttonName: string,
    handlePress: () => void,
    isActive: boolean
}

function TopBarBtn({ buttonName, handlePress, isActive }: TopBarBtnProps) {
    return (
        <View style={[styles.buttontOuterContainer, isActive ? styles.isActive : null]}>
            <Pressable
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
        // borderRadius: 28,
        // marginTop: 20,
        overflow: "hidden",
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: '5%'
    },
    isActive: {
        borderBottomWidth: 2,
        borderColor: 'grey'
    },
    buttonInnerContainer: {
        backgroundColor: 'white',
        // paddingVertical: 15,
        // width: 200,
        elevation: 2,
    },
    buttonText: {
        color: 'black',
        textAlign: 'center'
    },
    disabledButtonText: {
        color: "gray", // Customize the color for disabled text
    },
});

export default TopBarBtn;