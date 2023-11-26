import supabase, { supabaseUrl } from './supabase';

/**
 * Sign up a new user using Supabase Authentication.
 * 
 * @param {Object} userData - User data including fullName, email, and password.
 * @returns {Object} - User data from the signup process.
 */
export async function signup({ fullName, email, password }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName,
                avatar: ""
            }
        }
    });

    // Handle errors during the signup process
    if (error) throw new Error(error.message);
    // Return user data
    return data;
}

/**
 * Login a user using Supabase Authentication.
 * 
 * @param {Object} credentials - User credentials including email and password.
 * @returns {Object} - User data from the login process.
 */
export async function login({ email, password }) {
    // Perform login with email and password using Supabase
    let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    // Handle errors during the login process
    if (error) throw new Error(error.message);
    // Return user data
    return data;
}

/**
 * Get the current authenticated user.
 * 
 * @returns {Object|null} - Current authenticated user data or null if no active session.
 */
export async function getCurrentUser() {
    // Check from localStorage if there is an active session
    const { data: session } = await supabase.auth.getSession();
    // If there are no active users, return null
    if (!session.session) {
        return null;
    } else {
        const { data, error } = await supabase.auth.getUser();
        // Handle errors during the login process
        if (error) throw new Error(error.message);
        // Return user data
        return data?.user;
    }
}

/**
 * Logout the currently authenticated user.
 */
export async function logout() {
    const { error } = await supabase.auth.signOut();
    // Handle errors during the logout process
    if (error) throw new Error(error.message);
}

/**
 * Update the current authenticated user's information.
 * 
 * @param {Object} updates - Updates including password, fullName, and avatar.
 * @returns {Object} - Updated user data.
 */
export async function updateCurrentUser({ password, fullName, avatar }) {
    // 1. Update password OR fullName
    let updateData;

    // Check if there is a password update
    if (password) {
        updateData = { password };
    }
    // Check if there is a fullName update
    if (fullName) {
        updateData = { data: { fullName } };
    }

    // Perform the user update with the provided data
    const { data, error: updateAuthUserError } = await supabase.auth.updateUser(updateData);
    // Handle errors during the user update process
    if (updateAuthUserError) throw new Error(updateAuthUserError.message);
    // If no avatar provided, return the updated user data
    if (!avatar) return data;


    // 2. Upload the avatar image
    const fileName = `avatar-${data.user.id}-${Math.random()}`;

    // Upload the avatar image to the "avatars" storage bucket
    const { error: storageError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatar);
    // Handle errors during the avatar image upload
    if (storageError) throw new Error(storageError.message);


    // 3. Update avatar in the user
    const { data: updatedUser, error: updateUserError } = await supabase.auth.updateUser({
        data: {
            avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
        },
    });
    // Handle errors during the avatar update in user data
    if (updateUserError) throw new Error(updateUserError.message);

    // Return the final updated user data
    return updatedUser;
}

