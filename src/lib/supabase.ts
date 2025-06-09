import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function storeProfileImage(imageUrl: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('store-avatar', {
    body: { 
      imageUrl,
      publicUrl: supabaseUrl
    }
  });

  if (error) {
    console.error('Error storing profile image:', error);
    throw error;
  }

  return data.url;
}

export async function deleteProfileImage(imageUrl: string | null): Promise<void> {
  if (!imageUrl || !imageUrl.includes('/avatars/')) return;
  
  try {
    // Extract the file name from the URL
    const fileName = imageUrl.split('/avatars/').pop();
    if (!fileName) return;

    const { error } = await supabase
      .storage
      .from('avatars')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting profile image:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteProfileImage:', error);
  }
}
