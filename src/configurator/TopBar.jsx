import { Flex, Icon, IconButton, Spacer, useDisclosure } from "@chakra-ui/react";
import { useConfigurator } from "../context/configurator-context";
import { useState } from "react";
import ModalWarning from "./ModalWarning";
import { BsArrowClockwise, BsArrowLeft, BsDatabaseDown } from "react-icons/bs";

export default function TopBar() {
    const { unsavedData, unsavedTreeData, onSaveData, onRestart, onRefreshTree, onAcceptNewTree, activeElement } = useConfigurator();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isLoading, setIsLoading] = useState('');

    const modalStateDefault = {
        action: '',
        missingElements: [],
        showCancel: false
    }
    const [modalState, setModalState] = useState({ ...modalStateDefault });

    const handleRefresh = async () => {
        setIsLoading('refreshTree');
        const result = await onRefreshTree();

        if (result.length === 0) {
            setModalState(({ action: 'loadedTree', showCancel: false }))
            onOpen();
        } else {
            setModalState({
                action: 'refreshWarning',
                missingElements: result,
            });
            onOpen();
        }
        setIsLoading('');
    };

    const handleButtonClick = async (type) => {
        setIsLoading(type);
        const result = await onSaveData(type);

        setModalState(prev => ({
            ...prev,
            action: result ? (type === 'tree' ? 'savedTree' : 'savedElement') : 'saveError',
            showCancel: false
        }));
        onOpen();
        onRestart();
        setIsLoading('');
    };

    const handleCancel = () => {
        if (unsavedData) {
            setModalState({ action: 'CancelElementConfig' });
            onOpen();
        }
        else onRestart();
    };

    const onOK = (action) => {
        setModalState({ ...modalStateDefault });
        if (action === 'refreshWarning') onAcceptNewTree();
        if (action === 'CancelElementConfig') onRestart()
        onClose();
    };

    const onCloseModal = () => {
        setModalState({ ...modalStateDefault });
        onClose();
    };

    return (
        <>
            <ModalWarning
                action={modalState.action}
                isOpen={isOpen}
                onClose={onCloseModal}
                onOK={onOK}
                list={modalState.missingElements}
                showCancel={modalState.showCancel}
            />
            <Flex bg='blackAlpha.50' flex='0 0' px='4' py='2'>
                <Flex w='25%'>
                    <IconButton icon={<Icon as={BsDatabaseDown} />}
                        mr='2' colorScheme="swiorange" w='max-content' fontSize={'20px'}
                        isLoading={isLoading === 'tree'}
                        onClick={() => handleButtonClick('tree')}
                        isDisabled={!unsavedTreeData || activeElement || isLoading}
                    />
                    <IconButton icon={<Icon as={BsArrowClockwise} />}
                        mr='2' colorScheme="swiorange" w='max-content' fontSize={'20px'}
                        isLoading={isLoading === 'refreshTree'}
                        isDisabled={activeElement || isLoading}
                        onClick={handleRefresh}
                    />
                </Flex>
                <Flex w='25%'>
                    <IconButton icon={<Icon as={BsArrowLeft} />}
                        mr='2' colorScheme="swiblue" w='max-content' fontSize={'20px'}
                        onClick={handleCancel}
                        isDisabled={!activeElement || isLoading}
                    />
                    <IconButton icon={<Icon as={BsDatabaseDown} />}
                        mr='2' colorScheme="swiorange" w='max-content' fontSize={'20px'}
                        onClick={() => handleButtonClick('element')}
                        isLoading={isLoading === 'element'}
                        isDisabled={!unsavedData || isLoading}
                    />
                </Flex>
                <Flex w='50%'></Flex>
            </Flex>
        </>
    );
};