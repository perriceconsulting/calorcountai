import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { signUp, resendVerificationEmail } from '../services/authService';
import { useToastStore } from '../../../store/toastStore';

export function SignUpForm() {
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (username.length < 3) {
      addToast('Username must be at least 3 characters', 'error');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      addToast('Username can only contain letters, numbers, underscores and hyphens', 'error');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, username);
      
      if (error) {
        addToast(error, 'error');
        if (error === 'This email is already registered') {
          setShowResend(true);
        } else {
          setShowResend(false);
        }
      } else {
        addToast('Account created successfully! Please sign in.', 'success');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    const { error } = await resendVerificationEmail(email);
    if (error) {
      addToast(error, 'error');
    } else {
      addToast('Verification email sent', 'success');
    }
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to get started
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              minLength={3}
              // Move hyphen to start of class to avoid regex syntax error
              pattern="^[-a-zA-Z0-9_]+$"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            <p className="mt-1 text-sm text-gray-500">
              Letters, numbers, underscores and hyphens only
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            <p className="mt-1 text-sm text-gray-500">Must be at least 6 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          {showResend && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Email is already registered.</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                {resendLoading ? 'Resending...' : 'Resend verification email'}
              </button>
            </div>
          )}

          <div className="text-sm text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}