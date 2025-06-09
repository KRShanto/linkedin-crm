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
