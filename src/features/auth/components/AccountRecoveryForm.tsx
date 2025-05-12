import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { resetPassword, recoverUsername } from '../services/recoveryService';
import { useToastStore } from '../../../components/feedback/Toast';

type RecoveryType = 'password' | 'username';

export function AccountRecoveryForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [recoveryType, setRecoveryType] = useState<RecoveryType>('password');
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (recoveryType === 'password') {
        const { error } = await resetPassword(email);
        if (error) throw new Error(error);
        addToast('Password reset instructions sent to your email', 'success');
      } else {
        const { error } = await recoverUsername(email);
        if (error) throw new Error(error);
        addToast('Username sent to your email', 'success');
      }
      setSent(true);
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Recovery failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg text-center">
          <Mail className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-2xl font-bold">Check your email</h2>
          <p className="mt-2 text-gray-600">
            We've sent {recoveryType === 'password' ? 'reset instructions' : 'your username'} to {email}
          </p>
          <Link
            to="/login"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Account Recovery</h2>
        
        <div className="flex rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setRecoveryType('password')}
            className={`flex-1 py-2 ${
              recoveryType === 'password'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Reset Password
          </button>
          <button
            type="button"
            onClick={() => setRecoveryType('username')}
            className={`flex-1 py-2 ${
              recoveryType === 'username'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Recover Username
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : recoveryType === 'password' ? 'Send Reset Instructions' : 'Recover Username'}
          </button>

          <Link
            to="/login"
            className="block text-center text-sm text-gray-600 hover:text-gray-800"
          >
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  );
}