import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins"

export function useDeleteCabin() {
    // Get query client for Invalidate cache handler
    const queryClient = useQueryClient()

    // Mutation for my supabase rows with React Query
    const {
        isLoading: isDeleting,
        mutate: deleteCabin
    } = useMutation({
        // Mutation function
        mutationFn: deleteCabinApi,
        // Invalidate cache on successful
        onSuccess: () => {
            toast.success('Cabin succesfully deleted')
            queryClient.invalidateQueries({
                queryKey: ['cabins']
            })
        },
        onError: (error) => toast.error(error.message)
    })

    return {
        isDeleting,
        deleteCabin
    }
}