import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../context/UserContext';

interface ResetPasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  const { login } = useUser();

  useEffect(() => {
    // Check if we have a valid session for password reset
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        setError('Invalid or expired reset link. Please request a new password reset.');
      }
    };

    checkSession();
  }, []);

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate passwords
      if (!password.trim()) {
        setError('Password is required.');
        return;
      }

      if (!confirmPassword.trim()) {
        setError('Please confirm your password.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        if (updateError.message.includes('session_not_found')) {
          setError('Your reset session has expired. Please request a new password reset.');
        } else {
          setError('Failed to update password. Please try again.');
        }
        return;
      }

      setSuccess(true);

      // Auto-redirect after success
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);

    } catch (err) {
      console.error('Password reset error:', err);
      setError('An error occurred while updating your password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {success ? 'Password Updated!' : 'Set New Password'}
          </h1>
          <p className="text-gray-600">
            {success 
              ? 'Your password has been successfully updated.'
              : 'Please enter your new password below.'
            }
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-gray-600 mb-6">
              You can now sign in with your new password.
            </p>
            <button
              onClick={onSuccess}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue to Sign In
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your new password"
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <p>Password must contain:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li className={password.length >= 6 ? 'text-green-600' : ''}>
                      At least 6 characters
                    </li>
                    <li className={/(?=.*[a-z])/.test(password) ? 'text-green-600' : ''}>
                      One lowercase letter
                    </li>
                    <li className={/(?=.*[A-Z])/.test(password) ? 'text-green-600' : ''}>
                      One uppercase letter
                    </li>
                    <li className={/(?=.*\d)/.test(password) ? 'text-green-600' : ''}>
                      One number
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Confirm your new password"
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>

            {/* Cancel Button */}
            {onCancel && (
              <div className="mt-6 text-center">
                <button
                  onClick={onCancel}
                  className="flex items-center justify-center w-full text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};