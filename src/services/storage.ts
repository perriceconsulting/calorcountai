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

    // Optionally compress before uploading
    let uploadBlob = blob;
    try {
      // Convert blob to data URL for compressImage
      const blobToDataUrl = (blob: Blob): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to convert blob to data URL'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

      const dataUrl = await blobToDataUrl(blob);
      const maxSize = 500 * 1024; // 500KB, adjust as needed
      const compressed = await compressImage(dataUrl, maxSize);
      if (typeof compressed === 'string') {
        // compressed is a DataURL string; convert to Blob via fetch
        try {
          const response = await fetch(compressed);
          uploadBlob = await response.blob();
        } catch (convErr) {
          console.warn('Failed to convert compressed dataURL to Blob, using original blob', convErr);
          uploadBlob = blob;
        }
      } else {
        uploadBlob = compressed;
      }
    } catch (err) {
      console.warn('Image compression failed, using original blob', err);
    }

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('food-images')
      .upload(fileName, uploadBlob, {
        contentType: `image/${fileType}`,
        cacheControl: '3600',
        upsert: false
      });
    if (uploadError) {
      console.error('Error uploading image:', uploadError.message, uploadError);
      throw new Error(uploadError.message);
    }

    // Get public URL
    // Get the public URL (bucket is public)
    const { data } = supabase.storage
      .from('food-images')
      .getPublicUrl(fileName);
    if (!data?.publicUrl) {
      throw new Error('Failed to get public URL for image');
    }
    // Debug: log raw public URL to troubleshoot path issues
    console.debug('Storage publicUrl:', data.publicUrl);
    return data.publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error.message ?? error);
    // Rethrow so callers receive the error details
    throw new Error(error.message || 'Image upload failed');
  }
}