import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Funzione personalizzata per gestire l'operazione di login
export function useLogin() {
    const queryClient = useQueryClient()
    // Ottieni la funzione di navigazione da React Router
    const navigate = useNavigate();

    // Utilizza useMutation per gestire l'operazione di login
    const {
        mutate: login, // Funzione di login generata da useMutation
        isLoading // Flag che indica se l'operazione è in corso
    } = useMutation({
        // Funzione che effettua la chiamata API di login con email e password
        mutationFn: ({ email, password }) => loginApi({ email, password }),
        // Gestione in caso di successo
        onSuccess: (user) => {
            queryClient.setQueriesData(['user'], user) // Set dei dati dello user dentro la cache
            navigate('/dashboard', {
                replace: true
            }); // Naviga verso la dashboard in caso di successo
        },
        // Gestione in caso di errore
        onError: (err) => {
            console.log('ERROR', err); // Log dell'errore per debug
            toast.error('L\'email o la password fornita non sono corrette'); // Notifica errore all'utente
        }
    });

    // Restituisce la funzione di login e il flag di caricamento
    return { login, isLoading };
}
