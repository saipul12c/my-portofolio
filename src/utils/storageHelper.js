import { supabase } from '../lib/supabaseClient';

/**
 * Upload a file to a Supabase bucket and return its public URL.
 * @param {File} file - The file to upload.
 * @param {string} bucket - The bucket name (default 'media').
 * @param {string} folder - Optional folder path inside the bucket.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
export const uploadMedia = async (file, bucket = 'media', folder = '') => {
  try {
    if (!file) throw new Error('No file provided');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadMedia:', error);
    throw error;
  }
};

/**
 * Delete a file from a Supabase bucket.
 * @param {string} url - The public URL of the file to delete.
 * @param {string} bucket - The bucket name.
 */
export const deleteMedia = async (url, bucket = 'media') => {
  try {
    // Extract path from public URL
    // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error in deleteMedia:', error);
  }
};

export default { uploadMedia, deleteMedia };
