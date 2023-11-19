import supabase from './supabase';

// Funzione per effettuare il login utilizzando Supabase Authentication
// 1. Creare utente su Supabase in authentication - esempio: alessandro-oasis@example.com
// 2. Creare la funzionalità di login che accetta email e password
export async function login({ email, password }) {

    // Effettua il login con email e password utilizzando Supabase
    let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    // Gestisce eventuali errori durante il processo di login
    if (error) throw new Error(error.message);

    // Restituisci i dati
    return data;
}

export async function getCurrentUser() {
    // controlla dal localStorage se c'é una sessione attiva
    const {
        data: session
    } = await supabase.auth.getSession();

    // Se non ci sono utenti attivi allora return di null
    if (!session.session) {
        return null;
    } else {
        const { data, error } = await supabase.auth.getUser()
        // Check dell'utente autenticato
        console.log(data);
        // Gestisce eventuali errori durante il processo di login
        if (error) throw new Error(error.message);

        // Restituisci i dati
        return data?.user;
    }

}