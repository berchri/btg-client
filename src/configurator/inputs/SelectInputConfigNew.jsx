import React, { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";


export default function SelectInputConfigNew({ active, settings }) {

    const [activeProp, setActiveProp] = useState({ ...active });
    const [data, setData] = useState({ ...settings });

    useEffect(() => {
        setActiveProp({ ...active });
        setData({ ...settings });

    }, [active, settings]);

    return (
        <>
            {Object.keys(activeProp).length !== 0 &&
                data.values.map((_, i) => <Text key={i}>{i}</Text>)
            }
        </>
    );
};