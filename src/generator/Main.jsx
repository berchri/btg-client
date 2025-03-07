import { Box, Flex } from "@chakra-ui/react";
import SearchBar from "../components/SearchBar";
import TreeView from "./TreeView";
import PropertySection from "./PropertySection";
import TypesSection from "./TypesSection";
import { useEffect, useState } from "react";
import { useGenerator } from "../context/generator-context";


export default function Main() {
    const { getElementConfigurationData, setTypes, typesCollection, typesCollectionTable } = useGenerator()

    const [activeElement, setActiveElement] = useState(null)
    const [currentTypes, setCurrentTypes] = useState([])
    const [tableData, setTableData] = useState([])
    const [propSettings, setPropSettings] = useState([])
    const [relationsData, setRelationsData] = useState({})
    const [elementDetails, setElementDetails] = useState({})
    const [propsTable, setPropsTable] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [isExpandAll, setIsExpandAll] = useState(false)

    const fetchData = (element) => {
        const configData = getElementConfigurationData(element)
        const newElementDetails = { ...configData.elementDetails }
        const newPropertySettingsList = [...configData.propertySettingsList]
        const newRelationsData = { ...configData.relationsData }

        const propsTable = newElementDetails.tableHeaders.filter(head => newPropertySettingsList.find(p => p.id === head.id && p.active === true))

        setActiveElement({ ...element })
        setPropSettings([...configData.propertySettingsList])
        setRelationsData({ ...configData.relationsData })
        setElementDetails({ ...configData.elementDetails })
        setPropsTable([...propsTable])
        setCurrentTypes([...typesCollection[element.id]])
        setTableData([...typesCollectionTable[element.id]])
    }

    function handleSelectNode(element) {
        if (element === activeElement) return
        fetchData(element)
    }

    function onRemoveType(index) {
        const types = [...currentTypes]
        const table = [...tableData]
        table.splice(index, 1)
        types.splice(index, 1)
        setTableData(table)
        setCurrentTypes(types)
        setTypes(activeElement, types, table)
    }

    function onAddType(type, typeTable) {
        const types = [...currentTypes, type]
        const table = [...tableData, typeTable]
        setTableData(table)
        setCurrentTypes(types)
        setTypes(activeElement, types, table)
    }

    return (
        <>
            <Box p='4' w='20%' minW='min-content' h='100%'>
                <Flex>
                    <SearchBar
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        isExpandAll={isExpandAll}
                        setIsExpandAll={setIsExpandAll}
                    />
                </Flex>
                <TreeView onSelectNode={handleSelectNode} activeElement={activeElement} searchValue={searchValue} isExpandAll={isExpandAll} />
            </Box>
            <Box p='4' w='20%' minW='min-content' h='100%'>
                <PropertySection
                    activeElement={activeElement}
                    configData={propSettings}
                    elementDetails={elementDetails}
                    addType={onAddType}
                    relations={relationsData}
                />
            </Box>
            <Box p='4' w='60%' h='100%' >
                {
                    tableData.length > 0 &&
                    <TypesSection
                        types={tableData}
                        propsTable={propsTable}
                        removeType={onRemoveType}
                    />
                }
            </Box>
        </>
    );
};