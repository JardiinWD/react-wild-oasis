// Importing the useQuery hook from React Query for fetching data
import { useQuery } from "@tanstack/react-query";
// Importing utility function subDays from date-fns for date calculations
import { subDays } from "date-fns";
// Importing the useSearchParams hook from react-router-dom for accessing URL query parameters
import { useSearchParams } from "react-router-dom";
// Importing the API function for fetching stays after a specific date
import { getStaysAfterDate } from "../../services/apiBookings";

// Custom hook for fetching recent stays based on query parameters
export function useRecentStays() {
    // Obtaining URL search parameters using useSearchParams
    const [searchParams] = useSearchParams();
    // Determining the number of days from the 'last' query parameter or defaulting to 7 days
    const numDays = !searchParams.get('last') ? 7 : Number(searchParams.get('last'));
    // Calculating the query date by subtracting the number of days from the current date
    const queryDate = subDays(new Date(), numDays).toISOString();

    // Using the useQuery hook to fetch stays after the calculated query date
    const { isLoading, data: stays } = useQuery({
        queryFn: () => getStaysAfterDate(queryDate),  // Function to fetch stays after the specified date
        queryKey: ['stays', `last-${numDays}`]        // Key for caching and invalidating the query
    });

    // Filtering stays to include only confirmed stays with status 'checked-in' or 'checked-out'
    const confirmedStays = stays?.filter(stay => stay?.status === 'checked-in' || stay?.status === 'checked-out');

    // Returning relevant data for the component using this hook
    return { isLoading, stays, confirmedStays, numDays };
}
