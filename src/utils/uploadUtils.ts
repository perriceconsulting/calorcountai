import { analyzeFoodImage } from '../services/openai';
import type { MealType } from '../types/meals';

interface UploadParams {
  file: File;
  mealType: MealType;
  setUploadStatus: (status: 'uploading' | 'analyzing' | 'error' | null) => void;
  setError: (error?: string) => void;
  foodStore: any;
  toastStore: any;
}

export async function handleImageUpload({
  file,
  mealType,
  setUploadStatus,
  setError,
  foodStore,
  toastStore
}: UploadParams) {
  try {
    setUploadStatus('uploading');
    foodStore.setIsAnalyzing(true);
    
    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const base64Image = reader.result as string;
        setUploadStatus('analyzing');
        
        const analysis = await analyzeFoodImage(base64Image);
        if (analysis) {
          await foodStore.addFoodEntry({
            ...analysis,
            imageUrl: base64Image,
            timestamp: new Date().toISOString(),
            mealType,
          });
          toastStore.addToast('Food analyzed and added successfully', 'success');
        } else {
          throw new Error('Could not analyze the food image');
        }
      } catch (error) {
        setUploadStatus('error');
        setError('Failed to analyze food image. Please try again.');
        toastStore.addToast('Failed to analyze food image', 'error');
        console.error('Error analyzing image:', error);
      }
    };

    reader.onerror = () => {
      setUploadStatus('error');
      setError('Failed to read image file. Please try again.');
      toastStore.addToast('Failed to read image file', 'error');
    };

    reader.readAsDataURL(file);
  } finally {
    setTimeout(() => {
      setUploadStatus(null);
      setError(undefined);
      foodStore.setIsAnalyzing(false);
    }, 3000);
  }
}