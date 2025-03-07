import { Box, Divider, Flex, FormControl, FormLabel, Heading, Input, Select, Switch, } from "@chakra-ui/react";
import { useConfigurator } from "../../context/configurator-context";
import { useEffect, useState } from "react";
import Form from "../Form";
import IconBimq from "../../icons/IconBimq";


export default function BooleanInputConfig({ active }) {
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

    const handleActiveToggle = (e) => {
        setData(prev => ({ ...prev, active: e.target.checked }))
        updatePropertySettingsList({ ...data, active: e.target.checked })
    }

    const handleNameToggle = (e) => {
        setActiveNameInput(prev => !prev)
        setData(prev => {
            return { ...prev, nameUI: '' }
        })
        handleChange({ target: { name: 'nameUI', value: '' } })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleChangeDefaultValue = (e) => {
        setData(prev => ({ ...prev, defaultValue: !prev.defaultValue }))
        updatePropertySettingsList({ ...data, defaultValue: !data.defaultValue })
    }

    const handleBlur = (e) => {
        updatePropertySettingsList(data)
    }
    return (
        <>
            {
                Object.keys(activeProp).length !== 0 &&
                <Form blur={handleBlur}>
                    <Flex w='100%' p='4'>
                        <Heading size={'md'} textTransform='uppercase' w='100%'>{activeProp.name}</Heading>
                        <Switch my='1' name='active' isChecked={data.active} size='md' onChange={handleActiveToggle} />
                    </Flex>
                    <Divider />
                    <FormControl pt='12' w='100%'>
                        <Box p='4'>
                            <Flex w='100%' justify='space-between'>
                                <FormLabel htmlFor='nameUI'>Name Eingabefeld</FormLabel>
                                <Switch my='1' isChecked={activeNameInput} size='md' onChange={handleNameToggle} />
                            </Flex>
                            <Input type='text' name='nameUI' value={data.nameUI} onChange={handleChange} isDisabled={!activeNameInput} />
                        </Box>
                        <Box p='4'>
                            <FormLabel>Standardwert {!data.changeable && <IconBimq />}</FormLabel>
                            <Select name="defaultValue" value={data.defaultValue} onChange={handleChangeDefaultValue} isDisabled={!data.changeable}>
                                <option value={true}>wahr (Box mit Haken)</option>
                                <option value={false}>falsch (Box ohne Haken)</option>
                            </Select>
                        </Box>
                        <Flex w='100%' >
                            <Box p='4' flex='1'>
                                <FormLabel>Typname Kurz bei True</FormLabel>
                                <Input type='text' name='typeNameTrue' value={data.typeNameTrue} onChange={handleChange} />
                            </Box>
                            <Box p='4' flex='1'>
                                <FormLabel>Typname Kurz bei False</FormLabel>
                                <Input type='text' name='typeNameFalse' value={data.typeNameFalse} onChange={handleChange} />
                            </Box>
                        </Flex>
                    </FormControl>
                </Form >
            }
        </>
    );
};