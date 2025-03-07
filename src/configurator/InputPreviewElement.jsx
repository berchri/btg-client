import { Box, Checkbox, Flex, FormControl, FormLabel, Icon, IconButton, Input, InputGroup, InputRightAddon, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsGear, BsChevronRight, BsPlus, BsPencil } from "react-icons/bs";
import { useConfigurator } from "../context/configurator-context";
import { useMain } from "../context/main-context";

export default function InputPreviewElement({ property, setActive, isActive }) {
    const { getConversionFactor } = useMain()
    // const { activeSettings } = useConfigurator()
    // todo activeSettings to state?
    // console.log( 'propertySettingsList :>>', propertySettingsList )
    // debugger;
    // const activeSettings = property

    const inputName = property?.nameUI || ''

    const handleClick = (property) => {
        setActive(property)
    }

    const icon = <IconButton icon={<Icon as={BsPencil} />}
        colorScheme='swiorange'
        isRound='true' size='xs'
        fontSize='14px'
        onClick={() => handleClick(property)}
        isActive={isActive}
    />

    const formLabel =
        <FormLabel display='flex' justifyContent='space-between' mr='0' color={property.active ? 'currentColor' : 'blackAlpha.500'}>
            <Box>{inputName || property.name}</Box>
            {icon}
        </FormLabel>

    const selectedOption = () => {
        if (property) {
            return property.defaultValue ? property.values[property.defaultValue].value : property.values[0].value
        }
    }

    const defaultValue = () => {
        if (property.origin === 'Revit') {
            const [uiToBase, baseToUI] = getConversionFactor('IfcLengthMeasure', property.ifcUnit);
            return baseToUI(property.defaultValue)
        }
        return property.defaultValue
    }

    const onChange = (e) => { } // nicht löschen, wird benötigt

    return (
        <>
            {/* <Box my='4' p='0' border='2px dashed' borderColor={isActive ? 'swiorange.0' : 'blackAlpha.200'} borderRadius='md'> */}
            <Box my='4' p='0' border='2px dashed' borderColor={isActive ? 'swiorange.0' : 'blackAlpha.200'} borderRadius='md'>
                {/* <IconButton icon={<Icon as={BsPencil} />}
                    colorScheme="swiorange"
                    isRound='true' size='xs'
                    fontSize='14px'
                /> */}
                {property.values && property.ifcType !== 'IfcBoolean' &&
                    <FormControl p='4'>
                        {formLabel}
                        <InputGroup>
                            <Select name={property.name} value={selectedOption()} disabled={!property.active} onChange={onChange}
                                borderRightRadius={property.bimqType === 'Measurements' && 0}>
                                {property.values.map((e, i) =>
                                    <option key={i} value={e.value} >
                                        {e.value}
                                    </option>)}
                            </Select>
                            {property.bimqType === 'Measurements' && <InputRightAddon>{property.ifcUnitAbbr}</InputRightAddon>}
                        </InputGroup>
                        {inputName && <Text color='blackAlpha.500'>{property.name}</Text>}
                    </FormControl>
                }
                {property.ifcType === 'IfcBoolean' &&
                    <>
                        <Box p={4}>
                            <Flex justify={'space-between'}>
                                <Checkbox isChecked={property.defaultValue} disabled={!property.active}>{inputName || property.name}</Checkbox>
                                {icon}
                            </Flex>
                            {inputName && <Text color='blackAlpha.500'>{property.name}</Text>}
                        </Box>
                    </>
                }
                {!property.values && property.ifcType !== 'IfcBoolean' &&
                    <>
                        <FormControl p='4'>
                            {formLabel}
                            <InputGroup>
                                <Input type='text' name={property.name} value={defaultValue()} onChange={onChange} />
                                {property.ifcUnitAbbr && <InputRightAddon>{property.ifcUnitAbbr}</InputRightAddon>}
                            </InputGroup>
                            {inputName && <Text color='blackAlpha.500'>{property.name}</Text>}
                        </FormControl>
                    </>
                }
            </Box>


        </>
    );
};