import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useAuthStore } from '../../../auth/store/authStore';
import { useToastStore } from '../../../../components/feedback/Toast';
import type { StepProps } from '../../types';

export function PersonalInfoStep({ onNext, onBack }: StepProps) {
  const user = useAuthStore(state => state.user);
  const { addToast } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    heightUnit: 'cm' as 'cm' | 'imperial',
    height: '',
    heightFt: '',
    heightIn: '',
    weightUnit: 'kg' as 'kg' | 'lb',
    weight: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      const heightVal =
        formData.heightUnit === 'cm'
          ? Number(formData.height)
          : Number(formData.heightFt) * 30.48 + Number(formData.heightIn) * 2.54;
      const weightVal =
        formData.weightUnit === 'kg'
          ? Number(formData.weight)
          : Number(formData.weight) * 0.453592;

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          height: heightVal,
          weight: weightVal,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      if (error) {
        console.error('Supabase update error:', error);
        addToast(error.message || 'Failed to save information.', 'error');
        return;
      }
      addToast('Personal information saved', 'success');
      onNext?.();
    } catch (err) {
      console.error(err);
      addToast('Failed to save information. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.firstName}
              onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              required
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.lastName}
              onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              required
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.dateOfBirth}
            onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.gender}
            onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
          <div className="flex space-x-2">
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={formData.heightUnit}
              onChange={e => setFormData(prev => ({ ...prev, heightUnit: e.target.value as 'cm' | 'imperial' }))}
            >
              <option value="cm">cm</option>
              <option value="imperial">ft/in</option>
            </select>
            {formData.heightUnit === 'cm' ? (
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.height}
                onChange={e => setFormData(prev => ({ ...prev, height: e.target.value }))}
                min={0}
                required
                placeholder="e.g. 170"
              />
            ) : (
              <>
                <input
                  type="number"
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.heightFt}
                  onChange={e => setFormData(prev => ({ ...prev, heightFt: e.target.value }))}
                  min={0}
                  required
                  placeholder="ft"
                />
                <input
                  type="number"
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.heightIn}
                  onChange={e => setFormData(prev => ({ ...prev, heightIn: e.target.value }))}
                  min={0}
                  required
                  placeholder="in"
                />
              </>
            )}
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
          <div className="flex space-x-2">
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={formData.weightUnit}
              onChange={e => setFormData(prev => ({ ...prev, weightUnit: e.target.value as 'kg' | 'lb' }))}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.weight}
              onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              min={0}
              required
              placeholder={formData.weightUnit === 'kg' ? 'e.g. 65' : 'e.g. 150'}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => onBack?.()}
            disabled={isSubmitting}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}