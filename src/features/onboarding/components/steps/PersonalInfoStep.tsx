import React, { useState, useEffect } from 'react';
import { User, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useAuthStore } from '../../../auth/store/authStore';
import { useToastStore } from '../../../../components/feedback/Toast';
import { useProfileStore } from '../../../auth/store/profileStore';
import type { StepProps } from '../../types';

export function PersonalInfoStep({ onNext, onBack }: StepProps) {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { profile } = useProfileStore();
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    dateOfBirth: profile?.date_of_birth || '',
    gender: profile?.gender || '',
    heightFeet: profile?.height ? Math.floor(profile.height / 30.48).toString() : '',
    heightInches: profile?.height ? Math.round((profile.height / 2.54) % 12).toString() : '',
    weight: profile?.weight ? profile.weight.toString() : '',
    weightUnit: profile?.weight != null ? 'kg' : 'lbs'
  });
  // Recalculate weight if unit changes
  useEffect(() => {
    const wt = parseFloat(formData.weight);
    if (!isNaN(wt)) {
      const converted = formData.weightUnit === 'kg'
        ? wt / 2.205
        : wt * 2.205;
      setFormData(prev => ({ ...prev, weight: converted.toFixed(1) }));
    }
  }, [formData.weightUnit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Convert height (feet/inches) to cm and weight to kg
      const heightCm = formData.heightFeet && formData.heightInches
        ? Number(formData.heightFeet) * 30.48 + Number(formData.heightInches) * 2.54
        : null;
      const weightKg = formData.weight
        ? (formData.weightUnit === 'kg'
            ? Number(formData.weight)
            : Number(formData.weight) / 2.205)
        : null;
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          height: heightCm,
          weight: weightKg,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      addToast('Personal information saved', 'success');
      onNext();
    } catch (error) {
      const msg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Failed to save personal info:', { error, message: msg });
      addToast(`Failed to save personal info: ${msg}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      <p className="text-gray-600 mb-8">
        Help us personalize your experience
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full rounded-lg border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            className="w-full rounded-lg border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full rounded-lg border-gray-300"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (ft)</label>
            <input
              type="number"
              value={formData.heightFeet}
              onChange={e => setFormData(prev => ({ ...prev, heightFeet: e.target.value }))}
              className="w-full rounded-lg border-gray-300"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (in)</label>
            <input
              type="number"
              value={formData.heightInches}
              onChange={e => setFormData(prev => ({ ...prev, heightInches: e.target.value }))}
              className="w-full rounded-lg border-gray-300"
              min="0"
              max="11"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input
              type="number"
              value={formData.weight}
              onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className="w-full rounded-lg border-gray-300"
              min="0"
              step="any"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select
              value={formData.weightUnit}
              onChange={e => setFormData(prev => ({ ...prev, weightUnit: e.target.value }))}
              className="w-full rounded-lg border-gray-300"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}