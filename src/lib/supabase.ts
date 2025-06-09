import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for storage operations that require elevated permissions
const supabaseService = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

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
  if (!imageUrl) return;
  
  try {
    // Check if it's a Supabase storage URL
    if (!imageUrl.includes('/storage/v1/object/public/avatars/')) {
      console.log('Not a Supabase storage URL, skipping deletion:', imageUrl);
      return;
    }

    // Extract the file name from the URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/avatars/filename.jpg
    const fileName = imageUrl.split('/storage/v1/object/public/avatars/').pop();
    if (!fileName) {
      console.error('Could not extract file name from URL:', imageUrl);
      return;
    }

    console.log('Attempting to delete file:', fileName);

    // Use service role client for storage deletion
    if (!supabaseService) {
      console.error('Service role key not available, cannot delete files');
      return;
    }

    const { error } = await supabaseService
      .storage
      .from('avatars')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting profile image:', error);
      throw error;
    }

    console.log('Successfully deleted file:', fileName);
  } catch (error) {
    console.error('Error in deleteProfileImage:', error);
    throw error;
  }
}
