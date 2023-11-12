import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";

/**
 * Custom hook for creating or editing cabins with mutation support
 * 
 * @returns {Object} - Object containing loading state and createCabin mutation function
 */
export function useCreateCabin() {
    // Use the useQueryClient() function to get the query client instance
    const queryClient = useQueryClient();

    // Use useMutation() to define mutation functions for creating and editing cabins

    // Creating a new cabin
    const {
        isLoading: isCreating,        // Flag indicating whether the mutation is in progress
        mutate: createCabin           // Mutation function for creating or editing cabins
    } = useMutation({
        mutationFn: createEditCabin,  // Use createEditCabin as the mutation function
        onSuccess: () => {
            // If creation is successful, show a success notification and invalidate the "cabins" query
            toast.success('Nuova cabina creata con successo');
            queryClient.invalidateQueries({ queryKey: ["cabins"] });
            // reset(); // Reset the React form (reset function)
        },
        onError: (error) => toast.error(error.message)  // Handle errors by showing an error notification
    });

    // Return the results of the mutation to the user of the hook
    return {
        isCreating,    // Flag indicating whether the mutation is in progress
        createCabin    // Mutation function for creating or editing cabins
    };
}
