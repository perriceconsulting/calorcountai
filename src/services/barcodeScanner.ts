import { captureVideoFrame } from '../utils/canvasUtils';

export async function scanBarcode(imageData: string): Promise<string | null> {
  try {
    if (!('BarcodeDetector' in window)) {
      throw new Error('Barcode scanning is not supported in your browser');
    }

    const img = await createImageFromData(imageData);
    
    const barcodeDetector = new (window as any).BarcodeDetector({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e']
    });

    const barcodes = await barcodeDetector.detect(img);
    return barcodes.length > 0 ? barcodes[0].rawValue : null;
  } catch (error) {
    console.error('Barcode scanning error:', error);
    return null;
  }
}

function createImageFromData(imageData: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData;
  });
}

export function isBarcodeDetectorSupported(): boolean {
  return 'BarcodeDetector' in window;
}