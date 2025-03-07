import { Box, Checkbox, Divider, Flex, FormControl, FormLabel, Heading, Input, Switch } from "@chakra-ui/react";
import { useConfigurator } from "../../context/configurator-context";
import React, { useEffect, useState } from "react";
import Form from "../Form";


export default function NumberInputConfig({ active }) {
    const { updatePropertySettingsList, getActiveSettings } = useConfigurator();

    const [activeProp, setActiveProp] = useState({});
    const [data, setData] = useState({});
    const [activeNameInput, setActiveNameInput] = useState(false);

    useEffect(() => {
        setActiveProp({ ...active });
        const settings = getActiveSettings(active) // settings anlegen über kontext
        setData({ ...settings });
        setActiveNameInput(settings.nameUI !== '');
    }, [active]);


    const handleInputToggle = (input) => {
        if (input === 'nameUI') setActiveNameInput(prev => !prev)
        setData(prev => {
            return { ...prev, [input]: '' }
        })
        handleChange({ target: { name: input, value: '' } })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleBlur = (e) => {
        updatePropertySettingsList(data)
    }

    return (
        <>
            {
                Object.keys(activeProp).length !== 0 &&
                <Form blur={handleBlur}>
                    <Box w='100%' p='4'>
                        <Heading size={'md'} textTransform='uppercase' w='100%'>{activeProp.name}</Heading>
                    </Box>
                    <Divider />
                    <FormControl pt='12' w='100%'>
                        <Box p='4'>
                            <Flex w='100%' justify='space-between'>
                                <FormLabel>Name Eingabefeld</FormLabel>
                                <Switch my='1' isChecked={activeNameInput} size='md' onChange={() => handleInputToggle('nameUI')} />
                            </Flex>
                            <Input type='text' name='nameUI' value={data.nameUI} onChange={handleChange} isDisabled={!activeNameInput} />
                        </Box>
                        <Flex w='100%' justify='space-between'>
                            <Box w='50%' p='4'>
                                <FormLabel >Anzahl der Zeichen</FormLabel>
                                <Input type='text' name='length' value={data.length} onChange={handleChange} />
                            </Box>
                            <Flex w='50%' justify='space-between' p='4'>
                                <FormLabel textAlign='right'>Eingabe an Typnamen anhängen</FormLabel>
                                <Switch
                                    my='1'
                                    name="typeNameSuffix"
                                    isChecked={data.typeNameSuffix}
                                    size='md'
                                    onChange={() => handleChange({ target: { name: 'typeNameSuffix', value: !data.typeNameSuffix } })}
                                />
                            </Flex>
                        </Flex>
                    </FormControl>
                </Form >
            }
        </>
    );
};