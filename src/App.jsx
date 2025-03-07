import React, { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';

import { AuthContext } from './context/auth-context';
import './App.css';

import ElementConfigurator from './pages/ElementConfigurator';
import MainNavigation from './shared/MainNavigation';
import { Flex, Box } from '@chakra-ui/react';
import ElementGenerator from './pages/ElementGenerator';
import DatabaseManagement from './pages/DatabaseManagement';
import Welcome from './components/welcome';
import MainContextProvider, { MainContext } from './context/main-context';

function App() {
  const ctxAuth = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const queryString = new URLSearchParams(window.location.search)
    const projectID = queryString.get('bimqcontextid')
    const requirementsID = queryString.get('bimqrequirementid')

    fetch('/start', {
      method: 'post',
      // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // body: new URLSearchParams( { username: validUsername, password: validPassword } )
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'OK') {
          ctxAuth.login(true, data.user, projectID, requirementsID)
          if (data.user.role !== 'admin') {
            navigate('/create-types?' + queryString.toString())
          }
          return
        }
        if (data.status === 'error') {
          console.log(data.message)
          return
        }
      })
      .catch(err => { console.log('error') })
  }, [])

  function routesLoggedIn() {
    if (ctxAuth.user.role === 'admin') {
      return (
        <Routes>
          <Route path='/' element={<Welcome name={ctxAuth.userFullName} projectID={ctxAuth.currentBimqProjectID} requirementsID={ctxAuth.currentBimqRequirementsID} />} />
          <Route path='/database' element={<DatabaseManagement />} />
          <Route path='/create-types' element={
            <MainContextProvider>
              <ElementGenerator />
            </MainContextProvider>
          } />
          <Route path='/configure-elements' element={
            <MainContextProvider>
              <ElementConfigurator />
            </MainContextProvider>
          } />
        </Routes>
      )
    } else {
      return (
        <Routes>
          <Route path='/create-types' element={
            <MainContextProvider>
              <ElementGenerator />
            </MainContextProvider>
          } />
        </Routes>
      )
    }
  }

  // const routesPublic = <div>not logged In</div>
  function routesPublic() {
    return <div><p>not logged In</p>
      <a href='/login'>Login</a>
    </div>
  }

  return (
    <Flex h='100vh'>
      {ctxAuth.loggedIn && ctxAuth.user.role === 'admin' && <MainNavigation />}
      {ctxAuth.loggedIn ? routesLoggedIn() : routesPublic()}
    </Flex>
  )
}
// {context.loggedIn ? routesLoggedIn : routesPublic}

export default App;
