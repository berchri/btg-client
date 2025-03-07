import { Box, Checkbox, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, IconButton, Input, InputGroup, InputRightAddon, Select, Text } from "@chakra-ui/react";
import { useState } from "react";


export default function InputBoolean({ property, formData, setFormData, setShortnames }) {
    const { name, nameUI, defaultValue, changeable, typeNameTrue, typeNameFalse } = property;
    const { value, isValid } = formData[name];

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [name]: { value: !value, isValid } }))
        setShortnames(prev => ({ ...prev, [name]: !value === true ? typeNameTrue : typeNameFalse }))
    }

    return (
        <FormControl py='6'>
            <Checkbox isChecked={value} onChange={handleChange} isDisabled={!changeable}>{nameUI || name}</Checkbox>
            {nameUI && <FormHelperText>{name}</FormHelperText>}
        </FormControl>
    );
};