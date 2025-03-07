import { Box, Checkbox, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, IconButton, Input, InputGroup, InputRightAddon, Select, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useGenerator } from "../context/generator-context";
import { useMain } from "../context/main-context";

export default function InputNumber({ property, formData, setFormData, setShortnames, shortnames, onBlur, handleMeasureDependencies }) {
    const { getConversionFactor } = useMain();
    const { name, nameUI, min, max, equalToMin, equalToMax, ifcUnitAbbr, defaultValue, ifcType, ifcUnit } = property;
    const { value, isValid, isDisabled } = formData[name];
    const [uiToBase, baseToUI] = getConversionFactor(ifcType, ifcUnit);
    const [error, setError] = useState(false);

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

        if (property.numberType === 'integer') {
            if (!newValue.match(/^\d+$/)) {
                setError('Nur Ganze Zahlen sind Möglich');
                return false;
            }
        }

        if (isNaN(testValue)) {
            setError('Bitte geben Sie eine Zahl ein');
            return false;
        }

        const baseValue = uiToBase(testValue);
        if (min !== '' || max !== '') {
            const lowerLimit = min === '' ? -Infinity : Number(min)
            const upperLimit = max === '' ? Infinity : Number(max)

            if (min === -Infinity && max === Infinity) return newValue;

            const exceedsUpper = equalToMax ? upperLimit < baseValue : upperLimit <= baseValue
            const exceedsLower = equalToMin ? lowerLimit > baseValue : lowerLimit >= baseValue

            const maxUI = (equalToMax ? '≤' : '<') + baseToUI(max) + (ifcUnitAbbr || '')
            const minUI = (equalToMin ? '≥' : '>') + baseToUI(min) + (ifcUnitAbbr || '')

            if (exceedsUpper || exceedsLower) {
                if (exceedsLower && upperLimit === Infinity) {
                    setError('nur Werte größer als ' + minUI + ' sind möglich');
                    return false;
                }
                if (exceedsUpper && lowerLimit === -Infinity) {
                    setError('nur Werte kleiner als ' + maxUI + ' sind möglich');
                    return false;
                }
                setError('nur Werte zwischen ' + minUI + ' und ' + maxUI + ' sind möglich');
                return false;
            }
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
                    isDisabled={isDisabled}
                />
                {ifcUnitAbbr && <InputRightAddon>{ifcUnitAbbr}</InputRightAddon>}
            </InputGroup>
            {!error && nameUI && <FormHelperText>{name}</FormHelperText>}
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};