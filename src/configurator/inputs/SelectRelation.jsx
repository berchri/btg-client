import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Flex, FormControl, FormLabel, Grid, GridItem, Input, Select, Stack, Text } from "@chakra-ui/react";
import { useRelations } from "../../context/relations-context";
import InputWithTags from "./InputWithTags";
const relation = { from: 123, to: 123, relations: [{ selectedIndex: 'xxxx', disabled: [0, 2] }] }

export default function SelectRelation({ from, to, handleChange }) {
    // const { relations, setRelations } = useRelations();
    const rows = () => from.values.length * 1;

    const [currRelation, setCurrRelation] = useState(relation)

    useEffect(() => {

    }, [])

    console.log('from :>>', from)
    console.log('to :>>', to)
    const [thenState, setThenState] = useState([])
    const [tags, setTags] = useState([])

    return (
        <Flex>
            <Grid
                w='100%'
                p={4}
                templateColumns="1fr 2fr"
                templateRows={`repeat(${rows() + 2}, minmax(1fr, auto))`}
                alignItems={'end'}
                gap='2'
                my='6'
            >
                <GridItem colSpan='1' rowSpan='1' p='2'>
                    Wenn
                </GridItem>
                <GridItem colSpan='1' rowSpan='1'>
                    <Flex alignItems={'center'}>
                        <Box mr='2'>Dann</Box>
                    </Flex>
                </GridItem>
                {from.values.map((e, i) =>
                    <React.Fragment key={i}>
                        <GridItem key={i + '-1'} h='2.5rem'
                            alignItems='center'
                            colSpan='1'
                            rowSpan='1'
                            border='1px'
                            borderRadius='md'
                            borderColor='blackAlpha.200'
                            alignSelf='center'
                        >
                            <Flex pl='3' flex='1' alignItems='center' h='100%'>
                                <Text>{e.value}</Text>
                            </Flex>
                        </GridItem>
                        <GridItem key={i + '-3'} alignSelf='stretch' colSpan='1' rowSpan='1'>
                            <InputWithTags allTags={to.values.map(e => e.value)} value={[]} />
                        </GridItem>
                    </React.Fragment>
                )}
            </Grid>
            <Box w='100px'>
                <Stack >
                    <Button size='sm'>Alle</Button>
                    <Button>keine</Button>
                    <Divider />
                    <Button>Test 1</Button>
                    <Button>Test 2</Button>

                </Stack>
            </Box>
        </Flex>
    );
}
