import React, { useState, useCallback } from 'react';
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
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'analyzing' | 'error' | null>(null);
  const [error, setError] = useState<string>();
  const { addFoodEntry, setIsAnalyzing } = useFoodStore();
  const { addToast } = useToastStore();

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file', 'error');
      return;
    }

    try {
      setUploadStatus('uploading');
      setIsAnalyzing(true);
      
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const imageData = reader.result as string;
          setUploadStatus('analyzing');
          
          // Upload to storage first
          const imageUrl = await uploadFoodImage(imageData);
          if (!imageUrl) {
            throw new Error('Failed to upload image');
          }

          const analysis = await analyzeFoodImage(imageData);
          if (!analysis) {
            throw new Error('Could not analyze the food image');
          }

          await addFoodEntry({
            ...analysis,
            imageUrl,
            timestamp: new Date().toISOString(),
            mealType: selectedMealType,
          });

          addToast('Food analyzed and added successfully', 'success');
        } catch (error) {
          setUploadStatus('error');
          setError('Failed to analyze food image. Please try again.');
          addToast('Failed to analyze food image', 'error');
          console.error('Error analyzing image:', error);
        }
      };

      reader.onerror = () => {
        setUploadStatus('error');
        setError('Failed to read image file');
        addToast('Failed to read image file', 'error');
      };

      reader.readAsDataURL(file);
    } finally {
      setTimeout(() => {
        setUploadStatus(null);
        setError(undefined);
        setIsAnalyzing(false);
      }, 3000);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <MealTypeSelector value={selectedMealType} onChange={setSelectedMealType} />
      
      <div className="relative" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? "Drop the image here"
              : "Drag & drop a food image, or click to select"}
          </p>
        </div>
        
        <UploadStatus status={uploadStatus} error={error} />
      </div>
    </div>
  );
}