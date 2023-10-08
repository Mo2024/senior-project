import { StyleSheet, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface TopBarProps {
    navigation: NativeStackNavigationProp<any>,
    title: string,
    navBtnVisible: boolean,
    bgColor: string

}
const TopBar = ({ navBtnVisible, navigation, title, bgColor }: TopBarProps) => {

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.topContainer}>
            {
                navBtnVisible &&

                <FontAwesome.Button
                    name='arrow-left'
                    backgroundColor={bgColor}
                    color="rgb(0,0,0)"
                    onPress={goBack}
                    size={32}
                    style={styles.topLeftContainer}
                    underlayColor='transparent'
                />
            }
            <Text style={[styles.loginTitle, navBtnVisible ? styles.visibleRight : null]}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    loginTitle: {
        color: "#72063c",
        fontSize: 40,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    visibleRight: {
        right: 25

    },
    topContainer: {
        // marginTop: '10%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'black'
    },
    topLeftContainer: {
        position: 'relative',
        left: 0,
    }

});

export default TopBar;