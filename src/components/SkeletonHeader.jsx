import { Box } from "@chakra-ui/react";


export default function SkeletonHeader() {
    return (
        <>
            <Box w='25%' my='1' height='1rem' borderRadius='md' bgColor={'blackAlpha.200'}></Box>
            <Box w='30%' my='1' height='1rem' borderRadius='md' bgColor={'blackAlpha.200'}></Box>
            <Box w='60%' my='1' height='1.5rem' borderRadius='md' bgColor={'blackAlpha.200'}></Box>
        </>
    );
};