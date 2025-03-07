import React, { useState } from "react";
import { Flex, Heading, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useConfigurator } from "../context/configurator-context";
import Form from "./Form";
import TableHeaders from "./TableHeaders";
import TypeName from "./TypeName";
import AutocompleteInput from "./AutocompleteInput";

const dwordToRGB = (dword) => {
    const red = (dword & 0xFF0000) >> 16;
    const green = (dword & 0x00FF00) >> 8;
    const blue = (dword & 0x0000FF);
    return { red, green, blue };
};

const rgbToDword = (rgb) => {
    const red = parseInt(rgb.red);
    const green = parseInt(rgb.green);
    const blue = parseInt(rgb.blue);
    return (red << 16) | (green << 8) | blue;
}

const ElementConfig = () => {
    const { activeElement, revitCategories, updateElementDetails, elementDetails } = useConfigurator()
    const [formData, setFormData] = useState({ ...elementDetails })

    const [rgb, setRGB] = useState(dwordToRGB(elementDetails.revitPatternColor))
    const [colorPickerValue, setColorPickerValue] = useState('#' + elementDetails.revitPatternColor.toString(16).padStart(6, '0'))


    // console.log( 'elementDetails :>>', elementDetails )

    /*
    Version with useRef and cleanup function:
    Cleanup function is called when the component is unmounted.

    const formRef = useRef()
    formRef.current = formData

    useEffect( () => {
        return () => {
            formRef.current.requestSubmit() // requestSubmit() vs. submit()
            console.log( 'ElementConfig cleanup', formData )
            updateElementDetails( formRef.current );
        };
    }, [] );

    */

    const handleBlur = () => {
        updateElementDetails(formData);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSortingChange = (newList, listname) => {
        setFormData(prevState => ({
            ...prevState,
            [listname]: newList
        }));
    }

    const handleHeaderValueChange = (index, value) => {
        setFormData(prev => {
            prev.tableHeaders[index].value = value
            return { ...prev }
        })
    }

    const handleColorChange = (e) => {
        const { name, value } = e.target;
        setRGB(prevState => ({
            ...prevState,
            [name]: value
        }));
        const bigint = rgbToDword({ ...rgb, [name]: value });
        setColorPickerValue('#' + bigint.toString(16).padStart(6, '0'))
        setFormData(prevState => ({
            ...prevState, revitPatternColor: bigint
        }))
    }

    const handleColorPickerChange = (e) => {
        setColorPickerValue(e.target.value)
        const hex = e.target.value.substring(1)
        const bigint = parseInt(hex, 16);
        setRGB(dwordToRGB(bigint))
        setFormData(prevState => ({
            ...prevState, revitPatternColor: bigint
        }))
    }


    return (
        <>
            <Form blur={handleBlur}>
                <Heading size={'md'} p='4' textTransform='uppercase' w='100%'>{activeElement.name}</Heading>
                <FormControl p='4'>
                    <FormLabel>Typname Präfix</FormLabel>
                    <Input type='text' name='prefix' value={formData.prefix} onChange={handleChange} />
                </FormControl>
                <TypeName
                    formData={formData}
                    propList={formData.typeNameSorting}
                    handleSortingChange={(newList) => handleSortingChange(newList, 'typeNameSorting')}
                />
                <TableHeaders
                    formData={formData}
                    propList={formData.tableHeaders}
                    handleHeaderValueChange={handleHeaderValueChange}
                    handleSortingChange={(newList) => handleSortingChange(newList, 'tableHeaders')}
                />
                <FormControl p='4'>
                    <FormLabel>iTWO-Key</FormLabel>
                    <Input type='text' name="itwoKey" value={formData.itwoKey} onChange={handleChange} isDisabled={true} />
                </FormControl>
                <FormControl p='4'>
                    <FormLabel>Revit - Kategorie</FormLabel>
                    <Select name="revitCategory" isDisabled={true} value={formData.revitCategory} onChange={handleChange}>
                        {revitCategories.map((e, i) =>
                            <option key={i} value={e.familyCategory}>
                                {e.familyCategory}
                            </option>)}
                    </Select>
                </FormControl>
                <FormControl p='4'>
                    <FormLabel>Revit - Basisfamilie</FormLabel>
                    <Input type='text' name="revitFamily" value={formData.revitFamily} onChange={handleChange} />
                </FormControl>
                <FormControl p='4'>
                    <FormLabel>Revit - Muster</FormLabel>
                    <Input type='text' name="revitPattern" value={formData.revitPattern} onChange={handleChange} />
                </FormControl>
                <Flex w='100%'>
                    <FormControl p='4' >
                        <FormLabel>Farbwahl</FormLabel>
                        <Input type='color' name="revitPatternColorPicker" value={colorPickerValue} onChange={handleColorPickerChange} />
                    </FormControl>
                    <FormControl p='4' >
                        <FormLabel>Rot</FormLabel>
                        <Input type='text' name="red" value={rgb.red} onChange={handleColorChange} />
                    </FormControl>
                    <FormControl p='4' >
                        <FormLabel>Grün</FormLabel>
                        <Input type='text' name="green" value={rgb.green} onChange={handleColorChange} />
                    </FormControl>
                    <FormControl p='4' >
                        <FormLabel>Blau</FormLabel>
                        <Input type='text' name="blue" value={rgb.blue} onChange={handleColorChange} />
                    </FormControl>
                </Flex>
                <AutocompleteInput name='material'
                    value={formData.material}
                    onChange={handleChange}
                    filterEntries={false}
                />
                {/* <FormControl p='4'>
                    <FormLabel>Material</FormLabel>
                    <Input type='text' name="material" value={formData.material} onChange={handleChange} />
                </FormControl> */}
            </Form >
        </>
    );
}
export default ElementConfig;


