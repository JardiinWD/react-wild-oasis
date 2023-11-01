import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";

export function useCreateCabin() {

    // Usa la funzione useQueryClient() per ottenere l'istanza del client di query
    const queryClient = useQueryClient();

    // Usa useMutation() per definire le funzioni di mutazione per la creazione e modifica delle cabine

    // Creazione di una nuova cabina
    const {
        isLoading: isCreating,
        mutate: createCabin
    } = useMutation({
        mutationFn: createEditCabin, // Utilizza createEditCabin come funzione di mutazione
        onSuccess: () => {
            // Se la creazione ha successo, mostra una notifica di successo e invalida la query "cabins"
            toast.success('Nuova cabina creata con successo');
            queryClient.invalidateQueries({ queryKey: ["cabins"] });
            // reset(); Resetta il modulo React (funzione di reset)
        },
        onError: (error) => toast.error(error.message) // Gestisci gli errori mostrando una notifica di errore
    });

    return {
        isCreating, createCabin
    }

}