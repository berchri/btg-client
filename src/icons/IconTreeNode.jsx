import React from 'react';
import { Box, Icon, Square } from '@chakra-ui/react';
import { BsCaretDown, BsCaretRight, BsCheckCircle, BsDot, BsTag } from 'react-icons/bs';


function IconTreeNode({ isOpen, hasChildren, existsOnDatabase, color }) {
    const spacer = <Square size={'16px'} />;

    return (<>
        {hasChildren ?
            (isOpen ? <Icon as={BsCaretDown} /> : <Icon as={BsCaretRight} />) :
            (existsOnDatabase ? <Icon as={BsCheckCircle} color={color} /> : spacer)
        }

    </>
    );
}



export default IconTreeNode;
// {isOpen ? <Icon as={BsCaretDown} /> : <Icon as={BsCaretRight} />}