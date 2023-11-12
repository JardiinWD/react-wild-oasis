import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

/**
 * Custom hook for editing existing cabins with mutation support
 * 
 * @returns {Object} - Object containing loading state and editCabin mutation function
 */
export function useEditCabin() {
    // Use the useQueryClient() function to get the query client instance
    const queryClient = useQueryClient();

    // Editing an existing cabin
    const {
        isLoading: isEditing,        // Flag indicating whether the mutation is in progress
        mutate: editCabin            // Mutation function for editing cabins
    } = useMutation({
        mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),  // Use createEditCabin with new data and ID
        onSuccess: () => {
            // If editing is successful, show a success notification and invalidate the "cabins" query
            toast.success('Cabina modificata con successo');
            queryClient.invalidateQueries({ queryKey: ["cabins"] });
            // reset(); // Reset the React form (reset function)
        },
        onError: (error) => toast.error(error.message)  // Handle errors by showing an error notification
    });

    // Return the results of the mutation to the user of the hook
    return {
        isEditing,    // Flag indicating whether the mutation is in progress
        editCabin     // Mutation function for editing cabins
    };
}
