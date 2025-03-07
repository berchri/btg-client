const fs = require( 'fs' );

const dbworkdata = fs.readFileSync( './dbwork+ifc+values.json', 'utf8' );
const dbhomedata = fs.readFileSync( './dbhome.json', 'utf8' );
const dbWork = JSON.parse( dbworkdata );
const dbHome = JSON.parse( dbhomedata );
// debugger
const confDataWork = dbWork.configurationData;
const confDataHome = dbHome.configurationData;

const newConfData = []

for ( const element of confDataWork ) {
    const newPropertySettingsList = []
    const elementHome = confDataHome.find( item => item.id === element.id );
    if ( !elementHome ) {
        console.log( 'Element not found: ', element.id );
        continue
        debugger
    }
    for ( const prop of element.propertySettingsList ) {
        if ( prop.origin === 'Revit' ) {
            newPropertySettingsList.push( prop )
            continue
        }

        const propHome = elementHome.propertySettingsList.find( item => item.id === prop.id );
        if ( !propHome ) {
            debugger
        }

        newPropertySettingsList.push( {
            ...prop,
            active: propHome.active,
            origin: 'BIMQ',
            bimqType: propHome.bimqType,
            ifcType: propHome.ifcType,
            ifcUnit: propHome.ifcUnit,
        } )
    }
    // debugger
    newConfData.push( { ...element, propertySettingsList: newPropertySettingsList } )
}

fs.writeFileSync( './result.json', JSON.stringify( { ...dbWork, configurationData: newConfData }, null, 2 ) );

