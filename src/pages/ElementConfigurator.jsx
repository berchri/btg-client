import { Box, Flex } from "@chakra-ui/react"
import InputOverviewSection from "../configurator/InputOverviewSection"
import { useConfigurator, ConfigContextProvider } from "../context/configurator-context"
import TreeSidebar from "../configurator/TreeSidebar"
import TopBar from "../configurator/TopBar"
import { useState } from "react"
import { RelationsProvider } from "../context/relations-context"

export default function ElementConfigurator() {
    return <>
        <ConfigContextProvider>
            <Flex direction="column" w='100%' height='100vh'>
                <TopBar />
                <Flex px='2' flex='1' bg='blackAlpha.50' overflow='hidden' >
                    <RelationsProvider>
                        <TreeSidebar />
                        <InputOverviewSection />
                    </RelationsProvider>
                </Flex>
            </Flex>
        </ConfigContextProvider >
    </>
}