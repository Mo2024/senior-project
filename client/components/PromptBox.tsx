import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, } from 'react-native';
import { useState } from 'react';
import { StatusBar, TextInput } from 'react-native';
import Field from './Field';

interface MessageBoxProps {
    onClose: () => void;
    onSubmit: () => void;
    handleChange: (text: string) => void
    placeholder: string
}
const PromptBox = ({ onSubmit, handleChange, placeholder, onClose }: MessageBoxProps) => {

    const boxColor = 'white'; //is error then else
    const borderColor = '#72063c';
    return (
        <Modal
            transparent
            animationType="slide"
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.messageBox, { backgroundColor: boxColor, borderColor: borderColor }]}>
                    <View style={styles.labelView}>
                        <Text style={styles.Label}>{placeholder}</Text>
                    </View>
                    <TextInput
                        onChangeText={(newValue) => handleChange(newValue)}
                        placeholder={placeholder}
                        defaultValue={''}
                        style={styles.FormTextInput}
                        placeholderTextColor={"black"}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.button}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onSubmit} style={styles.button}>
                            <Text style={styles.closeButton}>Submit</Text>
                        </TouchableOpacity>
                    </View>
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
        color: '#72063c',
        fontSize: 16,
        textAlign: 'center',
    },
    Label: {
        color: '#72063c',
        fontWeight: 'bold'

    },
    labelView: {
        width: '75%'
    },
    FormTextInput: {
        marginBottom: 10,
        borderRadius: 100,
        color: "black",
        paddingHorizontal: 10,
        // width: '80%',
        height: 45,
        borderBottomColor: 'white',
        backgroundColor: 'rgb(220,220,220)'
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
    },
});

export default PromptBox;