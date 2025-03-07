import { Flex, Heading, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Select, GridItem, Grid, Box, IconButton, Icon, Table, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useConfigurator } from "../context/configurator-context";


export default function TableHeaders({ propList, formData, handleSortingChange, handleHeaderValueChange }) {
    const { propertySettingsList } = useConfigurator();

    const getList = () => {
        const l = propList.map(e => {
            const settings = propertySettingsList.find(so => so.id === e.id)

            return { ...e, active: settings.active }
        })
        return l
    }

    const [index, setIndex] = useState('');
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
                handleSortingChange(temp.map(e => { return { name: e.name, id: e.id, value: e.value } }));
                console.log('temp :>>', temp)
                setList(temp);
                setIndex(prev => prev - 1);
            }
        } else {
            if (index < list.length - 1) {
                let tempItem = temp[index];
                temp[index] = temp[index + 1];
                temp[index + 1] = tempItem;
                handleSortingChange(temp.map(e => { return { name: e.name, id: e.id, value: e.value } }));
                setList(temp);
                setIndex(prev => prev + 1);
            }
        }
    }

    const handleChange = (e, i) => {
        setList(prev => {
            const temp = [...prev];
            temp[i].value = e.target.value;
            return temp
        })
        handleHeaderValueChange(i, e.target.value)
    }
    return (
        <>
            <Box p='4' w='100%'>
                <Text>Tabellenspalten benennen und anordnen</Text>
                <Flex px='4' pt='2'  >
                    <Box px='2' py='1' >#.</Box>
                    <Box px='2' py='1' flex='1' borderLeft='1px solid' borderColor='blackAlpha.200'>Property Name</Box>
                    <Box px='2' py='1' flex='1' borderLeft='1px solid' borderColor='blackAlpha.200'>Name im Tabellenkopf</Box>
                    <Box px='2' py='1' flex='0 0 64px'></Box>
                </Flex>
                <Flex w='100%'>
                    <Flex flex='1' direction='column' width='100%' border='1px' borderRadius='md' borderColor='blackAlpha.200' p='2'>
                        {list.map((e, i) =>
                            <Flex key={i} p='1'
                                sx={{ cursor: 'pointer' }}
                                _hover={{ background: i === index ? 'swiorange.100' : 'swiorange.50' }}
                                bg={i === index ? 'swiorange.100' : ''}
                                color={!e.active && 'blackAlpha.500'}
                            >
                                <Box userSelect='none' p='2' onClick={() => onSetActive(i)}>{(i + 1 * 1) + '.'}</Box>
                                <Box userSelect='none' p='2' flex='1' onClick={() => onSetActive(i)}>{e.name}</Box>
                                <FormControl flex='1'>
                                    <Input
                                        type='text'
                                        name={'tableHeaders_' + i}
                                        // value={formData.tableHeaders[i].value}
                                        value={e.value}
                                        onChange={(e) => handleChange(e, i)}
                                        onFocus={() => onSetActive('')}
                                        isDisabled={!e.active}
                                    />
                                </FormControl>
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