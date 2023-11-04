import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";
import toast from "react-hot-toast";

export function useEditSettings() {
    // Usa la funzione useQueryClient() per ottenere l'istanza del client di query
    const queryClient = useQueryClient();

    // Modifica di una cabina esistente
    const {
        isLoading: isUpdating,
        mutate: updateSetting
    } = useMutation({
        mutationFn: updateSettingApi, // Utilizza createEditCabin con nuovi dati e ID
        onSuccess: () => {
            // Se la modifica ha successo, mostra una notifica di successo e invalida la query "cabins"
            toast.success('Impostazioni modificate con successo');
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            // reset(); Resetta il modulo React (funzione di reset)
        },
        onError: (error) => toast.error(error.message) // Gestisci gli errori mostrando una notifica di errore
    });

    return {
        isUpdating, updateSetting
    }

}