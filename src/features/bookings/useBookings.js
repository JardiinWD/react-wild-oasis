// Importazione delle dipendenze necessarie
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

// Funzione hook per gestire le prenotazioni
export function useBookings() {
    //#region 1. Hooks Declaration

    // Ottenimento dell'istanza del client di query
    const queryClient = useQueryClient();
    // 1. Ottieni i parametri di ricerca dall'URL
    const [searchParams] = useSearchParams();

    //#endregion

    //#region 2. Filters Logic

    // Ottieni il valore del filtro dal parametro di ricerca 'status'
    const filterValue = searchParams.get("status");
    // Crea un oggetto di filtro in base al valore ottenuto
    const filter = !filterValue || filterValue === 'all' ? null : {
        field: 'status',
        value: filterValue
    }

    //#endregion 

    //#region 3. Sorting Logic

    // Ottieni il valore di 'sortBy' dai parametri di ricerca dell'URL, se non presente utilizza 'startDate-desc' come valore di default
    const sortByRaw = searchParams.get("sortBy") || 'startDate-desc';

    // Dividi il valore di 'sortBy' in due parti: il campo per il sorting e la direzione di ordinamento
    const [field, direction] = sortByRaw.split("-")

    // Costruisci l'oggetto sortBy contenente il campo e la direzione di ordinamento
    const sortBy = {
        field,        // Campo per l'ordinamento, estratto dai parametri di ricerca 'sortBy'
        direction     // Direzione di ordinamento, estratta dai parametri di ricerca 'sortBy'
    }

    //#endregion    

    //#region 4. Pagination Logic

    // Ottieni il numero di pagina dai parametri di ricerca dell'URL, se non presente utilizza la pagina 1 come valore di default
    const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'))

    //#endregion      

    //#region 5. useQuery Logic

    // Utilizza il hook useQuery per ottenere le prenotazioni
    const {
        isLoading,     // Flag per indicare se i dati sono in fase di caricamento
        data: {
            data: bookings,  // Dati delle prenotazioni ottenuti dalla query
            count            // Numero totale di prenotazioni considerando il filtro
        } = {},
        error          // Eventuali errori durante il caricamento dei dati
    } = useQuery({
        queryKey: ['bookings', filter, sortBy, page], // Chiave unica per questa query
        queryFn: () => getBookings({ filter, sortBy, page }), // Funzione che chiama il servizio API per ottenere le prenotazioni, passando il filtro se presente
    });

    //#endregion   

    //#region 6. Pre-fetching Logic

    // Calcola il numero totale di pagine necessarie per visualizzare tutti i risultati considerando il numero di elementi per pagina definito da PAGE_SIZE
    const pageCount = Math.ceil(count / PAGE_SIZE)

    // Se la pagina corrente è inferiore al numero totale di pagine, pre-fetcha i dati per la pagina successiva
    if (page < pageCount) {
        queryClient.prefetchQuery({
            queryKey: ['bookings', filter, sortBy, page + 1], // Chiave unica per questa query
            queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
        })
    } else if (page > 1) {
        // 5.4. Se la pagina corrente è superiore a 1, pre-fetcha i dati per la pagina precedente
        queryClient.prefetchQuery({
            queryKey: ['bookings', filter, sortBy, page - 1], // Chiave unica per questa query
            queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
        })
    }

    //#endregion   

    //#region 7. Return Logic

    // Restituisci i risultati della query all'utilizzatore dello hook
    return {
        isLoading, // Flag per indicare se i dati sono in fase di caricamento
        error,     // Eventuali errori durante il caricamento dei dati
        bookings,   // Dati delle prenotazioni ottenuti dalla query
        count      // Numero totale di prenotazioni considerando il filtro
    };

    //#endregion 
}
