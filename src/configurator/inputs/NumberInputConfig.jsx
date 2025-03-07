import { Box, Checkbox, Divider, Flex, FormControl, FormLabel, Grid, GridItem, Heading, Input, InputGroup, InputRightAddon, Select, Switch, Text } from "@chakra-ui/react";
import { useConfigurator } from "../../context/configurator-context";
import React, { useEffect, useState } from "react";
import Form from "../Form";
import { useMain } from "../../context/main-context";
import Decimal from "decimal.js";
import IconBimq from "../../icons/IconBimq";
import { useRelations } from "../../context/relations-context";


export default function NumberInputConfig({ active }) {
    const { updatePropertySettingsList, updatePropertyDependency, getActiveSettings, propertySettingsList } = useConfigurator();
    const { relations, getPossibleDependencies, getInfluenceList, setInfluence, removeInfluence } = useRelations();
    const { getUnitsList, getConversionFactor } = useMain();

    const [activeProp, setActiveProp] = useState({});
    const [data, setData] = useState({});
    const [error, setError] = useState([]);
    const [activeNameInput, setActiveNameInput] = useState(false);
    const [unitsList, setUnitsList] = useState([]);
    const [calculateValue, setCalculateValue] = useState(false);
    const [checkboxState, setCheckboxState] = useState([]);
    const [factor, setFactor] = useState([]);
    const [influencingProperties, setInfluencingProperties] = useState([]);

    useEffect(() => {
        setActiveProp({ ...active });
        const settings = getActiveSettings(active)
        // console.log( 'settings :>>', settings )
        const [uiToBase, baseToUI] = getConversionFactor(settings.ifcType, settings.ifcUnit);

        if (!settings.constraint) {
            const possibleDependencyPropList = getPossibleDependencies('valueToTarget', settings)
            const influenceList = getInfluenceList('valueToTarget', settings.id)

            const factor = []
            const newCheckboxState = possibleDependencyPropList.map((prop, i) => {
                const influence = influenceList.find(e => e.from === prop.id)
                factor[i] = influence?.factor || ''
                return influence ? true : false
            })

            setCalculateValue(newCheckboxState.some(e => e === true))
            setCheckboxState([...newCheckboxState])
            setFactor([...factor])
            setInfluencingProperties([...possibleDependencyPropList])
        }

        setActiveProp({ ...active });
        setData({
            ...settings,
            min: baseToUI(settings.min),
            max: baseToUI(settings.max),
            defaultValue: baseToUI(settings.defaultValue)
        });
        setActiveNameInput(settings.nameUI !== '');
        setUnitsList(settings.bimqType === 'Measurements' ? getUnitsList(settings.ifcType) : [])
    }, [active]);


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

    const handleUnitChange = (e) => {
        const u = unitsList[e.target.selectedIndex]
        const newData = { ...data }

        if (data.constraint) {
            const [uiToBase, baseToUI] = getConversionFactor('IfcLengthMeasure', e.target.value);
            let minBase = Decimal.div(data.min, data.ifcUnitFactor)
            let maxBase = Decimal.div(data.max, data.ifcUnitFactor)
            newData.min = Decimal.mul(minBase, u.factor).toNumber()
            newData.max = Decimal.mul(maxBase, u.factor).toNumber()
        }

        setData(prev => ({ ...newData, ifcUnit: u.name, ifcUnitAbbr: u.abbr, ifcUnitFactor: u.factor }))
    }

    const handleBlur = (e) => {
        const newData = { ...data }
        data.calculateValue = calculateValue
        if (!calculateValue) {
            const [uiToBase, baseToUI] = getConversionFactor('IfcLengthMeasure', data.ifcUnit);

            updatePropertySettingsList({
                ...newData,
                min: uiToBase(data.min),
                max: uiToBase(data.max),
                defaultValue: uiToBase(data.defaultValue)
            })
        } else {
            updatePropertySettingsList({ ...newData })
        }
    }

    const handleCheckboxChange = (e, prop, type, i) => {
        let newCheckboxState = [...checkboxState]
        newCheckboxState[i] = e.target.checked
        setCheckboxState(newCheckboxState)
        setCalculateValue(newCheckboxState.some(e => e === true))

        if (e.target.checked) {
            setFactor(prev => { prev[i] = 1; return prev })
            setInfluence('valueToTarget', { from: prop.id, to: data.id, type: 'value', factor: 1 })
        } else {
            setFactor(prev => { prev[i] = ''; return prev })
            removeInfluence('valueToTarget', prop.id, data.id)
        }

        setData(prev => ({
            ...prev,
            min: '',
            max: '',
            defaultValue: ''
        }))
    }

    const handleFactorChange = (e, i) => {
        setFactor(prev => { prev[i] = e.target.value; return [...prev] })
    }

    const handleFactorBlur = (e, prop, i) => {
        let value = e.target.value
        if (value === '' || isNaN(value)) value = 1
        setFactor(prev => { prev[i] = Number(value); return [...prev] })
        setInfluence('valueToTarget', { from: prop.id, to: data.id, type: 'value', factor: Number(value) })

        // const influenceList = prop.influenceOn.filter( e => e.targetID !== data.id )
        // const influenceObj = { targetID: data.id, type: 'value', factor: Number( value ) }
        // updatePropertyDependency( { ...data }, { ...prop, influenceOn: [...influenceList, influenceObj] } )
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
                                <Switch my='1' isChecked={activeNameInput} size='md' onChange={handleNameToggle} />
                            </Flex>
                            <Input type='text' name='nameUI' value={data.nameUI} onChange={handleChange} isDisabled={!activeNameInput} />
                        </Box>
                        <Flex w='100%' p='4' justify='space-between'>
                            <Box w='45%'>
                                <FormControl >
                                    <FormLabel>Typ <IconBimq /></FormLabel>
                                    <Select name="ifcType" value='' disabled={true} >
                                        <option value=''>{data.ifcType}</option>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box w='45%'>
                                <FormControl >
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
                        <Flex w='100%' p='4' justify='space-between'>
                            <Box w='45%'>
                                <FormLabel>Wert</FormLabel>
                                <InputGroup>
                                    <Input type='text'
                                        name='defaultValue'
                                        value={data.defaultValue}
                                        isDisabled={calculateValue}
                                        onChange={handleChange}
                                    />
                                    {data.bimqType === 'Measurements' && <InputRightAddon>{data.ifcUnitAbbr}</InputRightAddon>}
                                </InputGroup>
                            </Box>
                        </Flex>
                        <Flex w='100%' p='4' justify='space-between'>
                            <Box w='45%'>
                                <FormLabel>Minimum {data.constraint && <IconBimq />}</FormLabel>
                                <Flex>
                                    <Box flex={'0 0 70px'} mr={2}>
                                        <Select name="sign" value={data.equalToMin} disabled={data.constraint || calculateValue} onChange={handleChange}>
                                            <option value={true}>≥</option>
                                            <option value={false}>{'>'}</option>
                                        </Select>
                                    </Box>
                                    <InputGroup flex={'1 0'}>
                                        <Input type='text'
                                            name='min'
                                            value={data.min === '-Infinity' ? '-∞' : data.min}
                                            onChange={handleChange}
                                            disabled={data.constraint || calculateValue}
                                        />
                                        {data.bimqType === 'Measurements' &&
                                            <InputRightAddon>{data.ifcUnitAbbr}</InputRightAddon>}
                                    </InputGroup>
                                </Flex>
                            </Box>
                            <Box w='45%'>
                                <FormLabel>Maximum {data.constraint && <IconBimq />}</FormLabel>
                                <Flex>
                                    <InputGroup flex={'0 0 70px'} mr={2}>
                                        <Select name="sign" value={data.equalToMax} disabled={data.constraint || calculateValue} onChange={handleChange}>
                                            <option value={true}>≤</option>
                                            <option value={false}>{'<'}</option>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup flex={'1 0'}>
                                        {/* <InputLeftAddon>{data.equalToMax ? '≤' : '<'}</InputLeftAddon> */}
                                        <Input type='text'
                                            name='max'
                                            value={data.max === 'Infinity' ? '∞' : data.max}
                                            onChange={handleChange}
                                            disabled={data.constraint || calculateValue}
                                        />
                                        {data.bimqType === 'Measurements' && <InputRightAddon>{data.ifcUnitAbbr}</InputRightAddon>}
                                    </InputGroup>
                                </Flex>
                            </Box>
                        </Flex>
                        {influencingProperties.length > 0 ?
                            <Flex w='100%' p='4' justify='space-between'>
                                <Grid
                                    p='4'
                                    templateColumns='repeat(5, 1fr)'
                                    templateRows={`repeat(${influencingProperties.length}, minmax(1fr, auto))`}
                                    gap='0'
                                >
                                    <GridItem colSpan='2' rowSpan='1' p='2'>
                                        Name
                                    </GridItem>
                                    <GridItem colSpan='1' rowSpan='1' p='2'>
                                        Wert
                                    </GridItem>
                                    <GridItem colSpan='1' rowSpan='1' p='2'>
                                        Faktor
                                    </GridItem>
                                    {influencingProperties.map((prop, i) => {
                                        // if ( e.inputType === 'text' || e === active ) return
                                        return <React.Fragment key={i}>
                                            <GridItem colSpan='2' rowSpan='1' p='2'>
                                                <Box>{prop.name}</Box>
                                            </GridItem>
                                            <GridItem colSpan='1' rowSpan='1' p='2' justifyContent='center'>
                                                <Checkbox
                                                    name={`prop_${i}_value`}
                                                    value={prop.id}
                                                    isChecked={checkboxState[i]}
                                                    verticalAlign='center'
                                                    onChange={(event) => handleCheckboxChange(event, prop, 'value', i)}
                                                ></Checkbox>
                                            </GridItem>
                                            <GridItem colSpan='1' rowSpan='1' p='2'>
                                                <Input type='text'
                                                    name='factor'
                                                    value={factor[i]}
                                                    onChange={(e) => handleFactorChange(e, i)}
                                                    onBlur={(e) => handleFactorBlur(e, prop, i)}
                                                    disabled={!checkboxState[i]}
                                                />
                                            </GridItem>
                                        </React.Fragment>
                                    })}
                                </Grid>
                            </Flex>
                            :
                            <Text p='4'> </Text>
                        }
                    </FormControl>
                </Form >
            }
        </>
    );
};