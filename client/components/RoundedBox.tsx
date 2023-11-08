import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function RoundedBox({ text, onPress, qty, isItem }: { qty?: number, isItem?: boolean, text: string, onPress: () => void }) {
    let bgColor = (qty && qty > 0 ? '#72063c' : 'gray')
    return (
        <View style={[styles.roundedBox, isItem && { backgroundColor: bgColor }, !isItem && { backgroundColor: '#72063c' }]}>
            <TouchableOpacity onPress={onPress} style={styles.touchable} activeOpacity={0.7}>
                <Text style={styles.boxText}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    roundedBox: {
        // position: 'relative',
        borderRadius: 20,
        padding: 20,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        backgroundColor: '#72063c'
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
