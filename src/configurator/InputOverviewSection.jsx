import { Box, Flex, IconButton, Icon, Heading, Text, useDisclosure, Tooltip, Button, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { BsGear, BsChevronRight, BsPlus, BsArrowDownUp } from "react-icons/bs";
import SkeletonInput from "../components/SkeletonInput";

import ModalConfigureInput from "./ModalConfigureInputs";
import { useEffect, useState } from "react";
import { useConfigurator } from "../context/configurator-context";
import InputPreviewElement from "./InputPreviewElement";
import Crumps from "../components/Crumps";
import SkeletonHeader from "../components/SkeletonHeader";
import InputConfigSection from "./InputConfigSection";

export default function InputOverviewSection() {
    const { activeElement, propertySettingsList, onConfigureNewElement, updatePropertyList, updateElementDetails, changeActiveSettings, setElementDetails, elementDetails, setWatcher } = useConfigurator()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [loading, setLoading] = useState(false)
    const [propList, setPropList] = useState([])
    // const [settingsList, setSettingsList] = useState( [...propertySettingsList] )
    const [activeConfigSection, setActiveConfigSection] = useState({})
    // const [newElementDetails, setNewElementDetails] = useState( {} )
    const [allowCategoryChange, setAllowCategoryChange] = useState(true)

    // const [formData, setFormData] = useState( {} )
    // console.log( 'popertySettingsList', propertySettingsList )
    useEffect(() => {
        setActiveConfigSection({});
        // setNewElementDetails( {} );
        if (activeElement) {
            setWatcher(true);
        }
        setPropList(propertySettingsList.map(e => ({ id: e.id, name: e.name, nameUI: e.nameUI, origin: e.origin })));
        setAllowCategoryChange(propertySettingsList.length === 0);
    }, [activeElement]);

    const savePropList = (newList, revitSettings, index) => {
        // todo
        setPropList(newList.map(e => ({ id: e.id, name: e.name, nameUI: e.nameUI, origin: e.origin })))
        updatePropertyList(newList)
        // console.log( 'newList :>>', newList )
        const tableHeaders = newList.map(e => ({ id: e.id, name: e.name, value: '' }))

        setElementDetails((prev) => ({
            ...prev,
            revitFamilyBasisSettingsListIndex: index,
            revitFamily: revitSettings.familyBasis,
            revitCategory: revitSettings.familyCategory,
            tableHeaders,
            typeNameSorting: tableHeaders
        }))
        setAllowCategoryChange(false);
    }

    const handleConfigureNew = async () => {
        setLoading(true)
        if (propertySettingsList.length === 0) {
            const newPropList = await onConfigureNewElement()
            if (newPropList === null) {
                setLoading(false)
                return
            }
            setPropList([...newPropList])
        }
        onOpen()
        setLoading(false)
    }

    const handleChangeActiveConfigSection = (prop) => {
        setActiveConfigSection(prop)
        changeActiveSettings(prop)
    }

    return <>
        {/* {isOpen && <ModalConfigureInput isOpen={isOpen} onClose={onClose} propList={propList} onSave={savePropList} />} */}
        {propList.length > 0 &&
            <ModalConfigureInput
                isOpen={isOpen}
                onClose={onClose}
                propList={propList}
                onSave={savePropList}
                allowCategoryChange={allowCategoryChange}
                list={[]}
            // newElementDetails={newElementDetails}
            />}
        <Flex direction={"column"} p='2' w='25%' minW='min-content' >
            <Flex p='0' direction='column' borderRadius='md' height='100%' w='100%' bg='white'>
                <Box border='2px dashed' borderColor='swiorange.0' borderBottomRadius='0' borderTopRadius='md' >
                    <Flex p='3'>
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
                        </Flex>
                        <IconButton
                            icon={<Icon as={BsGear} />}
                            colorScheme='swiorange'
                            isRound='true' size='sm'
                            fontSize='18px'
                            onClick={() => handleChangeActiveConfigSection('element')}
                            isDisabled={propertySettingsList.length === 0 && true}
                        />
                    </Flex>
                </Box>
                <Flex p='3' direction='column' height='100%' border='2px dashed' borderTopWidth='0px' borderColor='blackAlpha.200' borderTopRadius='0' borderBottomRadius='md' overflow="auto">
                    <Flex justify='center' my='4'>
                        <Button

                            leftIcon={propertySettingsList.length > 0 ?
                                <Icon as={BsArrowDownUp} /> :
                                <Icon as={BsPlus} boxSize={'2em'} />
                            }
                            colorScheme='swiorange'
                            variant='solid'
                            isLoading={loading}
                            onClick={handleConfigureNew}
                            isDisabled={!activeElement && true}
                        >
                            {propertySettingsList.length > 0 ? 'Reihenfolge ändern' : 'Neu konfigurieren'}
                        </Button>
                    </Flex>
                    {propertySettingsList.length > 0 && !allowCategoryChange ?
                        propertySettingsList.map((e, i) =>
                            <div key={i}>
                                <InputPreviewElement property={e} setActive={handleChangeActiveConfigSection} isActive={e.id === activeConfigSection.id} />
                            </div>
                        ) :
                        <>
                            <SkeletonInput border={true} />
                            <SkeletonInput border={true} />
                            <SkeletonInput border={true} />
                        </>
                    }
                </Flex>
            </Flex>
        </Flex>
        {Object.keys(activeConfigSection).length > 0 &&
            Object.keys(elementDetails).length > 0 &&
            <InputConfigSection active={activeConfigSection} />}
    </>
}