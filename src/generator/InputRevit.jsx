import { Box, Checkbox, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, IconButton, Input, InputGroup, InputRightAddon, Select, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useMain } from "../context/main-context";

export default function InputRevit({ property, formData, setFormData, setShortnames, shortnames, onBlur, handleMeasureDependencies }) {
    const { getConversionFactor } = useMain();
    const { name, nameUI, min, max, ifcUnitAbbr, ifcType, ifcUnit } = property;

    const [uiToBase, baseToUI] = getConversionFactor(ifcType, ifcUnit);
    // const [value, setValue] = useState( getDefaultValue() );
    const { value, isValid, isDisabled } = formData[name];

    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false);
        handleChange({ target: { value: value } })
    }, [property.min, property.max])

    const validation = (newValue) => {
        if (newValue === '') {
            setError(false);
            return false
        }

        let testValue = newValue.replace(',', '.');
        newValue = newValue.replace('.', ',');

        if (testValue.match(/\d+\.$/)) {
            setError('Bitte geben Sie eine gültige Zahl ein');
            return false;
        }

        if (isNaN(testValue)) {
            setError('Bitte geben Sie eine Zahl ein');
            return false;
        }

        const baseValue = uiToBase(testValue);
        if ((min && baseValue * 1 < min * 1) || max && baseValue * 1 > max * 1) {
            let uiMin = baseToUI(min) + ifcUnitAbbr
            let uiMax = baseToUI(max) + ifcUnitAbbr
            setError('nur Werte zwischen ' + uiMin + ' und ' + uiMax + ' sind möglich');
            return false;
        }
        return newValue;
    }

    const handleChange = (e) => {
        let newValue = e.target.value;

        const result = validation(newValue);
        if (result === false) {
            setFormData(prev => ({ ...prev, [name]: { value: newValue, nrValue: '', isValid: false, isDisabled } }));
            return
        }

        setError(false);
        const newFormData = { ...formData, [name]: { value: result, nrValue: uiToBase(result), isValid: true, isDisabled } };
        const newShortnames = { ...shortnames, [name]: result };
        setFormData(newFormData);
        setShortnames(newShortnames);
        handleMeasureDependencies(property, newFormData, newShortnames);
    };

    return (
        <FormControl py='6' isRequired isInvalid={error}>
            <FormLabel>{nameUI || name}</FormLabel>
            <InputGroup>
                <Input type='text'
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    isDisabled={isDisabled} />
                <InputRightAddon>{ifcUnitAbbr}</InputRightAddon>
            </InputGroup>
            {!error && nameUI && <FormHelperText>{name}</FormHelperText>}
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};