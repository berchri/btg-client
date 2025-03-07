import { Box, Flex, Spinner, Text, useDisclosure } from "@chakra-ui/react"
import { useConfigurator } from "../context/configurator-context"
import TreeNode from "./TreeNode"
import ModalWarning from "./ModalWarning"
import { useState } from "react"


export default function TreeView({ searchValue, isExpandAll = false }) {
    const { elementTree, onChangeElement, unsavedData, activeElement, removeElement } = useConfigurator()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [selectedNode, setSelectedNode] = useState({})
    const [modalAction, setModalAction] = useState('')

    const filteredTree = filterTreebySearch(elementTree, searchValue); // filtered Tree after search

    const handleSelectNode = (node) => {
        if (activeElement === node) return
        if (unsavedData === true) {
            openModal('ElementChange', node)
        } else {
            onChangeElement(node)
        }
    }

    const handleRemoveElementData = (node) => {
        openModal('ElementRemove', node)
    }

    const openModal = (action, node) => {
        setSelectedNode(node)
        setModalAction(action)
        onOpen()
    }

    const onOK = (action) => {
        if (action === 'ElementChange') onChangeElement(selectedNode)
        if (action === 'ElementRemove') removeElement(selectedNode)
        onClose()
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
        <ModalWarning action={modalAction} isOpen={isOpen} onClose={onClose} onOK={onOK} />
        <Box border='1px' borderColor='blackAlpha.200' borderRadius='md' height='100%' p={5} w='100%' bg='white' overflowY='auto'>
            {filteredTree && filteredTree.length > 0 ? filteredTree.map((node, index) =>
                <TreeNode key={index} node={node} onSelectNode={handleSelectNode} onRemoveElementData={handleRemoveElementData} expandAll={!!searchValue || isExpandAll} />) :
                !searchValue ?
                    <Flex direction='column' alignItems='center'>
                        <Spinner m='4' />
                        <Text textAlign='center'>Bauteile werden von Bimq geladen.</Text>
                    </Flex> : <div>Keine Bauteile gefunden.</div>
            }
            {elementTree.length === 0 && !searchValue && <div>Keine Bauteile auf Bimq gefunden.</div>}
        </Box>
    </>
}