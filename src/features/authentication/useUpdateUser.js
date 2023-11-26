import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

/**
 * Custom hook for editing existing users with mutation support.
 * 
 * @returns {Object} - Object containing loading state and the `updateUser` mutation function.
 */
export function useUpdateUser() {
    // Use the `useQueryClient()` function to get an instance of the query client
    const queryClient = useQueryClient();

    // Editing an existing user
    const {
        isLoading: isUpdating,   // Flag indicating whether the mutation is in progress
        mutate: updateUser      // Mutation function for editing users
    } = useMutation({
        mutationFn: updateCurrentUser,  // Use `updateCurrentUser` with new data and ID
        onSuccess: ({ user }) => {
            // If editing is successful, show a success notification and invalidate the "user" query
            toast.success('User successfully edited');
            // queryClient.setQueryData('user', user)
            queryClient.invalidateQueries({ queryKey: ["user"] });
            // reset(); // Reset the React form (reset function)
        },
        onError: (error) => toast.error(error.message)  // Handle errors by showing an error notification
    });

    // Return the results of the mutation to the user of the hook
    return {
        isUpdating,    // Flag indicating whether the mutation is in progress
        updateUser     // Mutation function for editing users
    };
}
