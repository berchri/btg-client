import { Box, Center, Flex, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import IconTreeNode from "../icons/IconTreeNode";
import { useConfigurator } from "../context/configurator-context";
import { useGenerator } from "../context/generator-context";

export default function TreeNode({ node, onSelectNode, filter, activeElement, expandAll = false, }) {
    const [isOpen, setIsOpen] = useState(false)

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

    const color = node === activeElement ? 'swiorange.0' : 'inherit';
    return (
        <>
            <Flex pl={indent} _hover={{ boxShadow: 'swiorange.lg' }} onClick={handleNodeClick} sx={{ cursor: 'pointer', userSelect: 'none' }}>
                <Center p={1.5}>
                    <IconTreeNode isOpen={isOpen} hasChildren={hasChildren} />
                </Center>
                <Center p={1.5} color={color}>
                    {node.name}
                </Center>
            </Flex>
            {hasChildren && isOpen && <>
                {node.children.map((child, index) => (
                    filter(child) &&
                    <TreeNode
                        key={index}
                        node={child}
                        onSelectNode={onSelectNode}
                        filter={filter}
                        activeElement={activeElement}
                        expandAll={expandAll}
                    />
                ))}
            </>
            }
        </>
    );
};