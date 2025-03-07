import { use, useContext, useEffect } from 'react';
import { createContext, useState } from 'react';
import { useConfigurator } from './configurator-context';

const RelationsContext = createContext();

const RelationsProvider = ({ children }) => {
    const { propertySettingsList, relationsData, setRelationsData } = useConfigurator();
    const [relations, setRelations] = useState({ valueToTarget: [], selectToSelect: [] });

    useEffect(() => {
        console.log('relationsData changed :>>', relationsData)
        if (Object.keys(relationsData).length > 0) {
            setRelations({ ...relationsData });
        } else {
            setRelationsData({ valueToTarget: [], selectToSelect: [] });
        }
    }, [relationsData])

    const getInfluenceList = (type, targetID) => {
        if (type === 'valueToTarget') {
            return relations.valueToTarget.filter(rel => rel.to === targetID)

        }
        if (type === 'selectToSelect') {
            return relations.selectToSelect.filter(rel => rel.from === targetID)
        }
    }

    const getPossibleDependencies = (type, currProp) => {
        if (type === 'valueToTarget') {
            const possibleDependencyPropList = propertySettingsList.filter(prop => {
                if (prop.id === currProp.id) return false
                if (prop.inputType === 'select') {
                    if (prop.values?.every(e => typeof e.nrValue === 'number' && e.nrValue !== '')) return true
                }
                if (prop.inputType === 'select number') {
                    if (prop.ifcType === currProp.ifcType) return true
                }
                if (prop.inputType === 'number' || prop.origin === 'Revit') {
                    if (prop.ifcType === currProp.ifcType) return true
                }
                return false
            })
            return possibleDependencyPropList
        }

        if (type === 'selectToSelect') {
            const possibleDependencyPropList = propertySettingsList.filter(prop => {
                if (prop.id === currProp.id) return false
                if (prop.inputType === 'select' || prop.inputType === 'select number') return true
                return false
            })
            return possibleDependencyPropList
        }
    }

    const setInfluence = (type, relation) => {
        if (type === 'valueToTarget') {
            let newValueToTarget = relations.valueToTarget.filter(rel => rel.from !== relation.from && rel.to === relation.to)
            newValueToTarget = [...newValueToTarget, relation]

            const newRelations = { ...relations, valueToTarget: newValueToTarget }

            setRelations(newRelations)
            setRelationsData(newRelations)
            if (type === 'selectToSelect') {
            }
        }

        if (type === 'selectToSelect') {
            let newSelectToSelect = relations.selectToSelect.filter(rel => rel.from !== relation.from && rel.to === relation.to)
            newSelectToSelect = [...newSelectToSelect, relation]

            const newRelations = { ...relations, valueToTarget: newSelectToSelect }

            setRelations(newRelations)
            setRelationsData(newRelations)

        }
    }

    const removeInfluence = (type, from, to) => {
        if (type === 'valueToTarget') {
            setRelations(prev => {
                prev.valueToTarget = prev.valueToTarget.filter(rel => rel.from !== from && rel.to === to)
                return { ...prev }
            })
        }
        if (type === 'selectToSelect') {
        }
    }


    const context = {
        setInfluence,
        removeInfluence,
        getInfluenceList,
        getPossibleDependencies,
        relations,
        setRelations
    };

    return (
        <RelationsContext.Provider value={context}>
            {children}
        </RelationsContext.Provider>
    );
};

const useRelations = () => {
    const context = useContext(RelationsContext);
    if (context === undefined) {
        throw new Error('useRelations must be used within a RelationsContextProvider');
    }
    return context;
}


export { useRelations, RelationsProvider };