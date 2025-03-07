import { Icon, Text } from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";


export default function Crumps({ activeElement }) {
    let pNames = [...activeElement.parentNames]
    pNames.shift()
    return (
        <>
            {pNames.map((e, i) =>
                <Text key={i} isTruncated>{e}<span><Icon as={BsChevronRight} height='10px' /></span></Text>
            )}
        </>
    );
};