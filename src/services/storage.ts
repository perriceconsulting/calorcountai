import { supabase } from '../lib/supabase';
import { compressImage } from '../utils/imageCompression';

export async function uploadFoodImage(dataURL: string): Promise<string | null> {
  try {
    // Validate data URL
    if (!dataURL.startsWith('data:image/')) {
      throw new Error('Invalid image format');
    }

    // Extract base64 data and file type
    const matches = dataURL.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid image data format');
    }

    const fileType = matches[1];
    const base64Data = matches[2];

    // Create a unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileType}`;

    // Convert base64 to Blob
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: `image/${fileType}` });

    // Upload file
    const { data, error } = await supabase.storage
      .from('food-images')
      .upload(fileName, blob, {
        contentType: `image/${fileType}`,
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('food-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}