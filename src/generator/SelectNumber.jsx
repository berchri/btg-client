import { FormControl, FormHelperText, FormLabel, InputGroup, InputRightAddon, Select } from "@chakra-ui/react";


export default function SelectNumber({ property, formData, setFormData, shortnames, setShortnames, handleMeasureDependencies }) {
    const { name, nameUI, values, ifcUnitAbbr, influenceOn } = property;
    const { value, isValid } = formData[name];

    const handleChange = (e) => {
        const i = e.target.selectedIndex;

        if (influenceOn.length > 0) {
            const newFormData = { ...formData, [name]: { value: e.target.value, nrValue: values[i].nrValue, isValid } };
            const newShortnames = { ...shortnames, [name]: values[i].shortname };

            handleMeasureDependencies(property, newFormData, newShortnames)
        } else {
            setFormData(prev => ({ ...prev, [name]: { value: e.target.value, nrValue: values[i].nrValue, isValid } }))
            setShortnames(prev => ({ ...prev, [name]: values[i].shortname }))
        }
    }

    return (
        <FormControl py='6'>
            <FormLabel >{nameUI || name}</FormLabel >
            <InputGroup>
                <Select
                    name={name}
                    onChange={handleChange}
                    value={value}
                    borderRightRadius={property.bimqType === 'Measurements' && 0}
                >
                    {values.map((e, i) =>
                        <option key={i} value={e.value} >
                            {e.value}
                        </option>)}
                </Select>
                {ifcUnitAbbr && <InputRightAddon>{ifcUnitAbbr}</InputRightAddon>}
            </InputGroup>
            {nameUI && <FormHelperText>{name}</FormHelperText>}
        </FormControl>
    );
};