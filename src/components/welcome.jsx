import { Box, Flex, Heading, Icon, Link, Stack } from "@chakra-ui/react";
import { BsArrowUpRight, BsBoxArrowUpRight } from "react-icons/bs";

export default function Welcome({ name, projectID, requirementsID }) {
    return (
        <>
            <Stack w='100%' p={10} spacing={4}>
                <Heading as='h1' size='2xl'>Hallo {name}</Heading>
                <Heading as='h2' size='md'>Rolle: Admin</Heading>
                <Heading as='h2' size='md'>Project ID: {projectID}</Heading>
                <Heading as='h2' size='md'>Requirements ID: {requirementsID}</Heading>
                <Heading as='h2' size='md'>
                    <Link href={`https://server.bim-q.de/contexts/${projectID}/requirements?root_concept_id=${requirementsID}`} isExternal>
                        Link zur BIMQ Projektanforderung <Icon as={BsBoxArrowUpRight} mx='2' />
                    </Link>
                </Heading>
            </Stack>
        </>
    );
};