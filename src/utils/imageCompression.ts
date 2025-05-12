export async function compressImage(dataUrl: string, maxSize: number): Promise<string> {
  // Create an image element
  const img = new Image();
  img.src = dataUrl;
  
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // Create canvas
  const canvas = document.createElement('canvas');
  let width = img.width;
  let height = img.height;
  
  // Calculate new dimensions while maintaining aspect ratio
  const aspectRatio = width / height;
  
  // Start with original size
  canvas.width = width;
  canvas.height = height;
  
  // Get context and draw image
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Compress until size is under maxSize
  let quality = 0.7;
  let compressed: string;
  
  do {
    // If we've tried with minimum quality and it's still too big
    if (quality < 0.1) {
      // Reduce dimensions
      width *= 0.9;
      height = width / aspectRatio;
      canvas.width = width;
      canvas.height = height;
      quality = 0.7; // Reset quality
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);
    compressed = canvas.toDataURL('image/jpeg', quality);
    quality -= 0.1;
  } while (compressed.length > maxSize && quality > 0);

  return compressed;
}