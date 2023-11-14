// Import necessary dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Hook function to handle the check-in operation
export function useCheckin() {
    // Get the query client instance
    const queryClient = useQueryClient();

    // Get the navigation function from React Router
    const navigate = useNavigate();

    // Use the useMutation hook to define mutation functions for check-in
    const {
        mutate: checkin,      // Function to initiate the check-in operation
        isLoading: isCheckingIn // Flag indicating whether the check-in operation is in progress
    } = useMutation({
        // Use the update function to perform check-in
        mutationFn: ({ bookingId, breakfast }) => updateBooking(bookingId, {
            status: 'checked-in',  // Update the status to 'checked-in'
            isPaid: true,           // Set the 'isPaid' flag to true
            ...breakfast            // Include breakfast details if available
        }),
        // Function to execute on successful check-in
        onSuccess: (data) => {
            toast.success(`Booking #${data.id} successfully checked in`); // Success notification
            queryClient.invalidateQueries({ active: true }); // Invalidate the active query for booking data
            navigate("/"); // Navigate to the homepage
        },
        // Error handling with an error notification
        onError: () => toast.error('There was an error while checking in')
    });

    // Return the check-in function and the status flag
    return {
        checkin,        // Function to initiate the check-in operation
        isCheckingIn    // Flag indicating whether the check-in operation is in progress
    };
}
