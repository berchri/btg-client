import { Box, Flex, propNames, } from "@chakra-ui/react";
import ElementConfig from "./ElementConfig";
import SelectInputConfig from "./inputs/SelectInputConfig";
import TextInputConfig from "./inputs/TextInputConfig";
import BooleanInputConfig from "./inputs/BooleanInputConfig";
import RevitInputConfig from "./inputs/RevitInputConfig";
import NumberInputConfig from "./inputs/NumberInputConfig";
// import SelectInputConfigNew from "./SelectInputConfigNew";

export default function InputConfigSection({ active }) {

    const form = () => {
        if (active.inputType === 'select' || active.inputType === 'select number') {
            return <SelectInputConfig active={active} />
        }
        if (active.inputType === 'number') {
            return <NumberInputConfig active={active} />
        }
        if (active.inputType === 'boolean') {
            return <BooleanInputConfig active={active} />
        }
        if (active === 'element') {
            return <ElementConfig active={active} />
        }
        if (active.inputType === 'text') {
            return <TextInputConfig active={active} />
        }
        if (active.origin === 'Revit') {
            return <RevitInputConfig active={active} />
        }

        // if ( active.child_concept && active.unit_reference !== 'Datatypes.IfcBoolean' ) {
        //     return <SelectInputConfig {...props} />
        // }
        // if ( active.unit_reference === 'Datatypes.IfcBoolean' ) {
        //     return <BooleanInputConfig {...props} />
        // }
        // if ( active === 'element' ) {
        //     return <ElementConfig {...props} />
        // }
        // if ( active && !active.child_concept && active !== 'element' ) {
        //     return <TextInputConfig {...props} />
        // }
    }
    // const input = () => {
    //     if ( active.child_concept && active.unit_reference !== 'Datatypes.IfcBoolean' ) {
    //         return <SelectInputConfigNew {...props}  />
    //     }

    // }
    return (
        <Box p='2' w='50%' h='100%' minW='min-content' overflow='clip'>
            {/* {active === 'element' || Object.keys( active ).length !== 0 ? form() : null} */}
            {form()}
        </Box>
    )
}