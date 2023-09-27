import SelectDropdown from 'react-native-select-dropdown'
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome'

interface SelectDropdownProps {
    options: string[]
    selectedOption: string
    handleOptionChange: (selectedItem: string) => void
}
const SelectDropdownComponent = ({ options, selectedOption, handleOptionChange }: SelectDropdownProps) => {
    const dropdownStyle = {
        borderRadius: 100,
        color: '#72063c',
        width: '80%',
        height: 45,
        borderBottomColor: 'white',
        backgroundColor: 'rgb(220,220,220)',
        marginTop: 25,
    };



    return (
        <SelectDropdown
            data={options}
            onSelect={(selectedItem: string) => handleOptionChange(selectedItem)}
            defaultButtonText={selectedOption}
            buttonStyle={dropdownStyle}
            buttonTextStyle={{ color: '#72063c' }}
            dropdownStyle={{ borderRadius: 20, backgroundColor: 'white' }}
            rowStyle={{ backgroundColor: 'rgb(220,220,220)' }}
            renderDropdownIcon={() => (
                <FontAwesome
                    name="angle-down"
                    size={24}
                    color="black"
                />
            )}
        />);
}

export default SelectDropdownComponent;