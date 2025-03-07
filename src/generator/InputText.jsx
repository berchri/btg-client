import { Box, Checkbox, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, IconButton, Input, InputGroup, InputRightAddon, Select, Text } from "@chakra-ui/react";
import { useState } from "react";


export default function InputText({ property, formData, setFormData, setShortnames }) {
    const { name, nameUI, length, defaultValue, typeNameSuffix } = property;
    const { value, isValid } = formData[name];

    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [name]: { value: e.target.value, isValid } }))
        if (typeNameSuffix) {
            setShortnames(prev => ({ ...prev, [name]: e.target.value }))
        }
    }

    return (
        <FormControl py='6' isInvalid={error}>
            <FormLabel >{nameUI || name}</FormLabel >
            <Input type='text' name={name} maxLength={length} value={value} onChange={handleChange} />
            {!error && nameUI && <FormHelperText>{name}</FormHelperText>}
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};