import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    Grid,
    GridItem,
    Text
} from '@chakra-ui/react'
import React from 'react';


export default function ModalWarning({ isOpen, onClose, onOK, action, list = [], showCancel = true }) {
    let header = '';
    let body = '';

    switch (action) {
        case 'ElementChange':
            header = 'Element wechseln';
            body = 'Wenn Sie das Element wechseln, gehen alle bisherigen Einstellungen verloren. Möchten Sie fortfahren?';
            break;
        case 'CancelElementConfig':
            header = 'Abbrechen';
            body = 'Wenn Sie abbrechen, gehen alle bisherigen Einstellungen verloren. Möchten Sie fortfahren?';
            break;
        case 'ElementRemove':
            header = 'Element entfernen';
            body = 'Das gewählte Element wird gelöscht. Möchten Sie fortfahren?';
            break;
        case 'refreshWarning':
            header = 'Warnung';
            body = 'Durch das Aktualisieren der Elementstruktur gehen Konfigurationen für folgende Elemente verloren:';
            break;
        case 'savedTree':
            header = 'Erfolg';
            body = 'Die Elementstruktur wurde erfolgreich gespeichert.';
            break;
        case 'savedElement':
            header = 'Erfolg';
            body = 'Das Element wurde erfolgreich gespeichert.';
            break;
        case 'loadedTree':
            header = 'Erfolg';
            body = 'Die Elementstruktur wurde erfolgreich geladen.';
            break;
        case 'saveError':
            header = 'Fehler';
            body = 'Daten konnten nicht gespeichert werden.';
            break;
        default:
            break;
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{header}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>{body}</Box>
                        {list.length > 0 &&
                            <Grid my={4} ml={4} gridTemplateColumns='auto auto' gridTemplateRows={2} gap={4} >
                                {list.map((e, i) =>
                                    <React.Fragment key={i}>
                                        <GridItem>
                                            <Text>{e.name}</Text>
                                        </GridItem>
                                        <GridItem>
                                            <Text>{e.id}</Text>
                                        </GridItem>
                                    </React.Fragment>
                                )}
                            </Grid>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {showCancel && <Button colorScheme='swiblue' mr={3} onClick={onClose}>
                            Abbrechen
                        </Button>}
                        <Button colorScheme='swiorange' onClick={() => onOK(action)}>OK</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}