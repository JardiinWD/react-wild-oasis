import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins() {
    // Get my cabins from supabase
    const { isLoading, data: cabins, error } = useQuery({
        queryKey: ['cabins'],
        queryFn: getCabins,
    })

    return {
        isLoading, error, cabins
    }
}