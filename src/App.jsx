import React from 'react'
import GlobalStyles from './styles/GlobalStyles'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Account from './pages/Account'
import Bookings from './pages/Bookings'
import Cabins from './pages/Cabins'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Users from './pages/Users'
import PageNotFound from './pages/PageNotFound'
import AppLayout from './ui/AppLayout'


const App = () => {
  return (
    <>
    <GlobalStyles />
    <BrowserRouter>
      <Routes>
        {/* App Layout Routes children */}
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to='dashboard' />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='bookings' element={<Bookings />} />
            <Route path='cabins' element={<Cabins />} />
            <Route path='account' element={<Account />} />
            <Route path='settings' element={<Settings />} />
            <Route path='user' element={<Users />} />
          </Route>
          <Route path='login' element={<Login />} />
          <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
   </>
  )
}

export default App
