import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useFoodStore } from '../../store/foodStore';
import { analyzeFoodImage } from '../../services/openai';
import { uploadFoodImage } from '../../services/storage';
import { useToastStore } from '../../store/toastStore';
import { MealTypeSelector } from '../food/MealTypeSelector';
import { UploadStatus } from './UploadStatus';
import type { MealType } from '../../types/meals';

export function ImageUpload() {
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'analyzing' | 'error' | null>(null);
  const [error, setError] = useState<string>();
  const { addFoodEntry, setIsAnalyzing } = useFoodStore();
  const { addToast } = useToastStore();

  const handleUpload = (file: File) => {
    // Ensure a meal type is selected before uploading
    if (!selectedMealType) {
      addToast('Please select a meal type before uploading', 'error');
      return;
    }
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file', 'error');
      return;
    }

    // Initialize reader and states
    const reader = new FileReader();
    setUploadStatus('uploading');
    setIsAnalyzing(true);

    reader.onload = async () => {
        const imageData = reader.result as string;
        // Step 1: Upload
        let imageUrl: string;
        try {
          setUploadStatus('uploading');
          const result = await uploadFoodImage(imageData);
          if (!result) throw new Error('Failed to upload image');
          imageUrl = result;
        } catch (uploadError: any) {
          setUploadStatus('error');
          const msg = uploadError.message || 'Failed to upload image';
          setError(msg);
          addToast(msg, 'error');
          console.error('Error uploading image:', uploadError);
          // Reset state after displaying the error
          setTimeout(() => {
            setUploadStatus(null);
            setError(undefined);
            setIsAnalyzing(false);
          }, 3000);
          return;
        }
        // Step 2: Analyze
        try {
          setUploadStatus('analyzing');
          const analysis = await analyzeFoodImage(imageData);
          if (!analysis) throw new Error('Could not analyze the food image');
          await addFoodEntry({
            ...analysis,
            imageUrl,
            timestamp: new Date().toISOString(),
            mealType: selectedMealType,
          });
          addToast('Food analyzed and added successfully', 'success');
        } catch (analysisError: any) {
          setUploadStatus('error');
          const msg = analysisError.message || 'Failed to analyze food image';
          setError(msg);
          addToast(msg, 'error');
          console.error('Error analyzing image:', analysisError);
        } finally {
          // Reset state after finishing
          setTimeout(() => {
            setUploadStatus(null);
            setError(undefined);
            setIsAnalyzing(false);
          }, 3000);
        }
    };

    reader.onerror = () => {
      setUploadStatus('error');
      setError('Failed to read image file');
      addToast('Failed to read image file', 'error');
      // schedule state reset after error
      const resetError = () => {
        setUploadStatus(null);
        setError(undefined);
        setIsAnalyzing(false);
      };
      setTimeout(resetError, 3000);
    };

    reader.readAsDataURL(file);
  };


  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) handleUpload(file);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: !selectedMealType,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <MealTypeSelector value={selectedMealType} onChange={setSelectedMealType} />

      <div className="relative" {...getRootProps()}>
        <input {...getInputProps()} capture="environment" />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop a food image, or click to select'}
          </p>
        </div>
        <UploadStatus status={uploadStatus} error={error} />
        {!selectedMealType && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <p className="text-gray-500">Select a meal type to enable upload</p>
          </div>
        )}
      </div>

    </div>
  );
}