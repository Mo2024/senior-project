import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, } from 'react-native';
import { useState } from 'react';
import { StatusBar } from 'react-native';

interface MessageBoxProps {
    type: boolean;
    message: string;
    onClose: () => void;
}
const MessageBox = ({ type, message, onClose }: MessageBoxProps) => {

    const boxColor = type ? '#f8d7da' : '#d4edda'; //is error then else
    const borderColor = type ? '#f5c6cb' : '#c3e6cb';

    return (
        <Modal
            transparent
            animationType="slide"
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.messageBox, { backgroundColor: boxColor, borderColor: borderColor }]}>
                    <Text style={styles.messageText}>{message}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    messageBox: {
        padding: 16,
        borderRadius: 8,
        width: '80%',
        borderWidth: 1
    },
    messageText: {
        color: 'black',
        fontSize: 16,
        marginBottom: 8,
    },
    closeButton: {
        color: 'black',
        fontSize: 16,
        textAlign: 'right',
    },
});

export default MessageBox;