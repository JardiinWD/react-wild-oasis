import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

// Funzione personalizzata per gestire l'operazione di logout
export function useLogout() {
    // Ottieni la funzione di navigazione da React Router
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Utilizza useMutation per gestire l'operazione di logout
    const {
        mutate: logout, // Funzione di logout generata da useMutation
        isLoading // Flag che indica se l'operazione è in corso
    } = useMutation({
        mutationFn: logoutApi, // Funzione di logout proveniente dai servizi di autenticazione API
        // Gestione in caso di successo
        onSuccess: () => {
            // Rimuovi tutte le query dalla cache del client di query
            queryClient.removeQueries();

            // Reindirizza verso la pagina di login e sostituisci la storia della navigazione
            navigate('/login', {
                replace: true
            });
        }
    });

    // Restituisce la funzione di logout e il flag di caricamento
    return { logout, isLoading };
}
