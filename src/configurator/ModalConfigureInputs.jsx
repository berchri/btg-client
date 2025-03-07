import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Flex,
    Box,
    IconButton,
    Icon,
    FormControl,
    FormLabel,
    Select
} from '@chakra-ui/react'
import { useConfigurator } from '../context/configurator-context'
import { useEffect, useState } from 'react'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';


export default function ModalConfigureInput({ isOpen, onClose, propList, onSave, allowCategoryChange }) {
    const { activeElement, revitCategories, elementDetails } = useConfigurator()

    const [sortingList, setSortingList] = useState([...propList]);
    const [categoryIndex, setCategoryIndex] = useState(elementDetails.revitFamilyBasisSettingsListIndex);
    const [index, setIndex] = useState('');

    useEffect(() => {
        // setSortingList( [...propList] );
        // setCategoryIndex( elementDetails.revitFamilyBasisSettingsListIndex )
        // setIndex( '' )
    }, [isOpen, propList])

    // console.log( 'ModalConfigureInput active Element', activeElement )
    // console.log( 'ModalConfigureInput elementDetails', elementDetails )
    // console.log( 'activeElementPropertyList', activeElementPropertyList )
    // console.log( 'sortingList', sortingList )
    // console.log( 'propList', propList )


    const onSetActive = (e) => {
        setIndex(prev => e === prev ? '' : e)
    }

    const moveItem = (direction) => {
        if (index === '') return
        let temp = [...sortingList];
        if (direction === 'up') {
            if (index > 0) {
                let tempItem = temp[index];
                temp[index] = temp[index - 1];
                temp[index - 1] = tempItem;
                setSortingList(temp);
                setIndex(prev => prev - 1);
            }
        } else {
            if (index < sortingList.length - 1) {
                let tempItem = temp[index];
                temp[index] = temp[index + 1];
                temp[index + 1] = tempItem;
                setSortingList(temp);
                setIndex(prev => prev + 1);
            }
        }
    }

    const handleOK = () => {
        onSave(sortingList, revitCategories[categoryIndex], categoryIndex);
        // updateActiveElementPropertyList( sortingList );
        onClose();
    }

    const handleChange = (e) => {
        setCategoryIndex(e.target.value);
        let bimqParams = sortingList.filter(p => p.origin !== 'Revit')
        const revitParams = revitCategories[e.target.value].properties
        setSortingList([...revitParams, ...bimqParams])
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{activeElement.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <FormControl p='4'>
                                <FormLabel>Revit - Kategorie</FormLabel>
                                <Select name="revitCategory" value={categoryIndex} onChange={handleChange} isDisabled={!allowCategoryChange}>
                                    {revitCategories.map((e, i) =>
                                        <option key={i} value={i}>
                                            {e.familyCategory}
                                        </option>)}
                                </Select>
                            </FormControl>
                        </Box>
                        <Flex>
                            <Box py='4' px='1' flexGrow='1' border={'1px'} borderRadius='md' borderColor={'blackAlpha.200'} >
                                {sortingList.map((e, i, a) =>
                                    <Box
                                        pl='4'
                                        key={i}
                                        sx={{ cursor: 'pointer' }}
                                        _hover={{ background: 'swiorange.100' }}
                                        onClick={() => onSetActive(i)}
                                        bg={i === index ? 'swiorange.100' : ''}
                                    >
                                        {e.origin === 'Revit' ? `${e.nameUI} (Revit: ${e.name})` : e.name}
                                    </Box>
                                )}
                            </Box>
                            <Flex p='4' direction='column' alignItems='center' >
                                <IconButton
                                    icon={<Icon as={BsChevronUp} />}
                                    my='2'
                                    colorScheme="swiorange"
                                    size='sm'
                                    fontSize='18px'
                                    onClick={() => moveItem('up')}
                                />
                                <IconButton
                                    icon={<Icon as={BsChevronDown} />}
                                    colorScheme="swiorange"
                                    size='sm'
                                    fontSize='18px'
                                    onClick={() => moveItem('down')}
                                />

                            </Flex>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='swiblue' mr={3} onClick={onClose}>
                            Abbrechen
                        </Button>
                        <Button colorScheme='swiorange' onClick={handleOK}>OK</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}