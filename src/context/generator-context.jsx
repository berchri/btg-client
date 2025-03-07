import { list } from "@chakra-ui/react";
import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from './auth-context';

const GeneratorContext = createContext({
    projectDetails: '',                         // Name des Projekts
    elementTree: '',                            // Baumstruktur der Elemente
    setElementTree: () => { },                  // Setzen der Baumstruktur der Elemente
    revitCategories: [],                        // Liste der Revit Kategorien
    activeElement: '',                          // in der Baumstruktur ausgewähltes Element
    onChangeElement: () => { },                 // Wechsel des in der Baumstruktur ausgewählten Elements
    allowedTreePaths: [],                       //
    fetchElementProperties: async () => { },    //
    getElementDetails: () => { },               //
    setTypes: () => { },                        //
})

function GeneratorContextProvider(props) {
    const { currentBimqProjectID, currentBimqRequirementsID } = useContext(AuthContext);

    const [projectDetails, setProjectDetails] = useState({})
    const [elementTree, setElementTree] = useState(false)
    const [activeElement, setActiveElement] = useState('')
    const [templateData, setTemplateData] = useState([])
    // const [propertySettingsList, setPropertySettingsList] = useState( [] )
    // const [elementDetails, setElementDetails] = useState( [] )
    const [allowedTreePaths, setAllowedTreePaths] = useState([])
    const [typesCollection, setTypesCollection] = useState({})
    const [typesCollectionTable, setTypesCollectionTable] = useState({})

    // todo: requests auslagern
    const fetchElementTreeData = async () => {
        try {
            let concept = await fetch('/bimq/getConcept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bimqProjectID: currentBimqProjectID,
                    bimqRequirementsID: currentBimqRequirementsID
                })
            });

            concept = await concept.json();
            if (concept.status !== 'OK') {
                console.log('Error!')
                return
            }
            // console.log( 'concept :>>', concept )
            let template = await fetch('/get-template', {
                method: 'POST',
                body: JSON.stringify({
                    // bimqRequirementsID: concept.data.id,
                    bimqRequirementsID: currentBimqRequirementsID,
                    bimqProjectID: concept.data.project_id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            template = await template.json()

            if (template.status !== 'OK') {
                console.log('Error!')
                return
            }

            if (!template.data) {
                setElementTree([]);
                return
            }
            console.log('template.data :>>', template.data)
            filterElementTree(concept.data, template.data)
            setElementTree(concept.data.children);

            setTemplateData(template.data)

            const newTypesCollection = {}
            template.data.configurationData.forEach(e => { newTypesCollection[e.id] = [] })
            setTypesCollection(newTypesCollection)
            setTypesCollectionTable(newTypesCollection)

            let mappingID = await fetch('/bimq/getMappingID', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bimqProjectID: currentBimqProjectID,
                })
            })
            mappingID = await mappingID.json()
            if (mappingID.status !== 'OK') {
                console.log('Error!')
                return
            }

            setProjectDetails({
                requirementsName: concept.data.name,
                requirementsID: concept.data.id,
                projectName: concept.data.project,
                projectID: concept.data.project_id,
                mappingID: mappingID.data.id
            })
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    function filterElementTree(bimqElements, template) {
        const tree = bimqElements
        const idList = template.configurationData.map(element => element.id)
        const paths = []

        function findID(id, node) {
            if (node.id === id) paths.push(node.path)
            if (node.children) {
                node.children.forEach(child => {
                    findID(id, child);
                })
            }
        }

        for (const id of idList) {
            findID(id, tree)
        }
        console.log('paths :>>', paths)

        setAllowedTreePaths(paths)
    }

    useEffect(() => {
        fetchElementTreeData();
    }, []);


    const fetchElementProperties = (element) => {
        if (element === null) return
        console.log('element :>>', element)
        /*
        let bimq;
        try {
            bimq = await fetch( '/bimq/getElementProperties', {
                method: 'POST',
                body: JSON.stringify( {
                    bimqProjectID: currentBimqProjectID,
                    elementID: element.id,
                    mappingID: projectDetails.mappingID
                } ),
                headers: {
                    'Content-Type': 'application/json'
                }
            } );
            bimq = await bimq.json();
        } catch ( error ) {
            console.error( 'Failed to fetch data:', error );
        }
        if ( bimq.status !== 'OK' ) {
            console.log( 'Error!' )
            return null
        }
        console.log( 'bimq :>>', bimq )
        const bimqList = bimq.data.children
        */

        const configData = templateData.configurationData.find(e => e.id === element.id)

        console.log('configData XX:>>', configData)
        // console.log( 'bimqList :>>', bimqList )
        const mergedData = configData.propertySettingsList
        // fetch element properties entfernen
        // const mergedData = configData.propertySettingsList.map( settings => {
        //     const prop = bimqList.find( e => e.id === settings.id )
        //     if ( prop ) {
        //         // return { ...prop, settings: { ...settings } }
        //         const newProp = { ...settings, name: prop.name, inputType: prop.inputType }
        //         if ( prop.inputType === 'select' ) {
        //             newProp.values = newProp.values.map( ( e, i ) => { return { ...e, name: prop.values[i].value } } )
        //         }
        //         // console.log( 'prop :>>', prop )
        //         return newProp
        //     } else {
        //         return settings
        //     }
        // } )

        console.log('mergedData :>>', mergedData)

        return [...mergedData]
    }

    const getElementConfigurationData = (element) => {
        const elementConfig = templateData.configurationData.find(e => e.id === element.id)
        return elementConfig
    }

    // const getPropertySettingsList = ( element ) => {


    // const addType = ( type, element ) => {
    //     setTypesCollection( prev => {
    //         return {
    //             ...prev,
    //             [element.id]: [...prev[element.id], type]
    //         }
    //     } )
    // }

    // const removeType = ( index, element ) => {
    //     setTypesCollection( prev => {
    //         const newTypes = [...prev[element.id]]
    //         newTypes.splice( index, 1 )
    //         return {
    //             ...prev,
    //             [element.id]: [...newTypes]
    //         }
    //     } )
    // }

    const setTypes = (element, types, typesTable) => {
        setTypesCollection(prev => {
            return {
                ...prev,
                [element.id]: [...types]
            }
        })
        setTypesCollectionTable(prev => {
            return {
                ...prev,
                [element.id]: [...typesTable]
            }
        })
    }

    // function uuidv4() {
    //     return ( [1e7] + -1e3 + -4e3 + -8e3 + -1e11 ).replace( /[018]/g, c =>
    //         ( c ^ crypto.getRandomValues( new Uint8Array( 1 ) )[0] & 15 >> c / 4 ).toString( 16 )
    //     );
    // }

    const createExportData = () => {
        // const revit = await fetchRevitCategories()
        // console.log( 'revit :>>', revit )
        const exportData = {}
        for (const [elementID, typesListRef] of Object.entries(typesCollection)) {
            const typesList = typesListRef.map(type => ({ ...type }));
            const element = templateData.configurationData.find(e => e.id === Number(elementID));
            const details = element.elementDetails
            const group = details.revitCategory

            // const newObj = {}
            const newObjTemplate = {
                Basisfamilie: details.revitFamily,
                // Familienname: this.Name,
                Material: details.material,
                Muster: details.revitPattern,
                Musterfarbe: details.revitPatternColor,
                Parameter: {
                    iTWO_Key: details.itwoKey,
                    // SwiID: uuidv4()
                }
            }

            const revitProperties = element.propertySettingsList.filter(e => e.origin === 'Revit')
            for (const type of typesList) {
                const newObj = { ...newObjTemplate }
                revitProperties.forEach(e => {
                    if (e.exportPosition === 'root') {
                        newObj[e.name] = type[e.name]
                        delete type[e.name]
                    }
                })

                newObj.Familienname = type.name
                delete type.name

                newObj.Parameter = { ...newObj.Parameter, ...type }

                if (!exportData[group]) {
                    exportData[group] = [];
                }
                exportData[group].push(newObj)
            }
        }
        console.log('exportData :>>', exportData)
        return exportData
    }

    const fetchRevitCategories = async () => {
        let categories = await fetch('/revit-categories', { method: 'POST' });
        categories = await categories.json()
        if (categories.status !== 'OK') {
            console.log('Error!')
            return
        }
        return categories.data
    }

    const exportData = (exportCollection) => {
        let jsonData = JSON.stringify(exportCollection, null, 4);
        if (window.chrome?.webview) {
            postWebView2Message({ action: 'building-elements', payload: jsonData })
        }
    }

    const context = {
        projectDetails,
        setProjectDetails,
        elementTree,
        allowedTreePaths,
        setElementTree,
        activeElement,
        setActiveElement,
        onChangeElement: (element) => {
            setActiveElement(element)
        },
        fetchElementProperties,
        getElementConfigurationData,
        setTypes,
        typesCollection,
        typesCollectionTable,
        createExportData,
        exportData
    }

    return <GeneratorContext.Provider value={context}>
        {props.children}
    </GeneratorContext.Provider>
}


const useGenerator = () => {
    const context = useContext(GeneratorContext);
    if (context === undefined) {
        throw new Error('useGenerator must be used within a GeneratorContextProvider');
    }
    return context;
};

export function postWebView2Message({ action, payload }) {
    if (!action) {
        console.error('Action is required');
        return;
    }
    if (!window.chrome?.webview) {
        console.error('window.chrome.webview is not available');
        return;
    }

    console.log('Posting message:', { action, payload });
    window.chrome.webview.postMessage({ action, payload });
}

export { GeneratorContextProvider, useGenerator }