import React from 'react';
import { Box, Flex, Icon, Spacer } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { BsGear, BsDatabase, BsMagic, BsPerson, BsPersonCircle } from 'react-icons/bs';


const MainNavigation = () => {
    const location = useLocation();
    const queryString = location.search;

    return (
        <Flex direction='column' as='nav' bg='blackAlpha.200' flex="0 0 50px" >
            {/* Add your navigation items here */}
            <NavLink to={`/create-types${queryString}`}>
                <Box w='100%' aspectRatio='auto' p='3'>
                    <Icon w='100%' h='100%' as={BsMagic} />
                </Box>
            </NavLink>
            <NavLink to={`/configure-elements${queryString}`}>
                <Box w='100%' aspectRatio='auto' p='3'>
                    <Icon w='100%' h='100%' as={BsGear} />
                </Box>
            </NavLink>
            <NavLink to={`/database${queryString}`}>
                <Box w='100%' aspectRatio='auto' p='3'>
                    <Icon w='100%' h='100%' as={BsDatabase} />
                </Box>
            </NavLink>
            <Spacer />
            <NavLink to={`/${queryString}`}>
                <Box w='100%' aspectRatio='auto' p='3'>
                    <Icon w='100%' h='100%' as={BsPersonCircle} />
                </Box>
            </NavLink>
        </Flex>
    );
};

export default MainNavigation;