import supabase, { supabaseUrl } from "./supabase";

/**
 * Get all cabins from Supabase
 * 
 * @returns {Array} data - Array of cabin data
 */
export async function getCabins() {
    // Perform a SELECT query on the 'cabins' table to get all cabins
    const { data, error } = await supabase.from('cabins').select('*');

    // Handle errors during the query execution
    if (error) {
        console.error(error);
        throw new Error("Cabins could not be loaded");
    }

    // Return the obtained data
    return data;
}

/**
 * Delete a cabin with the specified ID
 * 
 * @param {number} id - ID of the cabin to delete
 * @returns {Object} data - Data of the deleted cabin
 */
export async function deleteCabin(id) {
    // Perform a DELETE query on the 'cabins' table with ID condition
    const { data, error } = await supabase
        .from('cabins')
        .delete()
        .eq('id', id);

    // Handle errors during the query execution
    if (error) {
        console.error(error);
        throw new Error("Cabins could not be deleted");
    }

    // Return data of the deleted cabin
    return data;
}

/**
 * Create or edit a cabin in Supabase
 * 
 * @param {Object} newCabin - Data for the new or edited cabin
 * @param {number} id - ID of the cabin to edit (optional)
 * @returns {Object} data - Data of the created or edited cabin
 */
export async function createEditCabin(newCabin, id) {
    // Check if the image URL is already provided
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

    // Generate a unique name for the image
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");

    // Create a path to store the image
    const imagePath = hasImagePath ? newCabin.image : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    // Interaction with the Supabase database
    let query = supabase.from('cabins');

    // If ID is not provided, insert a new cabin
    if (!id) query = query.insert([{
        ...newCabin,
        image: imagePath
    }]);

    // If ID is provided, update an existing cabin
    if (id) query = query.update({
        ...newCabin,
        image: imagePath
    }).eq("id", id);

    // Execute the query to create or update the cabin and retrieve the data
    const { data, error } = await query.select().single();

    // Handle any errors in the database
    if (error) {
        console.error(error);
        throw new Error("Unable to create cabins");
    }

    // 2. Upload the image associated with the cabin to Supabase storage

    // Return data if the image URL is already provided
    if (hasImagePath) return data;

    // Perform image upload to the 'cabin-images' storage bucket
    const { error: storageError } = await supabase
        .storage
        .from('cabin-images') // Bucket name
        .upload(imageName, newCabin.image);

    // Delete the cabin if there is an error in image upload
    if (storageError) {
        await supabase.from('cabins').delete().eq('id', data.id);
        console.error(storageError);
        throw new Error("Unable to upload cabin image, and the cabin was not created");
    }

    // Return data of the cabin
    return data;
}
