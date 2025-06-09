"use server";

import { revalidatePath } from "next/cache";
import { supabase, storeProfileImage, deleteProfileImage } from "@/lib/supabase";
import { Person } from "@/lib/types";


export async function getPeople() {
  const { data, error } = await supabase
    .from("People")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching people:", error);
    return [];
  }

  return data;
}

export async function getPerson(id: string) {
  const { data, error } = await supabase
    .from("People")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching person:", error);
    return null;
  }

  return data;
}

export async function createPerson(data: Partial<Person>) {
  try {
    // Store profile image if provided
    if (data.profileImage) {
      data.profileImage = await storeProfileImage(data.profileImage);
    }

    // If connectionDegree is 1, automatically set connected to true
    if (data.connectionDegree === 1) {
      data.connected = true;
    }
    // If connected is true, automatically set connectionDegree to 1
    if (data.connected) {
      data.connectionDegree = 1;
    }
    // If not connected and no degree specified, set to 0 (out of network)
    if (!data.connected && !data.connectionDegree) {
      data.connectionDegree = 0;
    }

    const { data: newPerson, error } = await supabase
      .from("People")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error creating person:", error);
      return null;
    }

    revalidatePath("/crm");
    return newPerson;
  } catch (error) {
    console.error("Error in createPerson:", error);
    return null;
  }
}

export async function updatePerson(id: string, data: Partial<Person>) {
  try {
    // Get the current person to check if we need to delete old image
    const currentPerson = await getPerson(id);
    if (!currentPerson) {
      throw new Error("Person not found");
    }

    const oldImageUrl = currentPerson.profileImage;
    let newImageUrl: string | null = null;

    // Handle profile image updates
    if (data.profileImage !== undefined) {
      // Case 1: New image is provided and it's a new URL (not already stored in Supabase)
      if (data.profileImage && !data.profileImage.includes('supabase.co')) {
        console.log('Storing new profile image...');
        newImageUrl = await storeProfileImage(data.profileImage);
        data.profileImage = newImageUrl;
        console.log('New image stored:', newImageUrl);
      } 
      // Case 2: Image is being removed (profileImage is null or empty string)
      else if (!data.profileImage) {
        console.log('Removing profile image...');
        data.profileImage = null;
      }
      // Case 3: Image URL is already a Supabase URL (no change needed)
    }

    // Handle connection logic
    if (data.connectionDegree === 1) {
      data.connected = true;
    }
    if (data.connected) {
      data.connectionDegree = 1;
    }
    if (!data.connected && !data.connectionDegree) {
      data.connectionDegree = 0;
    }

    // Update the database record
    const { data: updatedPerson, error } = await supabase
      .from("People")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database update failed:", error);
      
      // Clean up newly uploaded image if database update failed
      if (newImageUrl) {
        console.log('Cleaning up new image due to DB error...');
        try {
          await deleteProfileImage(newImageUrl);
        } catch (cleanupError) {
          console.error("Failed to cleanup new image:", cleanupError);
        }
      }
      return null;
    }

    // Only delete the old image after successful database update
    if (data.profileImage !== undefined && oldImageUrl) {
      // Delete old image if we uploaded a new one OR if image was removed
      const shouldDeleteOld = newImageUrl || data.profileImage === null;
      
      if (shouldDeleteOld) {
        console.log('Deleting old profile image:', oldImageUrl);
        try {
          await deleteProfileImage(oldImageUrl);
          console.log('Old image deleted successfully');
        } catch (deleteError) {
          console.error("Failed to delete old image (non-critical):", deleteError);
          // This is non-critical since the database update succeeded
        }
      }
    }

    revalidatePath("/crm");
    return updatedPerson;
  } catch (error) {
    console.error("Error in updatePerson:", error);
    return null;
  }
}

export async function deletePerson(id: string) {
  try {
    // Get the person first to get their profile image URL
    const person = await getPerson(id);
    if (!person) {
      throw new Error("Person not found");
    }

    const imageUrl = person.profileImage;
    console.log('Deleting person:', person.name, 'with image:', imageUrl);

    // Delete the person record first
    const { error } = await supabase
      .from("People")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting person from database:", error);
      return false;
    }

    console.log('Person deleted from database successfully');

    // Delete the profile image after successful database deletion
    if (imageUrl) {
      console.log('Deleting profile image:', imageUrl);
      try {
        await deleteProfileImage(imageUrl);
        console.log('Profile image deleted successfully');
      } catch (imageError) {
        console.error("Failed to delete profile image (non-critical):", imageError);
        // This is non-critical since the person was successfully deleted from DB
      }
    }

    revalidatePath("/crm");
    return true;
  } catch (error) {
    console.error("Error in deletePerson:", error);
    return false;
  }
}

export async function bulkUpdatePeople(updates: { id: string; changes: Partial<Person> }[]) {
  try {
    const results = await Promise.all(
      updates.map(async ({ id, changes }) => {
        const { data, error } = await supabase
          .from('People')
          .update(changes)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      })
    );

    revalidatePath("/crm");
    return results;
  } catch (error) {
    console.error('Error updating people:', error);
    return null;
  }
}
