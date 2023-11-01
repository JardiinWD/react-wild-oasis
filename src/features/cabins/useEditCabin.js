import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditCabin() {
    // Usa la funzione useQueryClient() per ottenere l'istanza del client di query
    const queryClient = useQueryClient();

    // Modifica di una cabina esistente
    const {
        isLoading: isEditing,
        mutate: editCabin
    } = useMutation({
        mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id), // Utilizza createEditCabin con nuovi dati e ID
        onSuccess: () => {
            // Se la modifica ha successo, mostra una notifica di successo e invalida la query "cabins"
            toast.success('Cabina modificata con successo');
            queryClient.invalidateQueries({ queryKey: ["cabins"] });
            // reset(); Resetta il modulo React (funzione di reset)
        },
        onError: (error) => toast.error(error.message) // Gestisci gli errori mostrando una notifica di errore
    });

    return {
        isEditing, editCabin
    }

}