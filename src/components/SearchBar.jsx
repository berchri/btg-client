import { Input, InputGroup, InputLeftElement, IconButton, Icon, InputRightElement, Tooltip, Flex } from "@chakra-ui/react";
import { BsSearch, BsXLg, BsChevronBarContract, BsChevronBarExpand } from "react-icons/bs";

export default function SearchBar({ searchValue, setSearchValue, isExpandAll, setIsExpandAll }) {
    return (
        <Flex direction={"row"} p='2' w='100%' minW='min-content'>
            <InputGroup mb={4}>
                <InputLeftElement pointerEvents="none">
                    <Icon as={BsSearch} color="gray.400" />
                </InputLeftElement>

                <Input
                    placeholder="Element suchen"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                {searchValue && (
                    <InputRightElement>
                        <IconButton
                            icon={<Icon as={BsXLg} />}
                            colorScheme="swiorange"
                            size="sm"
                            onClick={() => setSearchValue("")}
                        />
                    </InputRightElement>
                )}
            </InputGroup>
            <Tooltip
                label={isExpandAll ? "Alle einklappen" : "Alle ausklappen"}
                placement="top"
            >
                <IconButton
                    aria-label="Toggle expand"
                    icon={isExpandAll ? <BsChevronBarContract /> : <BsChevronBarExpand />}
                    onClick={() => setIsExpandAll(!isExpandAll)}
                    variant="ghost"
                    mb="4"
                />
            </Tooltip>
        </Flex>
    );
}
