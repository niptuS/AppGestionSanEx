import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import {useThemeColor} from "@/hooks/useThemeColor";

interface NumericInputProps {
    placeholder: string;
    value: string;
    onChangeText: (value: string) => void;
}

const NumericInput: React.FC<NumericInputProps> = ({ placeholder, value, onChangeText }) => {
    const handleTextChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        onChangeText(numericValue);
    };


    const textColor = useThemeColor({}, 'text');
    const inputBackgroundColor = useThemeColor({}, 'backgroundCard');

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
                placeholder={placeholder}
                value={value}
                onChangeText={handleTextChange}
                keyboardType="numeric"
                placeholderTextColor="gray"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
});

export default NumericInput;