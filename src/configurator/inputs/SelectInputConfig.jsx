import React, { useEffect, useState } from "react";
import Decimal from 'decimal.js';
import { useConfigurator } from "../../context/configurator-context";
import { Box, Checkbox, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Heading, HStack, Icon, IconButton, Input, Select, Spacer, Stack, Switch, Text } from "@chakra-ui/react";
import { BsArrowReturnRight } from "react-icons/bs";
import StarIcon from "../StarIcon";
import Form from "../Form";
import { useMain } from "../../context/main-context";
import IconBimq from "../../icons/IconBimq";
import { useRelations } from "../../context/relations-context";
import SelectRelation from "./SelectRelation";
import InputWithTags from "./InputWithTags";

export default function SelectInputConfig({ active }) {
    const { updatePropertySettingsList, getActiveSettings } = useConfigurator();
    const { getPossibleDependencies, getInfluenceList, setInfluence, removeInfluence } = useRelations();

    const { getUnitsList } = useMain();

    const [activeProp, setActiveProp] = useState({});
    const [data, setData] = useState({});
    const [error, setError] = useState([]);
    const [activeNameInput, setActiveNameInput] = useState(false);
    const [unitsList, setUnitsList] = useState([]);
    const [possibleDependencies, setPossibleDependencies] = useState([]);
    const [relations, setRelations] = useState([]);
    const [checkboxes, setCheckboxes] = useState([]);

    useEffect(() => {
        setActiveProp({ ...active });
        // console.log( 'active :>>', active )
        const settings = getActiveSettings(active)
        const newData = { ...settings }
        if (newData.inputType === 'select') {
            newData.values = newData.values.map(e => ({ ...e, nrValue: e.nrValue.toString().replace('.', ',') }))
        }
        setData(newData);
        setError(() => {
            const errors = settings.values.map(() => false);
            return { nrValue: errors, shortname: errors }
        })
        setActiveNameInput(settings.nameUI !== '');
        setUnitsList(settings.bimqType === 'Measurements' ? getUnitsList(settings.ifcType) : [])

        const possibleDependencyPropList = getPossibleDependencies('selectToSelect', settings)
        console.log('possibleDependencyPropList :>>', possibleDependencyPropList)
        const influenceList = getInfluenceList('selectToSelect', settings.id)

        setPossibleDependencies([...possibleDependencyPropList])
        setRelations([...influenceList])
        setCheckboxes(possibleDependencyPropList.map(e => influenceList.some(i => i.to === e.id)))
    }, [active]);

    console.log('possibleDependencies :>>', possibleDependencies)
    console.log('checkboxes :>>', checkboxes)

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

    const validation = (newValue, index) => {
        setError(prev => {
            const newError = { ...prev }
            newError.nrValue[index] = false
            return newError
        })

        if (newValue === '') return newValue

        let testValue = newValue.replace(',', '.');
        newValue = newValue.replace('.', ',');

        if (testValue.match(/\d+\.$/) || isNaN(testValue)) {
            setError(prev => {
                const newError = { ...prev }
                newError.nrValue[index] = 'Bitte geben Sie eine Zahl ein'
                return newError
            });
            return newValue;
        }
        return newValue;
    }

    const handlePropValueChange = (e, index) => {
        let { name, value } = e.target;
        name = name.split('_')[0]
        if (name === 'nrValue') {
            value = validation(value, index);
        }
        setData(prev => {
            const newValues = [...prev.values]
            newValues[index] = { ...newValues[index], [name]: value }
            return { ...prev, values: newValues }
        })
    };

    const handleSetDefaultProp = (index) => {
        setData(prev => {
            return { ...prev, defaultValue: index }
        })
        updatePropertySettingsList({ ...data, defaultValue: index })
    }

    const handleAdoptValues = (name) => {
        let newValues = data.values.map((e, i) => ({
            ...e, [name]: activeProp.values[i].value
        }))
        if (name === 'nrValue') {
            newValues = newValues.map((e, i) => {
                const value = validation(e.nrValue, i);
                return { ...e, nrValue: value }
            })
        }
        setData(prev => {
            return { ...prev, values: [...newValues] }
        })
    }

    const handleUnitChange = (e) => {
        const u = unitsList[e.target.selectedIndex]
        const unitChange = {
            ifcUnit: u.name,
            ifcUnitAbbr: u.abbr,
            ifcUnitFactor: u.factor,
            values: data.values.map(e => ({ ...e, value: Decimal.mul(e.nrValue, u.factor).toNumber() }))
        }

        setData({ ...data, ...unitChange })
        updatePropertySettingsList({ ...data, ...unitChange })
        setActiveProp({ ...activeProp, ...unitChange })
    }

    const rows = () => activeProp.values.length * 1
    const columns = !activeProp.numberType ? 3 : 2

    const handleBlur = (e) => {
        const hasError = Object.values(error).some(list => list.some(e => e !== false))
        if (hasError) return

        let values = data.values
        if (data.inputType === 'select') {
            values = data.values.map((e, i) => ({ ...e, nrValue: Number(e.nrValue.replace(',', '.')) }))
        }
        updatePropertySettingsList({ ...data, values })
    }

    const handleCheckboxChange = (event, prop, type, index) => {
        const newCheckboxes = [...checkboxes]
        newCheckboxes[index] = event.target.checked
        setCheckboxes(newCheckboxes)

        // if (event.target.checked) {
        //     const relation = {
        //         from: prop.id,
        //         to: activeProp.id,
        //         relations: [{ selectedIndex: 'xxxx', disabled: [0, 2] }]
        //     }
        //     setInfluence('selectToSelect', relation)
        // } else {
        //     removeInfluence('selectToSelect', prop.id, activeProp.id)
        // }
    }

    const handleRelationChange = (relation) => { }
    console.log(activeProp)
    return (
        <>
            {Object.keys(activeProp).length !== 0 &&
                <Form blur={handleBlur}>
                    {/* <Heading size={'md'} p='4' textTransform='uppercase' w='100%'>{activeProp.name}{icon}</Heading> */}
                    <Flex w='100%' p='4' justify={'space-between'}>
                        <Heading size={'md'} textTransform='uppercase'>{activeProp.name}</Heading>
                        <Stack align='center' direction='row'>
                            {/* <Text>inaktiv</Text> */}
                            <Switch my='1' name='active' isChecked={data.active} size='md' onChange={handleActiveToggle} />
                            {/* <Text>aktiv</Text> */}
                        </Stack>
                    </Flex>
                    <Divider />
                    <FormControl p='4' pt='12'>
                        <Flex w='100%' justify='space-between'>
                            <FormLabel>Name Eingabefeld</FormLabel>
                            <Switch my='1' name='active' isChecked={activeNameInput} size='md' onChange={handleNameToggle} />
                        </Flex>
                        <Input type='text' name='nameUI' value={data.nameUI} onChange={handleChange} isDisabled={!activeNameInput} />
                    </FormControl>
                    {data.numberType && <>
                        <Flex w='100%' p='4' justify='space-between'>
                            <Box w='45%'>
                                <FormControl>
                                    <FormLabel>Typ <IconBimq /></FormLabel>
                                    <Select name="ifcType" value='' disabled={true} >
                                        <option value=''>{data.ifcType}</option>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box w='45%'>
                                <FormControl>
                                    <FormLabel>Einheit {!data.ifcUnitChangeable && <IconBimq />}</FormLabel>
                                    <Select name="ifcUnit" value={data.ifcUnit} disabled={!data.ifcUnitChangeable} onChange={handleUnitChange}>
                                        {data.bimqType === 'Datatypes' && <option value=''>-</option>}
                                        {unitsList.length > 0 && unitsList.map((u, i) =>
                                            <option key={i} value={u.name} >
                                                {u.abbr}
                                            </option>)}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Flex>
                    </>
                    }


                    {/* <Flex w='100%' direction='column' py='6'>
                </Flex> */}
                    <Grid
                        w='100%'
                        // h='100%'
                        p='4'
                        templateColumns={`2fr repeat(${columns - 1}, 1fr)`}
                        templateRows={`repeat(${rows() + 1}, minmax(1fr, auto))`}
                        alignItems={'end'}
                        gap='2'
                        my='6'
                    >
                        <GridItem colSpan='1' rowSpan='1' p='2'>
                            Werteliste <IconBimq />
                        </GridItem>
                        {columns === 3 &&
                            <GridItem colSpan='1' rowSpan='1' p='2'>
                                Zahlenwert für Abmessungen (m, optional)
                            </GridItem>}
                        <GridItem colSpan='1' rowSpan='1' p='2'>
                            Typname Kurzbezeichnung
                        </GridItem>
                        {activeProp.values.map((e, i) =>
                            <React.Fragment key={i}>
                                <GridItem display='flex' h='2.5rem' alignItems='center' colSpan='1' rowSpan='1' border='1px' borderRadius='md' borderColor='blackAlpha.200'>
                                    <StarIcon active={data.defaultValue === i} onClick={() => handleSetDefaultProp(i)} />
                                    <Box flex='1' p='2' >{e.value}</Box>
                                </GridItem>
                                {columns === 3 &&
                                    <GridItem colSpan='1' rowSpan='1' >
                                        <FormControl isInvalid={error.nrValue[i]}>
                                            <Input
                                                type='text'
                                                name={'nrValue_' + i}
                                                value={data.values[i].nrValue}
                                                onChange={(e) => { handlePropValueChange(e, i) }}
                                            />
                                            {error.nrValue[i].length > 0 && <FormErrorMessage>{error.nrValue[i]}</FormErrorMessage>}
                                        </FormControl>
                                    </GridItem>}
                                <GridItem alignSelf={'stretch'} colSpan='1' rowSpan='1' >
                                    <FormControl >
                                        <Input
                                            type='text'
                                            name={'shortname_' + i}
                                            value={data.values[i].shortname}
                                            onChange={(e) => { handlePropValueChange(e, i) }}
                                        />
                                    </FormControl>
                                </GridItem>
                            </React.Fragment>
                        )}
                        <GridItem colSpan='1' rowSpan='1' p='2'><Text textAlign='right'>Werte Übernehmen</Text></GridItem>
                        {columns === 3 &&
                            <GridItem colSpan='1' rowSpan='1' p='2'>
                                <IconButton
                                    // icon={<Icon as={BsBoxArrowInRight} />}
                                    icon={<Icon as={BsArrowReturnRight} />}
                                    colorScheme='swiorange'
                                    variant='outline'
                                    isRound='true'
                                    size='xs'
                                    fontSize='16px'
                                    onClick={() => handleAdoptValues('nrValue')}
                                />
                            </GridItem>}
                        <GridItem colSpan='1' rowSpan='1' p='2'>
                            <IconButton
                                icon={<Icon as={BsArrowReturnRight} />}
                                colorScheme="swiorange"
                                variant='outline'
                                isRound='true'
                                size='xs'
                                fontSize='16px'
                                onClick={() => handleAdoptValues('shortname')}
                            />
                        </GridItem>
                    </Grid>
                    <Heading size='sm' p='4'>Abhängigkeiten</Heading>
                    <Stack p='4' w='100%'>
                        {
                            possibleDependencies.map((prop, i) =>
                                <Box key={i} border='1px' borderColor='blackAlpha.200' borderRadius='md'>
                                    <HStack p='3' spacing='5'                                     >
                                        <Checkbox name={`relation_${i}`}
                                            value={true}
                                            isChecked={checkboxes[i]}
                                            onChange={(event) => handleCheckboxChange(event, prop, 'value', i)}
                                        />
                                        <Text>{prop.name}</Text>
                                    </HStack>
                                    {checkboxes[i] && <SelectRelation
                                        from={activeProp}
                                        to={prop}
                                        handleRelationChange={handleRelationChange}
                                    />}
                                </Box>
                            )
                        }
                    </Stack>
                    <SelectRelation
                        from={activeProp}
                        to={possibleDependencies[0]}
                        handleRelationChange={handleRelationChange}
                    />
                </Form>
            }
        </>
    );
};