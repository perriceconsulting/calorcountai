import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useFoodStore } from '../store/foodStore';
import { analyzeFoodImage } from '../services/openai';

export function ImageUpload() {
  const { setIsAnalyzing, addFoodEntry } = useFoodStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        const analysis = await analyzeFoodImage(base64Image);
        addFoodEntry(analysis);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [setIsAnalyzing, addFoodEntry]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? "Drop the image here"
          : "Drag & drop a food image, or click to select"}
      </p>
    </div>
  );
}