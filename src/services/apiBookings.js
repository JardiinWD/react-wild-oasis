import { getToday } from "../utils/helpers";
import supabase from "./supabase";

/**
 * API Call to supabase with query filters
 * 
 * @param {Object} filter - Optional filter parameters for the query
 * @param {*} sortBy - Optional sorting parameter for the query
 * @returns {Array} data - Array of booking data
 */
export async function getBookings({ filter, sortBy }) {
  // Perform a SELECT query on the 'bookings' table with specified columns
  const { data, error } = await supabase
    .from('bookings')
    .select('id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)')

  // Handle errors during the query execution
  if (error) {
    console.error(error)
    throw new Error("Bookings could not be loaded")
  }

  // Return the obtained data
  return data;
}

/**
 * Get a specific booking by its ID
 * 
 * @param {number} id - ID of the booking to retrieve
 * @returns {Object} data - Data of the specified booking
 */
export async function getBooking(id) {
  // Perform a SELECT query on the 'bookings' table with additional relationships
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  // Handle errors during the query execution
  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  // Return the obtained data
  return data;
}

/**
 * Get bookings created after the given date
 * 
 * @param {Date} date - Date to filter bookings created after
 * @returns {Array} data - Array of booking data
 */
export async function getBookingsAfterDate(date) {
  // Perform a SELECT query on the 'bookings' table with date filtering
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  // Handle errors during the query execution
  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Return the obtained data
  return data;
}

/**
 * Get stays created after the given date
 * 
 * @param {Date} date - Date to filter stays created after
 * @returns {Array} data - Array of stay data
 */
export async function getStaysAfterDate(date) {
  // Perform a SELECT query on the 'bookings' table with date and relationship filtering
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  // Handle errors during the query execution
  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Return the obtained data
  return data;
}

/**
 * Get stays with check-in or check-out activity today
 * 
 * @returns {Array} data - Array of stay data
 */
export async function getStaysTodayActivity() {
  // Perform a SELECT query on the 'bookings' table with complex conditions
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Handle errors during the query execution
  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Return the obtained data
  return data;
}

/**
 * Update a booking with the specified ID
 * 
 * @param {number} id - ID of the booking to update
 * @param {Object} obj - Updated data for the booking
 * @returns {Object} data - Updated data of the booking
 */
export async function updateBooking(id, obj) {
  // Perform an UPDATE query on the 'bookings' table with specified data and ID condition
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  // Handle errors during the query execution
  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  // Return the updated data
  return data;
}

/**
 * Delete a booking with the specified ID
 * 
 * @param {number} id - ID of the booking to delete
 * @returns {Object} data - Data of the deleted booking
 */
export async function deleteBooking(id) {
  // Perform a DELETE query on the 'bookings' table with ID condition
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  // Handle errors during the query execution
  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  // Return data of the deleted booking
  return data;
}
