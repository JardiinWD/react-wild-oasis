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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Quantità di tempo in cui i dati restano nella cache
      // staleTime: 60 * 1000,
      staleTime: 0
    }
  }
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
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
              <Route path='users' element={<Users />} />
            </Route>
            <Route path='login' element={<Login />} />
            <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position='top-center' 
        gutter={12} 
        containerStyle={{
          margin: '8px'
        }} 
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          }, 
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px',
            backgroundColor: 'var(--color-grey-0)',
            color: 'var(--color-grey-700)',
          }        
        }}
      />
    </QueryClientProvider>
  )
}

export default App
