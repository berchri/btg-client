const postRequest = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

/*
*********************
*   BIMQ Requests   *
*********************
*/

const getMappingID = async (currentBimqProjectID) => {
    let mappingID = await fetch('/bimq/getMappingID', {
        ...postRequest,
        body: JSON.stringify({
            bimqProjectID: currentBimqProjectID,
        })
    });
    mappingID = await mappingID.json();
    if (mappingID.status !== 'OK') {
        throw new Error('Error fetching template');
    }
    return mappingID;
}

const getConcept = async (currentBimqProjectID, currentBimqRequirementsID) => {
    let concept = await fetch('/bimq/getConcept', {
        ...postRequest,
        body: JSON.stringify({
            bimqProjectID: currentBimqProjectID,
            bimqRequirementsID: currentBimqRequirementsID
        })
    });
    concept = await concept.json();
    if (concept.status !== 'OK') {
        throw new Error('Error fetching concept');
    }
    return concept;
}

const getElementProperties = async (bimqElementID, currentBimqProjectID, mappingID) => {
    let response = await fetch('/bimq/getElementProperties', {
        ...postRequest,
        body: JSON.stringify({
            elementID: bimqElementID,
            bimqProjectID: currentBimqProjectID,
            mappingID: mappingID
        })
    });
    response = await response.json();
    if (response.status !== 'OK') {
        throw new Error('Error fetching element properties');
    }
    return response;
}

/*
************************
*   Backend Requests   *
************************
*/

const getUnits = async () => {
    let response = await fetch('/get-units', { ...postRequest });
    response = await response.json();
    if (response.status !== 'OK') {
        throw new Error('Error fetching units');
    }
    return response;
}

const getCategories = async () => {
    let categories = await fetch('/revit-categories', { ...postRequest });
    categories = await categories.json();
    if (categories.status !== 'OK') {
        throw new Error('Error fetching categories');
    }
    return categories;
}

const getTemplate = async (currentBimqProjectID, currentBimqRequirementsID) => {
    let template = await fetch('/get-template', {
        ...postRequest,
        body: JSON.stringify({
            bimqRequirementsID: currentBimqRequirementsID,
            bimqProjectID: currentBimqProjectID
        })
    });
    template = await template.json();
    if (template.status !== 'OK') {
        throw new Error('Error fetching template');
    }
    return template;
}

const sendPropertySettings = async (data) => {
    let response = await fetch('/save-template', {
        ...postRequest,
        body: JSON.stringify(data)
    });
    response = await response.json();
    if (response.status !== 'OK') {
        throw new Error('Error saving property settings');
    }
    return response;
}

const removeElement = async (projectDetails, element) => {
    let response = await fetch('/remove-element', {
        ...postRequest,
        body: JSON.stringify({
            bimqRequirementsID: projectDetails.requirementsID,
            bimqProjectID: projectDetails.projectID,
            bimqElementID: element.id
        })
    });
    response = await response.json();
    if (response.status !== 'OK') {
        throw new Error('Error removing element');
    }
    return response;
}

export const requests = {
    getUnits,
    getMappingID,
    getConcept,
    getCategories,
    getTemplate,
    sendPropertySettings,
    removeElement,
    getElementProperties
}

export default requests;