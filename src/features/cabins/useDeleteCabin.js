import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

/**
 * Custom hook for deleting cabins with mutation support
 * 
 * @returns {Object} - Object containing loading state and deleteCabin mutation function
 */
export function useDeleteCabin() {
    // Get the query client for cache invalidation
    const queryClient = useQueryClient();

    // Mutation for deleting Supabase rows using React Query
    const {
        isLoading: isDeleting,      // Flag indicating whether the mutation is in progress
        mutate: deleteCabin         // Mutation function for deleting cabins
    } = useMutation({
        // Mutation function
        mutationFn: deleteCabinApi,
        // Invalidate cache on successful deletion
        onSuccess: () => {
            toast.success('Cabina eliminata con successo');
            queryClient.invalidateQueries({
                queryKey: ['cabins']
            });
        },
        onError: (error) => toast.error(error.message)  // Handle errors by showing an error notification
    });

    // Return the results of the mutation to the user of the hook
    return {
        isDeleting,    // Flag indicating whether the mutation is in progress
        deleteCabin    // Mutation function for deleting cabins
    };
}
