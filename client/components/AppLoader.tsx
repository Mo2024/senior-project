import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const AppLoader = () => {
    return (
        <View style={styles.container}>
            <LottieView
                style={{ width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').width * 0.8 }}
                source={require('../assets/AppLoader.json')}
                autoPlay
                loop
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
});

export default AppLoader;
