import { Button, Divider, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Decimal from 'decimal.js';
import Crumps from "../components/Crumps";
import SkeletonHeader from "../components/SkeletonHeader";
import SkeletonInput from "../components/SkeletonInput";
import InputBoolean from "./InputBoolean";
import InputText from "./InputText";
import InputNumber from "./InputNumber";
import InputSelect from "./InputSelect";
import InputRevit from "./InputRevit";
import SelectNumber from "./SelectNumber";
import { useMain } from "../context/main-context";


export default function PropertySection({ activeElement, addType, configData, elementDetails, relations }) {
    const { getConversionFactor } = useMain()
    const [formData, setFormData] = useState({})
    const [currConfigData, setCurrConfigData] = useState([])
    const [shortnames, setShortnames] = useState({})

    useEffect(() => {
        if (activeElement && configData) {
            // eine Klasse für fd?
            const fd = {}
            const sn = {}
            console.log('configData :>>', configData)
            console.log('relations :>>', relations)
            const newConfigData = [...configData]
            configData.forEach((prop, i) => {
                // if ( prop.inputType === 'number' || prop.inputType.startsWith( 'select' ) || prop.inputType === 'Revit' ) {
                newConfigData[i].influenceOn = relations.valueToTarget.filter(e => e.from === prop.id)
                newConfigData[i].influencedBy = relations.valueToTarget.filter(e => e.to === prop.id)
                // }

                const [uiToBase, baseToUI] = getConversionFactor(prop.ifcType, prop.ifcUnit)
                if (prop.inputType === 'number') {
                    if (prop.calculateValue) {
                        const influencedBy = relations.valueToTarget.filter(e => e.to === prop.id)
                        let defaultValue = sumValuesFromProps(influencedBy, 'configData').toNumber()
                        // console.log( 'influencedBy :>>', influencedBy )
                        fd[prop.name] = { value: baseToUI(defaultValue) || '', nrValue: defaultValue, isValid: true, isDisabled: influencedBy.length > 0 ? true : false }
                        sn[prop.name] = defaultValue || ''
                    } else {
                        if (prop.bimqType === 'Measurements') {
                            fd[prop.name] = { value: baseToUI(prop.defaultValue) || '', nrValue: prop.defaultValue, isValid: true }
                            sn[prop.name] = baseToUI(prop.defaultValue) || ''
                        } else {
                            fd[prop.name] = { value: prop.defaultValue || '', isValid: true }
                            sn[prop.name] = prop.defaultValue || ''
                        }
                    }
                }
                if (prop.inputType === 'select number') {
                    fd[prop.name] = {
                        value: prop.values[prop.defaultValue].value,
                        nrValue: prop.values[prop.defaultValue]?.nrValue ?? '',
                        isValid: true
                    }
                    sn[prop.name] = prop.values[prop.defaultValue].shortname
                }
                if (prop.inputType === 'select') {
                    fd[prop.name] = {
                        value: prop.values[prop.defaultValue].value,
                        nrValue: prop.values[prop.defaultValue]?.nrValue ?? '',
                        isValid: true
                    }
                    sn[prop.name] = prop.values[prop.defaultValue].shortname
                }
                if (prop.inputType === 'boolean') {
                    fd[prop.name] = { value: prop.defaultValue, isValid: true }
                    sn[prop.name] = prop.defaultValue ? prop.typeNameTrue : prop.typeNameFalse
                }
                if (prop.inputType === 'text') {
                    fd[prop.name] = { value: prop.defaultValue || '', isValid: true }
                    sn[prop.name] = prop.defaultValue || ''
                }
                if (prop.origin === 'Revit') {
                    const influencedBy = relations.valueToTarget.filter(e => e.to === prop.id && e.type === 'value')

                    let defaultNrValue = influencedBy.length > 0 ? sumValuesFromProps(influencedBy, 'configData').toNumber() : prop.defaultValue
                    let defaultValue = baseToUI(defaultNrValue)

                    const toMinRels = relations.valueToTarget.filter(e => e.to === prop.id && e.type === 'min')
                    const toMaxRels = relations.valueToTarget.filter(e => e.to === prop.id && e.type === 'min')
                    let min = toMinRels > 0 ? sumValuesFromProps(toMinRels, 'configData').toNumber() : prop.min
                    let max = toMaxRels > 0 ? sumValuesFromProps(toMaxRels, 'configData').toNumber() : prop.max
                    newConfigData[i].min = min
                    newConfigData[i].max = max

                    fd[prop.name] = { value: defaultValue, nrValue: defaultNrValue, isValid: true, isDisabled: influencedBy.length > 0 ? true : false }
                    sn[prop.name] = defaultValue || ''
                }
                if (prop.required && fd[prop.name].value === '') {
                    fd[prop.name].isValid = false
                }
            })
            // console.log( 'configData :>>', configData )
            console.log('{...fd} :>>', { ...fd })
            setFormData({ ...fd })
            setShortnames({ ...sn })
            console.log('{...sn} :>>', { ...sn })
            setCurrConfigData(newConfigData)
        }
    }, [activeElement, configData])


    const requiredFieldsTouched = Object.values(formData).every((prop) => prop.isValid === true);

    const createName = (shortnames) => {
        let l = elementDetails.typeNameSorting.map(e => shortnames[e.name]).filter(e => e !== '')
        return elementDetails.prefix + '_' + l.join('_')
    }

    /*
    const handleClickAdd = ( e ) => {
        e.preventDefault()
        const name = createName( shortnames )
        const newType = {}
        console.log( 'formData :>>', formData )
        Object.entries( formData ).forEach( ( [key, value], i ) => {
            newType[key] = { value: value.value, unit: currConfigData.find( e => e.name === key ).ifcUnitAbbr }
        } )
        console.log( '{ ...newType, name: name } :>>', { ...newType, name: name } )
        addType( { ...newType, name: { value: name } } )
    }
    */

    const handleClickAdd = (e) => {
        e.preventDefault()
        const name = createName(shortnames)
        const newTypeTable = {}
        const newType = {}

        Object.entries(formData).forEach(([key, value], i) => {
            const prop = currConfigData.find(e => e.name === key)

            if (prop.inputType === 'boolean') {
                newTypeTable[key] = { value: value.value ? '\u2713' : '-' }
            } else {
                newTypeTable[key] = { value: value.value, unit: prop.ifcUnitAbbr }
            }

            newType[key] = value.value
            if (prop.origin === 'Revit') {
                const [uiToBase, baseToUI] = getConversionFactor(prop.ifcType, prop.ifcUnit)
                newType[key] = uiToBase(value.value)
            }
            // besser bei formData speichern welche number zu type kommt => isNumber = true dann nrValue oder value
            // useRevitFactor = true dann * 100
            if (prop.inputType === 'select number' && value.nrValue !== '') {
                // newType[key] = value.nrValue || value.value  //nrValue könnte auch 0 sein
                newType[key] = value.nrValue
            }
            if (prop.inputType === 'number' && value.nrValue !== '') {
                newType[key] = value.nrValue ?? value.value
            }
            if (prop.ifcType === 'IfcLengthMeasure') newType[key] = newType[key] * 100 // Revit Plugin braucht cm
        })
        addType({ ...newType, name: name }, { ...newTypeTable, name: { value: name } })
    }

    function sumValuesFromProps(relationsList, source, excludeId = '', startValue = 0) {
        let total = new Decimal(0)
        for (const relation of relationsList) {
            const prop = configData.find(e => e.id === relation.from)

            let propBaseValue;
            if (source === 'formData') {
                let value = formData[prop.name].nrValue === '' ? 0 : formData[prop.name].nrValue
                if (relation.from === excludeId) value = startValue
                propBaseValue = new Decimal(value)
            }
            if (source === 'configData') {
                if (prop.values) {
                    propBaseValue = new Decimal(prop.values[prop.defaultValue].nrValue)
                } else {
                    if (!prop.defaultValue) continue
                    propBaseValue = new Decimal(prop.defaultValue)
                }
            }
            if (relation.factor) {
                propBaseValue = propBaseValue.mul(relation.factor)
            }
            total = total.plus(propBaseValue);
        }
        return total
    }

    const handleMeasureDependencies = (changedProperty, newFormData, newShortnames) => {
        // prop is the property which changed
        // targets is an array of target objects
        // target is an Object with targetID and type. e.g. { from: '123', to: '456', type: 'min' }
        const relations = changedProperty.influenceOn
        if (relations.length === 0) return

        const newConfigData = [...configData]
        for (const relation of relations) {
            const targetIndex = newConfigData.findIndex(e => e.id === relation.to)
            const target = newConfigData.find(e => e.id === relation.to)
            const toChange = relation.type // min, max or value
            const changedPropertyValue = newFormData[changedProperty.name].nrValue

            // target can be influenced by multiple properties
            const newValue = sumValuesFromProps(target.influencedBy, 'formData', changedProperty.id, changedPropertyValue)

            const [uiToBase, baseToUI] = getConversionFactor(target.ifcType, target.ifcUnit)
            if (toChange === 'min' || toChange === 'max') {
                newConfigData[targetIndex][toChange] = newValue.toNumber()
            }

            if (toChange === 'value') {
                const v = newValue.toNumber()
                const newValueUI = baseToUI(v);
                newFormData[target.name].value = newValueUI;
                newShortnames[target.name] = newValueUI;
            }
        }

        setCurrConfigData([...newConfigData])
        setFormData({ ...newFormData })
        setShortnames({ ...newShortnames })
    }

    const inputProps = { currConfigData, formData, setFormData, shortnames, setShortnames, handleMeasureDependencies }
    return (
        // <Flex border='1px' borderColor='blackAlpha.200' borderRadius='md' height='100%' p={5} w='100%' bg='white'>
        <Flex p='3' direction='column' borderRadius='md' border='1px' borderColor='blackAlpha.200' height='100%' w='100%' bg='white' >
            <Flex direction='column' w='100%'>
                {
                    activeElement ?
                        <>
                            <Crumps activeElement={activeElement} />
                            <Heading size={'md'} textTransform='uppercase'>{activeElement.name}</Heading>
                        </> :
                        <>
                            <SkeletonHeader />
                        </>
                }
                <Divider my='3' />
            </Flex>
            <Flex as={'form'} direction='column' onSubmit={handleClickAdd} w='100%' overflow='auto' autoComplete='off'>
                {currConfigData.length > 0 && Object.keys(formData).length > 0 ?
                    <>
                        {
                            currConfigData.map((prop, i) => {
                                if (prop.active) {
                                    // return <ElementForm key={index} property={prop} change={setConfigData} />
                                    return <React.Fragment key={i}>
                                        {prop.inputType === 'number' && <InputNumber property={prop} {...inputProps} />}
                                        {prop.inputType === 'select number' && <SelectNumber property={prop} {...inputProps} />}
                                        {prop.inputType === 'select' && <InputSelect property={prop} {...inputProps} />}
                                        {prop.inputType === 'boolean' && <InputBoolean property={prop} {...inputProps} />}
                                        {prop.inputType === 'text' && <InputText property={prop} {...inputProps} />}
                                        {prop.origin === 'Revit' && <InputRevit property={prop} {...inputProps} />}
                                    </React.Fragment>
                                }
                                return null
                            })
                        }
                    </> :
                    <>
                        <SkeletonInput />
                        <SkeletonInput />
                        <SkeletonInput />
                    </>
                }
                <Button type='submit' my='6' p='4' colorScheme='swiorange' alignSelf='center' isDisabled={configData?.length > 0 && requiredFieldsTouched ? false : true} >Anlegen</Button>
            </Flex>
        </Flex >

    );
};