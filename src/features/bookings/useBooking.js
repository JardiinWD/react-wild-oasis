import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

/**
 * Custom hook to fetch and manage Booking data
 * 
 * @returns {Object} - Object containing loading state, data, and error
 */
export function useBooking() {
    // Get ID from URL
    const { bookingId } = useParams();

    // Use the useQuery hook to fetch Booking data from Supabase
    const {
        isLoading,          // Flag indicating whether the data is in the process of loading
        data: booking,       // Booking data obtained from the query
        error               // Error, if any, during the query execution
    } = useQuery({
        queryKey: ['booking'],  // Unique key for this query
        queryFn: () => getBooking(bookingId),    // Function to fetch Booking data
        retry: false, // Evitare di rifetchare + di 3 volte i dati con React Query
    });

    // Return the results of the query to the user of the hook
    return {
        isLoading,  // Flag indicating whether the data is in the process of loading
        error,      // Error, if any, during the query execution
        booking      // Booking data obtained from the query
    };
}
