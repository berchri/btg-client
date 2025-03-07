import { Flex, Heading, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Select, GridItem, Grid, Box, IconButton, Icon, Table, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useConfigurator } from "../context/configurator-context";
import { act } from "react";


export default function TypeName({ propList, handleSortingChange }) {
    const { propertySettingsList } = useConfigurator();
    const [index, setIndex] = useState('');

    const getList = () => {
        const l = []
        for (const prop of propList) {
            const settings = propertySettingsList.find(e => e.id === prop.id)
            let hasShortname = false
            if (settings.inputType === 'select') {
                if (settings.values.find(e => e.shortname !== '')) hasShortname = true
            }
            if (settings.inputType === 'boolean') {
                if (settings.typeNameTrue !== '' || settings.typeNameTrue !== '') hasShortname = true
            }
            if (settings.inputType === 'text') {
                if (settings.typeNameSuffix !== '') hasShortname = true
            }
            if (settings.origin === 'Revit') hasShortname = true
            l.push({ ...prop, active: settings.active, hasShortname })
        }
        return l
    }

    const [list, setList] = useState(getList());

    const onSetActive = (e) => {
        setIndex(prev => e === prev ? '' : e)
    }

    const moveItem = (direction) => {
        if (index === '') return
        let temp = [...list];
        if (direction === 'up') {
            if (index > 0) {
                let tempItem = temp[index];
                temp[index] = temp[index - 1];
                temp[index - 1] = tempItem;
                console.log('temp :>>', temp)
                handleSortingChange(temp.map(e => { return { name: e.name, id: e.id } }));
                setList(temp);
                setIndex(prev => prev - 1);
            }
        } else {
            if (index < propList.length - 1) {
                let tempItem = temp[index];
                temp[index] = temp[index + 1];
                temp[index + 1] = tempItem;
                handleSortingChange(temp.map(e => { return { name: e.name, id: e.id } }));
                setList(temp)
                setIndex(prev => prev + 1);
            }
        }
    }
    return (
        <>
            <Box p='4' w='100%' >
                <Text>Reihenfolge für Typname (Präfix_1_2_3_...)</Text>
                <Flex px='4' pt='2'  >
                    <Box px='2' py='1' >#.</Box>
                    <Box px='2' py='1' flex='1' borderLeft='1px solid' borderColor='blackAlpha.200'>Property Name</Box>
                </Flex>
                <Flex w='100%'>
                    <Flex flex='1' direction='column' width='100%' border='1px' borderRadius='md' borderColor='blackAlpha.200' p='2'>
                        {list.map((e, i) =>
                            <Flex key={i} p='1'
                                sx={{ cursor: 'pointer' }}
                                _hover={{ background: i === index ? 'swiorange.100' : 'swiorange.50' }}
                                bg={i === index ? 'swiorange.100' : ''}
                                color={!e.hasShortname && 'blackAlpha.500'}
                            >
                                <Box p='2' onClick={() => onSetActive(i)}>{(i + 1 * 1) + '.'}</Box>
                                <Box p='2' flex='1' onClick={() => onSetActive(i)} >{e.name}</Box>
                                <Box color='blackAlpha.500'>{!e.hasShortname && 'kein Wert'}</Box>
                            </Flex>
                        )}
                    </Flex>
                    <Flex p='4' direction='column' alignItems='center' >
                        <IconButton
                            icon={<Icon as={BsChevronUp} />}
                            my='2'
                            colorScheme="swiorange"
                            size='sm'
                            fontSize='18px'
                            onClick={() => moveItem('up')}
                            isDisabled={index === ''}
                        />
                        <IconButton
                            icon={<Icon as={BsChevronDown} />}
                            colorScheme="swiorange"
                            size='sm'
                            fontSize='18px'
                            onClick={() => moveItem('down')}
                            isDisabled={index === ''}
                        />
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};