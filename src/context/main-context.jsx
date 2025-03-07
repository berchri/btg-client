import { createContext, useContext, useEffect, useState } from "react";
import { requests } from "./requests.js";

const MainContext = createContext({
    getConversionFactor: () => { },
    getUnitsList: () => { }
})

function MainContextProvider(props) {
    const [units, setUnits] = useState([]);

    const getUnits = async () => {
        try {
            const units = await requests.getUnits();
            setUnits(units.data);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUnits();
    }, [])

    const getUnitsList = (unitType) => {
        return units.find(e => e.unitType === unitType)?.units || null
    }

    const getConversionFactor = (ifcType, unit) => {
        const units = getUnitsList(ifcType);
        let factor = 1

        if (units) {
            const unitObj = units.find(e => e.name === unit);
            if (unitObj) {
                factor = unitObj.factor
            }
        }

        const baseToUI = (nr) => {
            if (nr === '') return ''
            return new Intl.NumberFormat('de-DE',
                { minimumFractionDigits: 0, maximumFractionDigits: 4, useGrouping: false }
            ).format(nr * factor)
        };
        const uiToBase = (nr) => {
            if (nr === '') return ''
            if (typeof nr === 'string') nr = nr.replace(',', '.')
            if (isNaN(nr)) return ''
            return (nr * 1) / factor
        };

        return [uiToBase, baseToUI]
    }

    const context = {
        getConversionFactor,
        getUnitsList,
        units
    }

    return <MainContext.Provider value={context}>
        {props.children}
    </MainContext.Provider>

};

const useMain = () => {
    const context = useContext(MainContext);
    if (context === undefined) {
        throw new Error('useMain must be used within a ConfiguratorContextProvider');
    }
    return context;
}

export { useMain }
export default MainContextProvider