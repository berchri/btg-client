import { Box, Flex } from "@chakra-ui/react"
import { useConfigurator } from "../context/configurator-context"
import TreeNode from "./TreeNode"
import TreeView from "./TreeView"
import SearchBar from "../components/SearchBar"
import { useState } from "react";


export default function TreeSidebar() {
    const [searchValue, setSearchValue] = useState("")
    const [isExpandAll, setIsExpandAll] = useState(false)

    return <>
        <Flex direction={"column"} p='2' w='25%' minW='min-content'>
            <SearchBar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isExpandAll={isExpandAll}
                setIsExpandAll={setIsExpandAll}
            />
            <TreeView
                searchValue={searchValue}
                isExpandAll={isExpandAll}
            />
        </Flex>
    </>
}