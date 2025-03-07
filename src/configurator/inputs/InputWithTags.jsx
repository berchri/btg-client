import React, { useState } from 'react';
import { Box, Input, Tag, TagLabel, TagCloseButton, Wrap, WrapItem, HStack } from '@chakra-ui/react';
import { useTheme } from '@emotion/react';

export default function ({ allTags, value }) {
    const theme = useTheme();
    console.log('allTags :>>', allTags);
    const [tags, setTags] = useState(allTags.filter((e, i) => value[i] === true));
    const [inputValue, setInputValue] = useState(value);

    const tagsx = ['test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
    ]

    const tag = tagsx.map((tag, i) => {
        return <Tag
            size='md'
            key={i}
            borderRadius='full'
            variant='solid'
            colorScheme='green'
        >
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton />
        </Tag>
    })


    return (
        <>
            <Box
                h='100%'
                border='1px'
                borderColor='gray.200'
                borderRadius='md'
                _hover={{ borderColor: 'gray.300' }}
                _focus={{ borderColor: 'blue.500', boxShadow: `0 0 0 1px ${theme.colors.blue[500]}` }}
                tabIndex={0}
            >
                <Wrap spacing='2' >
                    {tag}
                </Wrap>
            </Box>
        </>

    );
}
