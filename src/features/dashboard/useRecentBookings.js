// Importing the useQuery hook from React Query for fetching data
import { useQuery } from "@tanstack/react-query";
// Importing utility function subDays from date-fns for date calculations
import { subDays } from "date-fns";
// Importing the useSearchParams hook from react-router-dom for accessing URL query parameters
import { useSearchParams } from "react-router-dom";
// Importing the API function for fetching bookings after a specific date
import { getBookingsAfterDate } from "../../services/apiBookings";

// Custom hook for fetching recent bookings based on query parameters
export function useRecentBookings() {
    // Obtaining URL search parameters using useSearchParams
    const [searchParams] = useSearchParams();
    // Determining the number of days from the 'last' query parameter or defaulting to 7 days
    const numDays = !searchParams.get('last') ? 7 : Number(searchParams.get('last'));
    // Calculating the query date by subtracting the number of days from the current date
    const queryDate = subDays(new Date(), numDays).toISOString();

    // Using the useQuery hook to fetch bookings after the calculated query date
    const { isLoading, data: bookings } = useQuery({
        queryFn: () => getBookingsAfterDate(queryDate),  // Function to fetch bookings after the specified date
        queryKey: ['bookings', `last-${numDays}`]        // Key for caching and invalidating the query
    });

    // Returning relevant data for the component using this hook
    return { isLoading, bookings };
}
