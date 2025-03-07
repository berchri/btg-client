import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, List, ListItem } from '@chakra-ui/react';

export default function AutocompleteInput({ onChange, value, name, filterEntries = true }) {
    const [isListVisible, setIsListVisible] = useState(false);

    const handleInputChange = (e) => {
        onChange(e);
        setIsListVisible(true);
    };

    const handleItemClick = (v) => {
        onChange({ target: { name: name, value: v } });
        setIsListVisible(false);
    };

    const entries = [
        'Ortbeton - bewehrt Verputzt',
        'Trockenbau - Gipsplatte',
        'Dämmung - hart',
        'Mauerwerk - Ziegel',
        'Trockenbau - Gipsplatte',
    ]

    const listItems = (entry, index) => (
        <ListItem
            key={index}
            padding="8px"
            cursor="pointer"
            _hover={{ backgroundColor: 'gray.100' }}
            onMouseDown={() => handleItemClick(entry)}
        >
            {entry}
        </ListItem>
    );


    return (
        <>
            <Box p='4' pb='170px' position="relative" width="100%">
                <FormControl >
                    <FormLabel>Revit - Material</FormLabel>
                    <Input
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onFocus={() => setIsListVisible(true)}
                        onBlur={() => setIsListVisible(false)}
                    />
                    {isListVisible && (
                        <List
                            position="absolute"
                            p='3'
                            width="100%"
                            maxHeight="150px"
                            overflowY="auto"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                            bg="white"
                            zIndex="1"
                        >
                            {filterEntries
                                ? (value === ''
                                    ? entries.map((entry, index) => listItems(entry, index))
                                    : entries
                                        .filter((entry) =>
                                            entry.toLowerCase().includes(value.toLowerCase())
                                        )
                                        .map((entry, index) => listItems(entry, index)))
                                : entries.map((entry, index) => listItems(entry, index))}

                        </List>
                    )}
                </FormControl>
            </Box>

        </>
    );
};