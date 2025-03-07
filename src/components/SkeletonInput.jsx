import { Box, Flex } from '@chakra-ui/react';

export default function SkeletonInput({ border }) {
    return (
        <Flex p={border && '3'} my='1.5' w='100%' height='8rem' direction='column' justify={'space-around'} border={border && '2px dashed'} borderColor={'blackAlpha.200'} borderRadius={'md'}>
            <Box w='25%' my='1' height='1.5rem' borderRadius='md' bgColor={'blackAlpha.200'}></Box>
            <Box w='100%' my='1' height='2rem' borderRadius='md' bgColor={'blackAlpha.200'}></Box>
            <Box w='45%' my='1' height='1.5rem' borderRadius='md' bgColor={'blackAlpha.200'}></Box>
        </Flex>
    )
}