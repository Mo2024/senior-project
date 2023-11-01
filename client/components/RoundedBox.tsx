import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function RoundedBox({ text, onPress }: { text: string, onPress: () => void }) {
    return (
        <View style={styles.roundedBox}>
            <TouchableOpacity onPress={onPress} style={styles.touchable} activeOpacity={0.7}>
                <Text style={styles.boxText}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    roundedBox: {
        // position: 'relative',
        backgroundColor: '#72063c',
        borderRadius: 20,
        padding: 20,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
    },
    touchable: {
        // ...StyleSheet.absoluteFillObject,
    },
    boxText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default RoundedBox;
