import { Flex } from "@chakra-ui/react";


export default function Form({ children, blur }) {
    return (
        <>
            <Flex as='form'
                p='4'
                direction='column'
                align='start'
                border='1px'
                borderRadius='md'
                borderColor='blackAlpha.200'
                height='100%'
                w='100%'
                bg='white'
                overflow='auto'
                autoComplete='off'
                onBlur={blur}
            >
                {children}
            </Flex>
        </>
    );
};