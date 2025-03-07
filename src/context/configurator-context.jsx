import { list } from "@chakra-ui/react";
import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from './auth-context';
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import { requests } from './requests';

const ConfiguratorContext = createContext({
    projectDetails: '',                         // Name des Projekts
    elementTree: '',                            // Baumstruktur der Elemente
    setElementTree: () => { },                  // Setzen der Baumstruktur der Elemente
    revitCategories: [],                        // Liste der Revit Kategorien
    activeElement: '',                          // in der Baumstruktur ausgewähltes Element
    onChangeElement: () => { },                 // Wechsel des in der Baumstruktur ausgewählten Elements
    onConfigureNewElement: async () => { },     // Element in DB nicht vorhanden und muss konfiguriert werden
    activeElementPropertyList: [],                           // Liste der Elementeigenschaften
    updateActiveElementPropertyList: () => { },              // Ändern der Elementeigenschaften
    // activeConfigSection: {},                 // In der Konfiguration gewähltes Property oder allgemeine Einstellungen
    onChangeConfigSection: () => { },           // User wechsel zwischen Konfiguration der Elementeigenschaften oder zu allgemeinen Elementeinstellungen.
    elementDetails: '',                         // allgemeine Elementeinstellungen
    activeSettings: '',                         // In der Konfiguration gewähltes Property
    changeActiveSettings: () => { },            // Wechsel zwischen den Properties
    setActiveSettings: () => { },               // Setzen des aktiven Properties
    getActiveSettings: () => { },               // Abrufen des aktiven Properties
    updateElementDetails: () => { },            // Ändern der allgemeinen Elementeinstellungen
    propertySettingsList: [],                   // Liste aller Einstellungen der Properties 
    updatePropertySettingsList: () => { },      // Ändern der Einstellung eines Properties
    updatePropertyName: () => { },              // 
    onSaveData: async () => { },                // Speichern der eingegebenen Daten
    onSaveTree: async () => { },                // Speichern der Elementstruktur
    onRefreshTree: async () => { },             // Aktualisieren der Elementstruktur
    onRestart: () => { },                       // Zurücksetzen des aktiven Elements
    // changedData: false,                      // Änderungen an den Daten
    // setChangedData: () => { },               // Änderungen an den Daten
    unsavedData: false,                         // Änderungen an den Daten vorhanden
    updatePropertyDependency: () => { },        // Ändern der Abhängigkeiten der Properties
    setElementDetails: () => { },               // Setzen der allgemeinen Elementeinstellungen
    removeElement: () => { }                    // Löschen des Elements
})

const newElement = {
    prefix: '',
    columns: '',
    itwoKey: '',
    revitFamilyBasisSettingsListIndex: 8,
    revitCategory: 'OST_Walls',
    revitFamily: 'Basiswand',
    revitPattern: '<Flächenfüllung>',
    revitPatternColor: 32768,
    material: 'Ortbeton - bewehrt Verputzt',
    tableHeaders: [], // wird nach Modal in Komponente befüllt.
    typeNameSorting: [] // wird nach Modal in Komponente befüllt.
}

