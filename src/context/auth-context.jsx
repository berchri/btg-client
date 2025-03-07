import { createContext, useState } from "react";

const AuthContext = createContext({
    user: '',
    userFullName: '',
    loggedIn: false,
    // authToken: '',
    login: (status, user) => { },
    logout: () => { },
    currentBimqProjectID: '',
    currentBimqRequirementsID: ''
})

function AuthContextProvider(props) {
    const [user, setUser] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [userFullName, setUserFullName] = useState('')
    const [currentBimqProjectID, setCurrentBimqProjectID] = useState('')
    const [currentBimqRequirementsID, setCurrentBimqRequirements] = useState('')
    // const [ authToken, setToken ] = useState( '' )

    function login(status, user, projectID, requirementsID) {
        setLoggedIn(status)
        setUser(user)
        setUserFullName(user.displayName)
        setCurrentBimqProjectID(parseInt(projectID) || '')
        setCurrentBimqRequirements(parseInt(requirementsID) || '')
        // setToken( '' )
        // console.log( 'user: ', user )
    }

    function logout() {
        setUser('')
        setLoggedIn(false)
        // setToken( '' )
    }

    const context = {
        user,
        loggedIn,
        userFullName,
        login,
        logout,
        currentBimqProjectID,
        currentBimqRequirementsID
    }

    return <AuthContext.Provider value={context}>
        {props.children}
    </AuthContext.Provider>
}

export { AuthContext }
export default AuthContextProvider