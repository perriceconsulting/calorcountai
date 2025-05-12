import { MIME_TYPES } from '../constants/mimeTypes';

export function captureVideoFrame(video: HTMLVideoElement, quality = 0.8): string {
  try {
    // Validate video element
    if (!video.videoWidth || !video.videoHeight) {
      throw new Error('Video dimensions not available');
    }

    const canvas = document.createElement('canvas');
    const aspectRatio = video.videoWidth / video.videoHeight;
    
    // Set reasonable maximum dimensions
    const maxWidth = 1280;
    canvas.width = Math.min(maxWidth, video.videoWidth);
    canvas.height = canvas.width / aspectRatio;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Clear canvas and draw new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL with proper MIME type and quality
    const dataURL = canvas.toDataURL(MIME_TYPES.JPEG, quality);
    
    // Validate data URL format
    if (!dataURL || !dataURL.startsWith('data:image/')) {
      throw new Error('Invalid image data generated');
    }

    return dataURL;
  } catch (error) {
    console.error('Error capturing video frame:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight
    });
    throw error;
  }
}

export function convertDataURLToBase64(dataURL: string): string {
  try {
    // Validate data URL format
    if (!dataURL || !dataURL.startsWith('data:image/')) {
      throw new Error('Invalid data URL format');
    }

    // Extract base64 part
    const base64Match = dataURL.match(/^data:image\/\w+;base64,(.+)$/);
    if (!base64Match) {
      throw new Error('Invalid data URL format: missing base64 content');
    }

    return base64Match[1];
  } catch (error) {
    console.error('Error converting data URL to base64:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}