import { Box, Checkbox, Divider, Flex, FormControl, FormLabel, Grid, GridItem, Heading, Input, InputGroup, InputRightAddon, Select, Stack, Switch, Text } from "@chakra-ui/react";
import { useConfigurator } from "../../context/configurator-context";
import React, { useEffect, useState } from "react";
import Form from "../Form";
import { useMain } from "../../context/main-context";
import { useRelations } from "../../context/relations-context";


export default function RevitInputConfig({ active }) {
    const { getConversionFactor, getUnitsList } = useMain();
    const { relations, getPossibleDependencies, getInfluenceList, setInfluence, removeInfluence } = useRelations();

    const units = getUnitsList('IfcLengthMeasure');

    const { updatePropertySettingsList, getActiveSettings, propertySettingsList } = useConfigurator();

    const [activeProp, setActiveProp] = useState({});
    const [data, setData] = useState({});
    const [activeNameInput, setActiveNameInput] = useState(false);
    const [influencingProperties, setInfluencingProperties] = useState([])
    const [checkboxState, setCheckboxState] = useState([])

    useEffect(() => {
        const settings = getActiveSettings(active) // settings anlegen über kontext

        const possibleDependencyPropList = getPossibleDependencies('valueToTarget', settings)
        console.log('possibleDependencyPropList :>>', possibleDependencyPropList)
        const influenceList = getInfluenceList('valueToTarget', settings.id)

        const newCheckboxState = possibleDependencyPropList.map((prop, i) => {
            const influence = influenceList.find(e => e.from === prop.id)
            const cb = { value: false, min: false, max: false }
            if (influence && cb.hasOwnProperty(influence.type)) {
                cb[influence.type] = true
            }
            return cb
        })

        const [uiToBase, baseToUI] = getConversionFactor('IfcLengthMeasure', settings.ifcUnit);

        setActiveProp({ ...active });
        setData({
            ...settings,
            min: baseToUI(settings.min),
            max: baseToUI(settings.max),
            defaultValue: baseToUI(settings.defaultValue)
        });
        setCheckboxState(newCheckboxState)
        setInfluencingProperties(possibleDependencyPropList)
        setActiveNameInput(settings.nameUI !== '');
    }, [active]);


    const handleNameToggle = (e) => {
        setActiveNameInput(prev => !prev)
        setData(prev => {
            return { ...prev, nameUI: '' }
        })
        handleChange({ target: { name: 'nameUI', value: '' } })
    }

    /*
        const validation = ( newValue ) => {
            newValue = newValue.replace( ',', '.' );
    
            if ( newValue.match( /\d+\.$/ ) ) {
                setError( 'Bitte geben Sie eine gültige Zahl ein' );
                return false;
            }
    
            if ( isNaN( newValue ) ) {
                setError( 'Bitte geben Sie eine Zahl ein' );
                return false;
            }
        }
    */



    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleInputValuesChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleUnitChange = (e) => {
        const unit = units.find(u => u.abbr === e.target.value);
        setData(prev => ({ ...prev, ifcUnitAbbr: unit.abbr, ifcUnit: unit.name }))
    }

    const handleCheckboxChange = (event, prop, type, index) => {
        const newCheckboxState = [...checkboxState]
        newCheckboxState[index] = { value: false, min: false, max: false }
        newCheckboxState[index][type] = event.target.checked
        setCheckboxState(newCheckboxState)

        if (event.target.checked) {
            setInfluence('valueToTarget', { from: prop.id, to: active.id, type: type })
        } else {
            removeInfluence('valueToTarget', prop.id, active.id)
        }

        const newData = { ...data }
        if (type === 'value') {
            newData.defaultValue = ''
            newData.min = ''
            newData.max = ''
        } else {
            newData[type] = ''
        }

        setData(newData)
    }

    const handleActiveToggle = (e) => {
        setData(prev => ({ ...prev, active: e.target.checked }))
        updatePropertySettingsList({ ...data, active: e.target.checked })
    }

    const handleBlur = (e) => {
        const [uiToBase, baseToUI] = getConversionFactor('IfcLengthMeasure', data.ifcUnit);

        updatePropertySettingsList({
            ...data,
            min: uiToBase(data.min),
            max: uiToBase(data.max),
            defaultValue: uiToBase(data.defaultValue)
        })
    }

    return (
        <>
            {
                Object.keys(activeProp).length !== 0 &&
                <Form blur={handleBlur}>
                    <Flex w='100%' p='4' justify='space-between'>
                        <Heading size={'md'} textTransform='uppercase' w='100%'>{activeProp.name}</Heading>
                        <Stack align='center' direction='row'>
                            {/* <Text>inaktiv</Text> */}
                            <Switch my='1' name='active' isChecked={data.active} size='md' onChange={handleActiveToggle} />
                            {/* <Text>aktiv</Text> */}
                        </Stack>
                    </Flex>
                    <Divider />
                    <FormControl pt='12' w='100%'>
                        <Box p='4'>
                            <Flex w='100%' justify='space-between'>
                                <FormLabel>Name Eingabefeld</FormLabel>
                                <Switch my='1' isChecked={activeNameInput} size='md' onChange={handleNameToggle} />
                            </Flex>
                            <Input type='text' name='nameUI' value={data.nameUI} onChange={handleChange} isDisabled={!activeNameInput} />
                        </Box>
                        <Flex w='100%' p='4' justify='space-between'>
                            <Box w='40%'>
                                <FormLabel>Wert</FormLabel>
                                <InputGroup>
                                    <Input type='text'
                                        name='defaultValue'
                                        value={data.defaultValue}
                                        onChange={handleInputValuesChange}
                                        // isDisabled={disabledInputs.includes( 'defaultValue' )}
                                        isDisabled={checkboxState.some(e => e.value)}
                                    />
                                    <InputRightAddon>{data.ifcUnitAbbr}</InputRightAddon>
                                </InputGroup>
                            </Box>
                            <Box w='40%'>
                                <FormLabel>Einheit</FormLabel>
                                <Select name="ifcUnitAbbr" value={data.ifcUnitAbbr} onChange={handleUnitChange}>
                                    <option value='mm'>mm</option>
                                    <option value='cm'>cm</option>
                                    <option value='m'>m</option>
                                </Select>
                            </Box>
                        </Flex>
                        <Flex w='100%' p='4' justify='space-between'>
                            <Box w='40%'>
                                <FormLabel>Minimum</FormLabel>
                                <InputGroup>
                                    <Input
                                        type='text'
                                        name='min'
                                        value={data.min}
                                        onChange={handleInputValuesChange}
                                        isDisabled={checkboxState.some(e => e.min) || checkboxState.some(e => e.value)}
                                    />
                                    <InputRightAddon>{data.ifcUnitAbbr}</InputRightAddon>
                                </InputGroup>
                            </Box>
                            <Box w='40%'>
                                <FormLabel>Maximum</FormLabel>
                                <InputGroup>
                                    <Input
                                        type='text'
                                        name='max'
                                        value={data.max}
                                        onChange={handleInputValuesChange}
                                        isDisabled={checkboxState.some(e => e.max) || checkboxState.some(e => e.value)}
                                    />
                                    <InputRightAddon>{data.ifcUnitAbbr}</InputRightAddon>
                                </InputGroup>
                            </Box>
                        </Flex>

                        {influencingProperties.length > 0 ?
                            <Grid
                                p='4'
                                templateColumns='repeat(5, 1fr)'
                                templateRows={`repeat(${propertySettingsList.length}, minmax(1fr, auto))`}
                                gap='0'
                            >
                                <GridItem colSpan='2' rowSpan='1' p='2'>
                                    Name
                                </GridItem>
                                <GridItem colSpan='1' rowSpan='1' p='2'>
                                    Wert
                                </GridItem>
                                <GridItem colSpan='1' rowSpan='1' p='2'>
                                    Min
                                </GridItem>
                                <GridItem colSpan='1' rowSpan='1' p='2'>
                                    Max
                                </GridItem>
                                {influencingProperties.map((e, i) => {
                                    // if ( e.inputType === 'text' || e === active ) return
                                    return <React.Fragment key={i}>
                                        <GridItem colSpan='2' rowSpan='1' p='2'>
                                            <Box>{e.name}</Box>
                                        </GridItem>
                                        <GridItem colSpan='1' rowSpan='1' p='2' justifyContent='center'>
                                            <Checkbox
                                                name={`prop_${i}_value`}
                                                value={e.id}
                                                isChecked={checkboxState[i].value}
                                                verticalAlign='center'
                                                onChange={(event) => handleCheckboxChange(event, e, 'value', i)}
                                                disabled={checkboxState.some(e => e.min) || checkboxState.some(e => e.max)}
                                            ></Checkbox>
                                        </GridItem>
                                        <GridItem colSpan='1' rowSpan='1' p='2'>
                                            <Checkbox
                                                name={`prop_${i}_min`}
                                                value={e.id}
                                                isChecked={checkboxState[i].min}
                                                verticalAlign='center'
                                                onChange={(event) => handleCheckboxChange(event, e, 'min', i)}
                                                disabled={checkboxState.some(e => e.value)}
                                            ></Checkbox>
                                        </GridItem>
                                        <GridItem colSpan='1' rowSpan='1' p='2'>
                                            <Checkbox
                                                name={`prop_${i}_max`}
                                                value={e.id}
                                                isChecked={checkboxState[i].max}
                                                verticalAlign='center'
                                                onChange={(event) => handleCheckboxChange(event, e, 'max', i)}
                                                disabled={checkboxState.some(e => e.value)}
                                            ></Checkbox>
                                        </GridItem>
                                    </React.Fragment>
                                }
                                )}

                            </Grid> :
                            <Text p='4'>Zahlenwerte aus Select Feldern können hier als Fixwert, Minimum oder Maximum übernommen werden. Es wurden keine Zahlenwerte eingetragen.</Text>

                        }
                    </FormControl>
                </Form >
            }
        </>
    );
};