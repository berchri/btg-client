import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useGenerator } from "../context/generator-context";


export default function TopBar() {
    const { createExportData, exportData } = useGenerator()
    const handleClickSendToRevit = () => {
        const data = createExportData()
        exportData(data)
    }

    return (
        <>
            <Flex bg='blackAlpha.50' px='4' py='2' w='100%' >
                <Flex w='20%' px='4'>
                    <Button colorScheme="swiorange" type="submit" p='4' onClick={handleClickSendToRevit}>An Revit senden</Button>
                </Flex>
                <Flex w='20%' px='4'>
                </Flex>
                <Flex w='60%'></Flex>
            </Flex>
        </>
    );
};