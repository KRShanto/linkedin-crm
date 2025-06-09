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

    // If profile image is being updated
    if (data.profileImage !== undefined) {
      // If new image is provided and it's a new URL
      if (data.profileImage && !data.profileImage.includes('supabase.co')) {
        // Store the new image
        const newImageUrl = await storeProfileImage(data.profileImage);
        // Delete the old image if it exists
        if (currentPerson.profileImage) {
          await deleteProfileImage(currentPerson.profileImage);
        }
        // Update the image URL in the data
        data.profileImage = newImageUrl;
      } 
      // If image is being removed (profileImage is null or empty string)
      else if (!data.profileImage && currentPerson.profileImage) {
        // Delete the old image
        await deleteProfileImage(currentPerson.profileImage);
      }
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

    const { data: updatedPerson, error } = await supabase
      .from("People")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating person:", error);
      return null;
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

    // Delete the profile image if it exists
    if (person.profileImage) {
      await deleteProfileImage(person.profileImage);
    }

    // Delete the person record
    const { error } = await supabase
      .from("People")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting person:", error);
      return;
    }

    revalidatePath("/crm");
  } catch (error) {
    console.error("Error in deletePerson:", error);
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
