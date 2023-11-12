import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

/**
 * Custom hook to fetch and manage cabin data
 * 
 * @returns {Object} - Object containing loading state, data, and error
 */
export function useCabins() {
    // Use the useQuery hook to fetch cabin data from Supabase
    const {
        isLoading,          // Flag indicating whether the data is in the process of loading
        data: cabins,       // Cabin data obtained from the query
        error               // Error, if any, during the query execution
    }
        = useQuery({
            queryKey: ['cabins'],  // Unique key for this query
            queryFn: getCabins,    // Function to fetch cabin data
        });

    // Return the results of the query to the user of the hook
    return {
        isLoading,  // Flag indicating whether the data is in the process of loading
        error,      // Error, if any, during the query execution
        cabins      // Cabin data obtained from the query
    };
}