function ConfigContextProvider(props) {
    const { currentBimqProjectID, currentBimqRequirementsID } = useContext(AuthContext);

    const [elementTree, setElementTree] = useState(false)
    const [newElementTree, setNewElementTree] = useState([])
    const [projectDetails, setProjectDetails] = useState({})
    const [activeElementPropertyList, setActiveElementPropertyList] = useState([])
    const [activeElement, setActiveElement] = useState('')
    // const [activeConfigSection, setActiveConfigSection] = useState( '' )
    const [revitCategories, setRevitCategories] = useState([])
    const [elementDetails, setElementDetails] = useState({})
    const [propertySettingsList, setPropertySettingsList] = useState([])
    const [activeSettings, setActiveSettings] = useState({})

    const [configurationData, setConfigurationData] = useState([])
    const [newConfigurationData, setNewConfigurationData] = useState([])

    const [watcher, setWatcher] = useState(false)
    const [unsavedData, setUnsavedData] = useState(false)
    const [unsavedTreeData, setUnsavedTreeData] = useState(false)
    const [relationsData, setRelationsData] = useState({})

    useEffect(() => {
        if (watcher) {
            setUnsavedData(true)
        }

    }, [propertySettingsList, elementDetails])

    const saveElement = () => {
        const newElementData = { id: activeElement.id, name: activeElement.name, elementDetails, propertySettingsList, relationsData }
        const newCD = [...configurationData]
        const index = newCD.findIndex(e => e.id === activeElement.id)
        if (index < 0) {
            newCD.push({ ...newElementData })
        } else {
            newCD[index] = { ...newElementData }
        }
        return newCD
    }

    const onSaveData = async (type) => {
        const data = {
            projectID: projectDetails.projectID,
            projectName: projectDetails.projectName,
            requirementsID: projectDetails.requirementsID,
            requirementsName: projectDetails.requirementsName,
            mappingID: projectDetails.mappingID,
            configurationData: configurationData,
            elementTree: elementTree
        }

        if (type === 'element') {
            // save changed Element to configurationData
            data.configurationData = saveElement()
        }
        try {
            const response = await requests.sendPropertySettings(data);
            const saved = response.data;
            console.log('data saved: ', saved);

            if (saved !== null) {
                setElementTree([...saved.elementTree])
                setConfigurationData([...saved.configurationData])
                setUnsavedData(false)
                setUnsavedTreeData(false)
                setProjectDetails(prev => ({
                    ...prev,
                    existsOnDatabase: saved.configurationData.map(e => e.id)
                }))
            }
            return saved
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return null;
        }
    }

    async function onAppStart() {
        try {
            const categories = await requests.getCategories();
            const template = await requests.getTemplate(currentBimqProjectID, currentBimqRequirementsID);
            console.log('categories.data :>>', categories.data);
            console.log('template.data :>>', template.data);

            setRevitCategories(categories.data);

            if (template.data && template.data.elementTree.length > 0) {
                console.log('Template found on Database');
                setConfigurationData(template.data.configurationData);
                setProjectDetails({
                    requirementsName: template.data.bimqRequirementsName,
                    requirementsID: template.data.bimqRequirementsID,
                    projectName: template.data.bimqProjectName,
                    projectID: template.data.bimqProjectID,
                    mappingID: template.data.bimqMappingID,
                    existsOnDatabase: template.data.configurationData.map(e => e.id)
                });
                setElementTree(template.data.elementTree);
                setUnsavedTreeData(false);
            } else {
                console.log('No template found on Database');
                fetchElementTreeData();
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            alert('Fehler beim Abrufen der Daten.');
        }
    }

    async function fetchElementTreeData() {
        try {
            const mappingID = await requests.getMappingID(currentBimqProjectID);
            const concept = await requests.getConcept(currentBimqProjectID, currentBimqRequirementsID);
            console.log('mappingID.data.id :>>', mappingID.data.id);
            console.log('concept.data :>>', concept.data);

            setProjectDetails({
                requirementsName: concept.data.name,
                requirementsID: concept.data.id,
                projectName: concept.data.project,
                projectID: concept.data.project_id,
                mappingID: mappingID.data.id,
                existsOnDatabase: projectDetails.existsOnDatabase || []
            });
            setElementTree(concept.data.children);
            setUnsavedTreeData(true);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            alert('Fehler beim Abrufen der Daten von BIMQ.');
        }
    }

    const onRefreshTree = async () => {
        try {
            const concept = await requests.getConcept(currentBimqProjectID, currentBimqRequirementsID);
            const missingElements = checkNewTree(concept.data.children);
            if (missingElements.length === 0) {
                setNewElementTree([])
                setNewConfigurationData([])
                setUnsavedTreeData(true);
                setElementTree(concept.data.children);
            } else {
                setNewElementTree(concept.data.children);
            }
            return missingElements;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            alert('Fehler beim Abrufen der Daten von BIMQ.');
            return false;
        }
    }

    const checkNewTree = (newTreeData) => {
        const newTree = { id: 'root', children: newTreeData }

        const listElements = (children) => {
            let elements = [];
            for (const child of children) {
                if (!child.children || child.children.length === 0) {
                    elements.push({ id: child.id, name: child.name });
                } else {
                    elements = elements.concat(listElements(child.children));
                }
            }
            return elements;
        }

        const newTreeElements = listElements(newTree.children);

        const missingElements = []
        const newConfigurationData = []

        for (const config of configurationData) {
            if (newTreeElements.find(obj => obj.id === config.id)) {
                newConfigurationData.push(config)
            } else {
                missingElements.push({ id: config.id, name: config.name })
            }
        }

        setNewConfigurationData(newConfigurationData)
        console.log('missingElements :>> ', missingElements);
        return missingElements
    }

    const onAcceptNewTree = async () => {
        setUnsavedTreeData(true)
        setElementTree([...newElementTree])
        setNewElementTree([])
        setConfigurationData([...newConfigurationData])
        setNewConfigurationData([])
    }


    useEffect(() => {
        onAppStart();
    }, []);

    const onRestart = () => {
        setActiveElement('')
        setActiveSettings({})
        setPropertySettingsList([])
        setRelationsData({})
        setElementDetails({})
        setUnsavedData(false)
        setWatcher(false)
    }

    const removeElement = async (element) => {
        try {
            const response = await requests.removeElement(projectDetails, element);

            if (response.data !== null) {
                setConfigurationData(response.data.configurationData || []);
                console.log('response.data.configurationData :>>', response.data.configurationData);
            } else {
                setConfigurationData([]);
            }

            setProjectDetails(prev => ({
                ...prev,
                existsOnDatabase: response.data.configurationData.map(e => e.id)
            }));

            onRestart();
        } catch (error) {
            console.error('Failed to fetch data:', error);
            alert('Fehler beim Löschen des Elements.');
        }
    }

    const onChangeElement = async (treeNode) => {
        if (treeNode === activeElement) return
        onRestart()

        const index = configurationData.findIndex(e => e.id === treeNode.id)
        if (index >= 0) {
            const elementDetails = configurationData[index].elementDetails
            const propSettings = configurationData[index].propertySettingsList

            setElementDetails(elementDetails)
            setPropertySettingsList(propSettings)
            console.log('configurationData[index].relationsData :>>', configurationData[index].relationsData)
            setRelationsData(configurationData[index].relationsData)
        }
        setActiveElement(treeNode)
    }

    const onConfigureNewElement = async (bimqElementID = activeElement.id, elementDetails = newElement) => {
        try {
            const bimq = await requests.getElementProperties(bimqElementID, currentBimqProjectID, projectDetails.mappingID);
            const bimqList = bimq.data.children.filter(e => e.name !== 'iTWO_Key');
            const revitList = revitCategories[elementDetails.revitFamilyBasisSettingsListIndex].properties;
            const itwoKey = bimq.data.children.find(e => e.name === 'iTWO_Key').values[0].value;
            setPropertySettingsList([...revitList, ...bimqList]);
            setElementDetails({ ...newElement, itwoKey: itwoKey });
            return [...revitList, ...bimqList].map(e => ({ id: e.id, name: e.name, nameUI: e.nameUI, origin: e.origin }));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            alert('Fehler beim Abrufen der BIMQ Daten.');
            return null;
        }
    }

    const onChangeConfigSection = (e) => {
        setActiveSettings(propertySettingsList.find(obj => obj.id === e.id))
    }

    const updatePropertyList = (sortingList) => {
        const newSettingsList = sortingList.map(e => {
            const prop = propertySettingsList.find(obj => obj.id === e.id)
            if (prop) return { ...prop }
            return { ...e }
        })
        setPropertySettingsList(newSettingsList)
    }

    const updateElementDetails = (data) => {
        setElementDetails(data)
    }

    const changeActiveSettings = (prop) => {
        setActiveSettings({ ...propertySettingsList.find(obj => obj.id === prop.id) })
    }

    const updatePropertyName = (id, name) => {
        setPropertySettingsList(prev => {
            const element = prev.find(obj => obj.id === id);
            element.nameUI = name;
            return [...prev]
        })
    }

    const updatePropertySettingsList = (data) => {
        setActiveSettings({ ...data })
        setPropertySettingsList(prev => {
            const i = prev.findIndex(obj => obj.id === data.id);
            prev[i] = { ...data };
            console.log('updatePropertySettingsList', prev)
            return [...prev]
        })
    }

    const updatePropertyDependency = (activeSettings, influencingProperty) => {
        setPropertySettingsList(prev => {
            const indexActive = prev.findIndex(obj => obj.id === activeSettings.id);
            const indexInfluencing = prev.findIndex(obj => obj.id === influencingProperty.id);
            prev[indexActive] = { ...activeSettings };
            prev[indexInfluencing] = { ...influencingProperty };
            return [...prev]
        })
    }

    const getActiveSettings = (activeObj) => propertySettingsList.find(obj => {
        console.log('propertySettingsList :>>', propertySettingsList)
        if (activeObj.id) return obj.id === activeObj.id
        return obj.name === activeObj.name
    })


    const context = {
        projectDetails,
        elementTree,
        setElementTree,
        revitCategories,
        activeElement,
        onChangeElement,
        onConfigureNewElement,
        activeElementPropertyList,
        updatePropertyList,
        // activeConfigSection,
        onChangeConfigSection,
        elementDetails,
        activeSettings,
        changeActiveSettings,
        setActiveSettings,
        getActiveSettings,
        updateElementDetails,
        propertySettingsList,
        updatePropertySettingsList,
        updatePropertyName,
        onSaveData,
        onRefreshTree,
        unsavedData,
        onRestart,
        setElementDetails,
        updatePropertyDependency,
        removeElement,
        setWatcher,
        relationsData,
        setRelationsData,
        onAcceptNewTree,
        unsavedTreeData,
        // changedData,
        // setChangedData,
    }

    return <ConfiguratorContext.Provider value={context}>
        {props.children}
    </ConfiguratorContext.Provider>
}

const useConfigurator = () => {
    const context = useContext(ConfiguratorContext);
    if (context === undefined) {
        throw new Error('useConfigurator must be used within a ConfiguratorContextProvider');
    }
    return context;
};

export { ConfigContextProvider, useConfigurator }