import { useState, useEffect, useRef } from 'react';
import { compressImage } from '../../utils/imageCompression';
// import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useFoodStore } from '../../store/foodStore';
import { analyzeFoodImage } from '../../services/openai';
import { uploadFoodImage } from '../../services/storage';
import { useToastStore } from '../../store/toastStore';
import { MealTypeSelector } from '../food/MealTypeSelector';
import { UploadStatus } from './UploadStatus';
import type { MealType } from '../../types/meals';

export function ImageUpload() {
  // No default meal type: require user selection
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'analyzing' | 'error' | null>(null);
  const [error, setError] = useState<string>();
  const { addFoodEntry, setIsAnalyzing } = useFoodStore();
  const { addToast } = useToastStore();
  // preview state for mobile confirm
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const pendingFileRef = useRef<File | null>(null);
  // notify user of ongoing upload/analyze steps
  useEffect(() => {
    if (uploadStatus === 'uploading') addToast('Uploading image...', 'info');
    if (uploadStatus === 'analyzing') addToast('Analyzing your food...', 'info');
  }, [uploadStatus]);

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
        let imageData = reader.result as string;
        // compress large images for faster upload/analysis
        try {
          imageData = await compressImage(imageData, 500 * 1024); // target ~500KB
        } catch (e) {
          console.warn('Image compression failed, using original', e);
        }
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

  // Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleUpload(file);
    }
  };

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   disabled: !selectedMealType,
  //   accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
  //   maxFiles: 1,
  //   multiple: false
  // });

  return (
    <div className="space-y-4">
      <MealTypeSelector value={selectedMealType} onChange={setSelectedMealType} />

      {/* File upload: simple selector */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          disabled={!selectedMealType || !!uploadStatus}
          className="w-full h-40 opacity-0 absolute inset-0 cursor-pointer"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = '';
          }}
        />
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center text-center">
          <Upload className="h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {uploadStatus ? 'Processing...' : 'Click to select a photo'}
          </p>
        </div>
        <UploadStatus status={uploadStatus} error={error} />
      </div>

    </div>
  );
}