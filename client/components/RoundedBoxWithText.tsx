import { FontAwesome } from '@expo/vector-icons';
import mongoose from 'mongoose';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

interface RoundedBoxWithTextProps {
    title: string
    subtitle: string
    deleteBusiness: () => void
}
const windowWidth = Dimensions.get('window').width;


const RoundedBoxWithText = ({ title, subtitle, deleteBusiness }: RoundedBoxWithTextProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.roundedBox}>
                <TouchableOpacity hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                    onPress={deleteBusiness} style={styles.iconButton}>
                    <FontAwesome name="trash" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    roundedBox: {
        backgroundColor: '#955375', // Change the color as needed
        borderRadius: 10,
        padding: 20,
        width: windowWidth * 0.8,
        borderColor: '#72063c',
        borderWidth: 2,
        position: 'relative', // Add this line
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff', // Change the color as needed
    },
    subtitle: {
        fontSize: 16,
        color: '#fff', // Change the color as needed
        marginTop: 10,
    },
    iconButton: {
        position: 'absolute', // Add this line
        top: 20, // Adjust top and right values as needed
        right: 20,
        borderWidth: 1,
        borderRadius: 5,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white'
    },
});


export default RoundedBoxWithText;
