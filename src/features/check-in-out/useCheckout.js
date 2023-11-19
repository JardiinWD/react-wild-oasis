// Import necessary dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

// Hook function to handle the check-in operation
export function useCheckout() {
    // Get the query client instance
    const queryClient = useQueryClient();
    // Use the useMutation hook to define mutation functions for check-in
    const {
        mutate: checkout,      // Function to initiate the check-in operation
        isLoading: isCheckingOut // Flag indicating whether the check-in operation is in progress
    } = useMutation({
        // Use the update function to perform check-in
        mutationFn: (bookingId) => updateBooking(bookingId, {
            status: 'checked-out',  // Update the status to 'checked-in'
        }),
        // Function to execute on successful check-in
        onSuccess: (data) => {
            toast.success(`Booking #${data.id} successfully checked out`); // Success notification
            queryClient.invalidateQueries({ active: true }); // Invalidate the active query for booking data
        },
        // Error handling with an error notification
        onError: () => toast.error('There was an error while checking out')
    });

    // Return the check-in function and the status flag
    return {
        checkout,        // Function to initiate the check-out operation
        isCheckingOut    // Flag indicating whether the check-out operation is in progress
    };
}
