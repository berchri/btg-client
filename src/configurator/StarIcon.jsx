import { Icon, IconButton } from "@chakra-ui/react";
import { BsStar, BsStarFill } from "react-icons/bs";


export default function StarIcon({ active, onClick }) {
    return (
        <>
            <IconButton
                icon={<Icon as={active ? BsStarFill : BsStar} />}
                mx={2}
                colorScheme="swiorange"
                variant='outline'
                isRound='true'
                size='xs'
                fontSize='16px'
                onClick={onClick}
            />
        </>
    );
};