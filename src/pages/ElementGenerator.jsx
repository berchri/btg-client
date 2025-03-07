import { Flex } from "@chakra-ui/react"
import { GeneratorContextProvider } from "../context/generator-context"
import TopBar from "../generator/TopBar"
import Main from "../generator/Main"

export default function ElementGenerator() {
    return <>
        <GeneratorContextProvider>
            <Flex direction="column" w='100%' height='100vh' overflow='hidden'>
                <TopBar />
                <Flex flex='1' px='4' bg='blackAlpha.50' overflow='hidden'>
                    <Main />
                </Flex>
            </Flex>
        </GeneratorContextProvider>
    </>
}