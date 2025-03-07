import { useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";


export default function DatabaseManagement() {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/bimq/refreshDatabase', {
                method: 'POST'
            });
            const data = await response.json();
            if (data.status === 'OK') {
                alert('Datenbank erfolgreich aktualisiert.');
            } else {
                throw new Error('Error!');
            }
        } catch (error) {
            alert('Es ist ein Problem aufgetreten.');
        }
        setIsLoading(false);
    }

    return (
        <>
            <Flex w='100%' h='100vh' justifyContent='center' alignItems='center'>
                <Button isLoading={isLoading} onClick={handleClick} colorScheme='swiorange'>Datenbank Aktualisieren</Button>
            </Flex>
        </>
    );
};