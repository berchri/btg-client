import { Box, Button, Divider, Flex, Heading, Spacer } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Crumps from "../components/Crumps";
import SkeletonHeader from "../components/SkeletonHeader";
import SkeletonInput from "../components/SkeletonInput";
import InputNumber from "./InputNumber";
import { useMain } from "../context/main-context";


export default function PropertySection({ activeElement, addType, configData, setConfigData }) {
    const [currConfigData, setCurrConfigData] = useState([])
    const [formData, setFormData] = useState({})
    // const [dependencies, setDependencies] = useState( {} )

    useEffect(() => {
        console.log('useEffect start:')
        if (activeElement && configData) {
            const fd = {}
            const sn = {}
            configData.forEach(prop => {
                if (prop.inputType === 'number') {
                    fd[prop.name] = { value: prop.defaultValue || '', isValid: true }
                    sn[prop.name] = prop.defaultValue || ''
                }
            })
            setFormData({ ...fd })
            setCurrConfigData(configData)
            setCurrActiveElement(activeElement)
        }
    }, [activeElement, configData])

    const handleClickAdd = (e) => {
        e.preventDefault()
    }

    return (
        <Flex p='3' direction='column' borderRadius='md' border='1px' borderColor='blackAlpha.200' height='100%' w='100%' bg='white'>
            <Flex as={'form'} direction='column' onSubmit={handleClickAdd} overflow='auto'>
                {show && configData.length > 0 && Object.keys(formData).length > 0 ?
                    <>
                        {
                            configData.map((prop, i) => {
                                if (prop.active) {
                                    return <React.Fragment key={i}>
                                        {prop.inputType === 'number' && <InputNumber property={prop} formData={formData} />}
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
            </Flex>
        </Flex >

    );
};