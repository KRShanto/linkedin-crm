"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
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
}

export async function updatePerson(id: string, data: Partial<Person>) {
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
}

export async function deletePerson(id: string) {
  const { error } = await supabase
    .from("People")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting person:", error);
    return;
  }

  revalidatePath("/crm");
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
