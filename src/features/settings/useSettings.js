// Importing the useQuery hook from React Query for fetching data
import { useQuery } from "@tanstack/react-query";
// Importing the API function for fetching application settings
import { getSettings } from "../../services/apiSettings";

// Custom hook for fetching application settings
export function useSettings() {
    // Using the useQuery hook to fetch application settings
    const {
        isLoading,          // Flag indicating whether the query is in progress
        error,              // Error object containing details if the query encounters an error
        data: settings      // Fetched data containing application settings
    } = useQuery({
        queryKey: ['settings'],  // Key for caching and invalidating the query
        queryFn: getSettings,    // Function to fetch application settings
    });

    // Returning relevant data for the component using this hook
    return {
        isLoading,  // Flag indicating whether the query is in progress
        error,      // Error object containing details if the query encounters an error
        settings    // Fetched data containing application settings
    };
}
