import { Box, Flex, Spinner, Text, useDisclosure } from "@chakra-ui/react"
import { useConfigurator } from "../context/configurator-context"
import TreeNode from "./TreeNode"
// import ModalWarning from "./ModalWarning"
import { useGenerator } from "../context/generator-context"


export default function TreeView({ onSelectNode, activeElement, searchValue, isExpandAll = false }) {
    const { elementTree, allowedTreePaths } = useGenerator()

    const allowedPathsString = allowedTreePaths ? allowedTreePaths.map(e => e.join('')) : []

    const filteredTree = filterTreebySearch(elementTree, searchValue); // filtered Tree after search


    const checkFilter = (node) => {
        if (allowedTreePaths) {
            let path = node.path.join('')

            for (const allowedPath of allowedPathsString) {
                let allowed = allowedPath.substring(0, path.length)
                if (allowed === path) {
                    return true
                }
            }
        } else {
            return true
        }
        return false
    }

    /**
     * Filters a tree structure based on a search value
     *
     * @param {Array} treeData - The tree data to filter.
     * @param {string} searchValue - The search value to filter nodes by.
     * @returns {Array} The filtered tree data.
     */
    function filterTreebySearch(treeData, searchValue) {
        if (!searchValue) return treeData

        return treeData
            .map((node) => {
                // does node match search?
                const nameMatchesSearch =
                    !searchValue ||
                    node.name?.toLowerCase().includes(searchValue.toLowerCase())


                // recursively check children
                let filteredChildren = []
                if (node.children?.length) {
                    filteredChildren = filterTreebySearch(node.children, searchValue)
                }

                // if node or child has search criteria, keep it
                if ((nameMatchesSearch || filteredChildren.length > 0)) {
                    return {
                        ...node,
                        children: filteredChildren,
                    }
                }
                return null
            })
            .filter(Boolean) // remove null in array
    }


    return <>
        {/* <ModalWarning action={'ElementChange'} isOpen={isOpen} onClose={onClose} onOK={onOK} /> */}
        <Box border='1px' borderColor='blackAlpha.200' borderRadius='md' height='100%' p='3' w='100%' bg='white' overflow='auto'>
            {filteredTree && filteredTree.length > 0 && filteredTree.map((node, index) =>
                checkFilter(node) &&
                < TreeNode
                    key={index}
                    node={node}
                    onSelectNode={onSelectNode}
                    filter={checkFilter}
                    activeElement={activeElement}
                    expandAll={!!searchValue || isExpandAll}
                />)}
            {!elementTree &&
                <Flex direction='column' alignItems='center'>
                    <Spinner m='4' />
                    <Text textAlign='center'>Bauteile werden von Bimq geladen.</Text>
                </Flex>
            }
            {elementTree.length === 0 && <Text textAlign='center'>Keine Elemente vorhanden.</Text>}
        </Box>
    </>
}