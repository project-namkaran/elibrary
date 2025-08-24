import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { OTPModal } from './OTPModal';
import { ResetPasswordWithOTP } from './ResetPasswordWithOTP';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpType, setOtpType] = useState<'verification' | 'reset'>('verification');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const { login, signup } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Basic validation
      if (!formData.email.trim()) {
        setError('Email is required.');
        return;
      }
      
      if (!formData.password.trim()) {
        setError('Password is required.');
        return;
      }
      
      if (!isLogin && !formData.name.trim()) {
        setError('Name is required.');
        return;
      }
      
      if (!isLogin && formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
      }

      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        try {
          success = await signup(formData.name, formData.email, formData.password);
          if (success) {
            // Show OTP modal for email verification
            setResetEmail(formData.email);
            setOtpType('verification');
            setShowOTPModal(true);
            return; // Don't close modal yet
          }
        } catch (signupError) {
          setError(signupError instanceof Error ? signupError.message : 'Account creation failed. Please try again.');
          success = false;
        }
      }

      if (success) {
        setTimeout(() => {
          onClose();
          setFormData({ name: '', email: '', password: '' });
          setSuccess('');
          setError('');
        }, 1500);
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (isLogin) {
        setError('An error occurred during sign in. Please try again.');
      } else {
        setError('An error occurred during account creation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear errors when user starts typing
    if (error) {
      setError('');
    }
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address first.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setResetEmail(formData.email);
    setOtpType('reset');
    setShowOTPModal(true);
  };

  const handleOTPSuccess = () => {
    setShowOTPModal(false);
    
    if (otpType === 'verification') {
      setSuccess('Email verified successfully! Welcome to E-Library.');
      setTimeout(() => {
        onClose();
        setFormData({ name: '', email: '', password: '' });
        setSuccess('');
        setError('');
      }, 1500);
    } else {
      // Show password reset form
      setShowResetPassword(true);
    }
  };

  const handleResetSuccess = () => {
    setShowResetPassword(false);
    setSuccess('Password updated successfully! You can now sign in.');
    setTimeout(() => {
      onClose();
      setFormData({ name: '', email: '', password: '' });
      setSuccess('');
      setError('');
      setResetEmail('');
    }, 1500);
  };

  const handleBackToAuth = () => {
    setShowOTPModal(false);
    setShowResetPassword(false);
    setResetEmail('');
    setError('');
  };

  if (!isOpen) return null;

  // Show OTP modal
  if (showOTPModal) {
    return (
      <OTPModal
        isOpen={true}
        onClose={onClose}
        onBackToAuth={handleBackToAuth}
        email={resetEmail}
        type={otpType}
        onSuccess={handleOTPSuccess}
      />
    );
  }

  // Show reset password form
  if (showResetPassword) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div className="p-6">
            <ResetPasswordWithOTP
              email={resetEmail}
              onSuccess={handleResetSuccess}
              onBack={handleBackToAuth}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
              />
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
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
          </div>

          {isLogin && (
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 text-center">
          {/* Demo Credentials */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Authentication Info:</h4>
            <div className="text-xs text-blue-700">
              {isLogin ? (
                <div>
                  <p>Sign in with your registered email and password.</p>
                  <p className="mt-1">Forgot password? Enter your email and click "Forgot your password?" to receive an OTP.</p>
                </div>
              ) : (
                <div>
                  <p>Create a new account to access the library features.</p>
                  <p className="mt-1">You'll receive an OTP to verify your email address.</p>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};