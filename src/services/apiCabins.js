import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
    const { data, error } = await supabase.from('cabins').select('*')

    if (error) {
        console.error(error)
        throw new Error("Cabins could not be loaded")
    }

    return data;
}

// Function for deleteCabin
export async function deleteCabin(id) {
    const { data, error } = await supabase
        .from('cabins')
        .delete()
        .eq('id', id)

    if (error) {
        console.error(error)
        throw new Error("Cabins could not be deleted")
    }

    return data;
}

export async function createEditCabin(newCabin, id) {
    // Verifica se l'URL dell'immagine è già fornito
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

    // Genera un nome univoco per l'immagine
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");

    // Crea un percorso per memorizzare l'immagine
    const imagePath = hasImagePath ? newCabin.image : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    // Interazione con il database di Supabase
    let query = supabase.from('cabins');

    // Se l'ID non è fornito, inserisce una nuova cabina
    if (!id) query = query.insert([{
        ...newCabin,
        image: imagePath
    }]);

    // Se l'ID è fornito, aggiorna una cabina esistente
    if (id) query = query.update({
        ...newCabin,
        image: imagePath
    }).eq("id", id);

    // Esegue la query per creare o aggiornare la cabina e recupera i dati
    const { data, error } = await query.select().single();

    // Gestisce eventuali errori nel database
    if (error) {
        console.error(error);
        throw new Error("Impossibile creare le cabine");
    }

    // Carica l'immagine associata alla cabina nello storage di Supabase
    const { error: storageError } = await supabase
        .storage
        .from('cabin-images') // Nome del bucket
        .upload(imageName, newCabin.image);

    // Elimina la cabina se si verifica un errore nel caricamento dell'immagine
    if (storageError) {
        await supabase.from('cabins').delete().eq('id', data.id);
        console.error(storageError);
        throw new Error("Impossibile caricare l'immagine della cabina, e la cabina non è stata creata");
    }

    // Restituisce i dati della cabina
    return data;
}



