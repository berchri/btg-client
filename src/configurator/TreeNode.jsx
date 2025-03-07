import { Box, Center, Flex, Icon, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import IconTreeNode from "../icons/IconTreeNode";
import { useConfigurator } from "../context/configurator-context";
import { BsTrash } from "react-icons/bs";

export default function TreeNode({ node, onSelectNode, onRemoveElementData, expandAll = false }) {
    const { activeElement, projectDetails } = useConfigurator();
    const [isOpen, setIsOpen] = useState(false)

    const existsOnDatabase = projectDetails.existsOnDatabase.find(id => id === node.id)

    const hasChildren = node.children && node.children.length > 0;
    const indent = (node.level - 1) * 2 + 'rem';

    // force open
    useEffect(() => {
        setIsOpen(expandAll);
    }, [expandAll]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleNodeClick = () => {
        hasChildren ? toggleOpen() : onSelectNode(node);
    }

    const handleRemoveElement = (e) => {
        e.stopPropagation()
        onRemoveElementData(node)
    }

    const color = activeElement === node ? 'swiorange.0' : 'inherit';
    return (
        <>
            <Flex align='center' pl={indent} _hover={{ boxShadow: 'swiorange.lg' }} onClick={handleNodeClick} sx={{ cursor: 'pointer', userSelect: 'none' }}>
                <Box p={1.5}>
                    <IconTreeNode isOpen={isOpen} hasChildren={hasChildren} existsOnDatabase={existsOnDatabase} color={color} />
                </Box>
                <Box flex='1' p={1.5} color={color} >
                    {node.name}
                </Box>
                <Box p={1.5}>
                    {existsOnDatabase ?
                        <IconButton icon={<Icon as={BsTrash} />}
                            colorScheme='swiorange'
                            isRound='true' size='xs'
                            fontSize='14px'
                            onClick={handleRemoveElement}
                            isDisabled={activeElement !== node}
                        /> :
                        <Box w='24px'></Box>
                    }
                </Box>
            </Flex>
            {hasChildren && isOpen && <>
                {node.children.map((child, index) => (
                    <TreeNode key={index} node={child} onSelectNode={onSelectNode} onRemoveElementData={onRemoveElementData} expandAll />
                ))}
            </>
            }
        </>
    );
};