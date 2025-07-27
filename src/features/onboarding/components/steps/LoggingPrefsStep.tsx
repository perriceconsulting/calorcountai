import { useForm } from 'react-hook-form';
import type { StepProps } from '../../types';

// Form schema for logging preferences
interface LoggingPrefsForm {
  trackingStyle: 'photo' | 'manual';
  mealFrequency: number;
  cookingSkill: 'beginner' | 'homecook' | 'pro';
}

export function LoggingPrefsStep({
  onNext,
  onBack,
  setPreferences,
  preferences,
  isFirst,
  isLast
}: StepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoggingPrefsForm>({
    defaultValues: {
      trackingStyle: preferences?.trackingStyle ?? 'photo',
      mealFrequency: preferences?.mealFrequency ?? 3,
      cookingSkill: preferences?.cookingSkill ?? 'homecook'
    }
  });

  const submit = (data: LoggingPrefsForm) => {
    setPreferences?.(data);
    onNext?.();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">How do you prefer to log?</label>
        <select {...register('trackingStyle', { required: true })} className="w-full p-2 border rounded-lg">
          <option value="photo">Photo</option>
          <option value="manual">Manual</option>
        </select>
        {errors.trackingStyle && <p className="text-red-500 text-sm">This field is required</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Meals per day</label>
        <input
          type="number"
          {...register('mealFrequency', { valueAsNumber: true, required: true, min: 1, max: 8 })}
          className="w-full p-2 border rounded-lg"
          min={1}
          max={8}
        />
        {errors.mealFrequency && <p className="text-red-500 text-sm">Enter a value between 1 and 8</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Cooking skill level</label>
        <select {...register('cookingSkill', { required: true })} className="w-full p-2 border rounded-lg">
          <option value="beginner">Beginner</option>
          <option value="homecook">Home Cook</option>
          <option value="pro">Professional</option>
        </select>
        {errors.cookingSkill && <p className="text-red-500 text-sm">This field is required</p>}
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={onBack} disabled={isFirst} className="px-4 py-2 bg-gray-200 rounded">
          Back
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </form>
  );
}
