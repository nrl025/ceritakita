import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY || process.env.SUPABASE_ANON_PUBLIC_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client dengan service role untuk bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function uploadThumbnail(file: File, userId: string) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Gunakan supabaseAdmin untuk bypass RLS
    const { data, error } = await supabaseAdmin.storage
      .from('thumbnails')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('thumbnails')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function deleteThumbnail(url: string) {
  try {
    const fileName = url.split('/').pop();
    if (!fileName) return;

    // Gunakan supabaseAdmin untuk bypass RLS
    const { error } = await supabaseAdmin.storage
      .from('thumbnails')
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.error('Delete error:', error);
  }
}
