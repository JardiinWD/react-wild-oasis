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

    /* {
        field: 'totalPrice',
        value: 5000,
        method: "gte"
    } */

    // 4.  Ottieni il valore di 'sortBy' dai parametri di ricerca dell'URL, se non presente utilizza 'startDate-desc' come valore di default
    const sortByRaw = searchParams.get("sortBy") || 'startDate-desc';

    // Dividi il valore di 'sortBy' in due parti: il campo per il sorting e la direzione di ordinamento
    const [field, direction] = sortByRaw.split("-")

    // Costruisci l'oggetto sortBy contenente il campo e la direzione di ordinamento
    const sortBy = {
        field,        // Campo per l'ordinamento, estratto dai parametri di ricerca 'sortBy'
        direction     // Direzione di ordinamento, estratta dai parametri di ricerca 'sortBy'
    }

    // Pagination
    const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'))

    // 5. Utilizza il hook useQuery per ottenere le prenotazioni
    const {
        isLoading,     // Flag per indicare se i dati sono in fase di caricamento
        data: {
            data: bookings,
            count
        } = {}, // Dati delle prenotazioni ottenuti dalla query
        error          // Eventuali errori durante il caricamento dei dati
    } = useQuery({
        queryKey: ['bookings', filter, sortBy, page], // Chiave unica per questa query
        queryFn: () => getBookings({ filter, sortBy, page }), // Funzione che chiama il servizio API per ottenere le prenotazioni, passando il filtro se presente
    });

    // 6. Restituisci i risultati della query all'utilizzatore dello hook
    return {
        isLoading, // Flag per indicare se i dati sono in fase di caricamento
        error,     // Eventuali errori durante il caricamento dei dati
        bookings,   // Dati delle prenotazioni ottenuti dalla query
        count
    };
}
