//#region Imports

// Importing the useState hook from React for managing component state
import { useState } from "react";
// Importing date-fns functions for date calculations
import { isFuture, isPast, isToday } from "date-fns";
// Importing the Supabase client instance
import supabase from "../services/supabase";
// Importing the Button component from the UI library
import Button from "../ui/Button";
// Importing a utility function for date subtraction
import { subtractDates } from "../utils/helpers";
// Importing sample data for guests, cabins, and bookings
import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

//#endregion 


//#region delete operations

// Asynchronously deletes all guest records from the 'guests' table in Supabase where the ID is greater than 0
async function deleteGuests() {
  // Execute the deletion operation using the Supabase client
  const { error } = await supabase.from("guests").delete().gt("id", 0);

  // Check if an error occurred during the deletion process
  if (error) {
    // Log the error message to the console if deletion is unsuccessful
    console.log(error.message);
  }
  // Note: If the deletion is successful, no specific success message is logged
}


// Asynchronously deletes all cabin records from the 'cabins' table in Supabase where the ID is greater than 0
async function deleteCabins() {
  // Execute the deletion operation using the Supabase client
  const { error } = await supabase.from("cabins").delete().gt("id", 0);

  // Check if an error occurred during the deletion process
  if (error) {
    // Log the error message to the console if deletion is unsuccessful
    console.log(error.message);
  }
  // Note: If the deletion is successful, no specific success message is logged
}

// Asynchronously deletes all booking records from the 'bookings' table in Supabase where the ID is greater than 0
async function deleteBookings() {
  // Execute the deletion operation using the Supabase client
  const { error } = await supabase.from("bookings").delete().gt("id", 0);

  // Check if an error occurred during the deletion process
  if (error) {
    // Log the error message to the console if deletion is unsuccessful
    console.log(error.message);
  }
  // Note: If the deletion is successful, no specific success message is logged
}

//#endregion 

//#region creating operation

// Asynchronously inserts guest records into the 'guests' table in Supabase
async function createGuests() {
  // Execute the insertion operation using the Supabase client
  const { error } = await supabase.from("guests").insert(guests);

  // Check if an error occurred during the insertion process
  if (error) {
    // Log the error message to the console if insertion is unsuccessful
    console.log(error.message);
  }
  // Note: If the insertion is successful, no specific success message is logged
}


// Asynchronously inserts cabin records into the 'cabins' table in Supabase
async function createCabins() {
  // Execute the insertion operation using the Supabase client
  const { error } = await supabase.from("cabins").insert(cabins);

  // Check if an error occurred during the insertion process
  if (error) {
    // Log the error message to the console if insertion is unsuccessful
    console.log(error.message);
  }
  // Note: If the insertion is successful, no specific success message is logged
}

// Asynchronously creates booking records in the 'bookings' table in Supabase
async function createBookings() {
  // Fetching guest IDs from the "guests" table and ordering them by ID
  const { data: guestsIds } = await supabase.from("guests").select("id").order("id");
  // Extracting the IDs from the fetched guest data
  const allGuestIds = guestsIds.map((guest) => guest.id);
  // Fetching cabin IDs from the "cabins" table and ordering them by ID
  const { data: cabinsIds } = await supabase.from("cabins").select("id").order("id");
  // Extracting the IDs from the fetched cabin data
  const allCabinIds = cabinsIds.map((cabin) => cabin.id);

  // Mapping over each booking to transform and create the final bookings data
  const finalBookings = bookings.map((booking) => {
      // Retrieving the cabin details for the current booking
      const cabin = cabins.at(booking.cabinId - 1);
      // Calculating the number of nights for the booking
      const numNights = subtractDates(booking.endDate, booking.startDate);
      // Calculating the price for the cabin based on the number of nights and discount
      const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);

      // Calculating the extras price, considering breakfast if selected
      const extrasPrice = booking.hasBreakfast
          ? numNights * 15 * booking.numGuests // Hardcoded breakfast price
          : 0;

      // Calculating the total price for the booking
      const totalPrice = cabinPrice + extrasPrice;

      let status;

      // Determining the booking status based on start and end dates
      if (isPast(new Date(booking.endDate)) && !isToday(new Date(booking.endDate))) status = "checked-out";
      if (isFuture(new Date(booking.startDate)) || isToday(new Date(booking.startDate))) status = "unconfirmed";
      if ((isFuture(new Date(booking.endDate)) || isToday(new Date(booking.endDate))) && isPast(new Date(booking.startDate)) && !isToday(new Date(booking.startDate))) status = "checked-in";

      // Returning the transformed booking data
      return {
          ...booking,
          numNights,
          cabinPrice,
          extrasPrice,
          totalPrice,
          guestId: allGuestIds.at(booking.guestId - 1), // Mapping the guest ID to the actual ID from the DB
          cabinId: allCabinIds.at(booking.cabinId - 1), // Mapping the cabin ID to the actual ID from the DB
          status,
      };
  });


  // Log the transformed booking data to the console
  console.log(finalBookings);

  // Insert the transformed booking data into the 'bookings' table
  const { error } = await supabase.from("bookings").insert(finalBookings);

  // Check if an error occurred during the insertion process
  if (error) {
    // Log the error message to the console if insertion is unsuccessful
    console.log(error.message);
  }
  // Note: If the insertion is successful, no specific success message is logged
}


//#endregion 


// Component for handling data upload and deletion
function Uploader() {
  // State variable for managing loading state
  const [isLoading, setIsLoading] = useState(false);

  // Function for uploading all data (guests, cabins, and bookings)
  async function uploadAll() {
    setIsLoading(true);
    // Deleting data first to avoid conflicts
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();
    // Creating data in the specified order
    await createGuests();
    await createCabins();
    await createBookings();
    setIsLoading(false);
  }

  // Function for uploading only bookings
  async function uploadBookings() {
    setIsLoading(true);
    // Deleting existing bookings before uploading
    await deleteBookings();
    // Creating bookings after deletion
    await createBookings();
    setIsLoading(false);
  }

  //#endregion 


  // Rendering the upload component with buttons
  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
}

// Exporting the Uploader component as the default export
export default Uploader;
