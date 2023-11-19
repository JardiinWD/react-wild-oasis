import React, { useEffect } from 'react'
import { useUser } from '../features/authentication/useUser';
import Spinner from './Spinner';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FullPage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    justify-content: center;
    align-items: center
`;

const ProtectedRoute = ({children}) => {
    const navigate = useNavigate()

    // 1. Caricare l'utente autenticato
    const { user, isLoading, isAuthenticated} = useUser();
    // 2. Se non ci sono utenti autenticati esegure il rendering a /login
    useEffect(function(){
        if(!isAuthenticated && !isLoading) navigate('/login')
    }, [isAuthenticated, isLoading, navigate])

    // 3. Mentre carica mostrare a schermo lo spinner
    if (isLoading) return (
        <FullPage>
            <Spinner />
        </FullPage>
    )
    // 4. Se invece l'utente é autenticato allora può entrare nell'app
    if(isAuthenticated) return children;
}

export default ProtectedRoute
