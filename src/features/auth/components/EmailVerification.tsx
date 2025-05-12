import React, { useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../../../components/feedback/Toast';

interface EmailVerificationProps {
  email: string;
  onBack: () => void;
}

export function EmailVerification({ email, onBack }: EmailVerificationProps) {
  const [resending, setResending] = useState(false);
  const { resendVerification } = useAuthStore();
  const { addToast } = useToastStore();

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(email);
      addToast('Verification email sent', 'success');
    } catch (error) {
      addToast('Failed to resend verification email', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-blue-600" />
      </div>

      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="text-gray-600 mb-6">
        We've sent a verification link to <strong>{email}</strong>.<br />
        Please check your inbox and verify your email to continue.
      </p>

      <div className="space-y-4">
        <button
          onClick={handleResend}
          disabled={resending}
          className="flex items-center gap-2 mx-auto px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
          Resend Verification Email
        </button>

        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}