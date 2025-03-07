import { Box, Icon, IconButton, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { BsGear, BsTrash } from 'react-icons/bs';


export default function TypesSection({ types, propsTable, removeType }) {
    const headers = propsTable.map(prop => prop.value || prop.name)
    let rows = []
    if (types.length > 0) {
        rows = types.map(type => {
            const row = propsTable.map(prop => type[prop.name])
            console.log('row :>>', row)
            row.unshift(type.name)
            return row
        })
    }

    console.log('rows :>>', rows)

    // const headers = elementDetails.tableHeaders.map( prop => prop.value || prop.name )
    // const propNames = elementDetails.tableHeaders.map( prop => prop.name )

    // const typeNameSorting = elementDetails.typeNameSorting.filter( prop => {
    //     const obj = configData.find( e => e.name === prop.name )
    //     if ( obj.typeNameSuffix ) return true
    //     if ( obj.values.find( e => e.shortname !== '' ) ) return true
    //     if ( obj.typeNameFalse || obj.typeNameTrue ) return true
    // } ).map( prop => prop.name )

    // let parts = [elementDetails.prefix]
    // for ( const propName of elementDetails.typeNameSorting ) {

    //     parts.push( types[propName] )
    // }
    const handleRemoveType = (index) => {
        removeType(index)
    }
    return (
        <>
            <Box
                p='4'
                border='1px'
                borderRadius='md'
                borderColor='blackAlpha.200'
                height='100%'
                w='100%'
                bg='white'
            >
                <TableContainer>
                    <Table variant='simple'>
                        <TableCaption>{rows.length === 0 ? 'Es wurden noch keine Typen angelegt.' : 'Liste der angelegten Typen.'}</TableCaption>
                        <Thead>
                            <Tr>
                                <Th title='Name' p={2} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' maxWidth='60px' cursor='help' >Name</Th>
                                {headers.map((header, index) => (
                                    <Th title={header} p={2} key={index} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' maxWidth='60px' cursor='help'>{header}</Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {rows.map((type, i) =>
                                <Tr key={i}>
                                    {type.map((prop, index) => (
                                        <Td key={index} p={2}>{prop.value} {prop.unit}</Td>
                                    ))}
                                    <Td p={2} whiteSpace='nowrap' overflow='hidden'>
                                        <IconButton
                                            icon={<Icon as={BsTrash} />}
                                            colorScheme='swiorange'
                                            isRound='true' size='sm'
                                            fontSize='18px'
                                            onClick={() => handleRemoveType(i)}
                                        />
                                    </Td>
                                </Tr>
                            )
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};