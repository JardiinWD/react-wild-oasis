import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

// Funzione hook per gestire le prenotazioni
export function useBookings() {
    // 1. Ottieni i parametri di ricerca dall'URL
    const [searchParams] = useSearchParams();

    // 2. Ottieni il valore del filtro dal parametro di ricerca 'status'
    const filterValue = searchParams.get("status");

    // 3. Crea un oggetto di filtro in base al valore ottenuto
    const filter = !filterValue || filterValue === 'all' ? null : {
        field: 'status',
        value: filterValue
    }

    // 4. Utilizza il hook useQuery per ottenere le prenotazioni
    const {
        isLoading,     // Flag per indicare se i dati sono in fase di caricamento
        data: bookings, // Dati delle prenotazioni ottenuti dalla query
        error          // Eventuali errori durante il caricamento dei dati
    } = useQuery({
        queryKey: ['bookings'],              // Chiave unica per questa query
        queryFn: () => getBookings({ filter }), // Funzione che chiama il servizio API per ottenere le prenotazioni, passando il filtro se presente
    });

    // 5. Restituisci i risultati della query all'utilizzatore dello hook
    return {
        isLoading, // Flag per indicare se i dati sono in fase di caricamento
        error,     // Eventuali errori durante il caricamento dei dati
        bookings   // Dati delle prenotazioni ottenuti dalla query
    };
}
