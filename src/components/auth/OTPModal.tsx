import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToAuth: () => void;
  email: string;
  type: 'verification' | 'reset';
  onSuccess: () => void;
}

export const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  onClose,
  onBackToAuth,
  email,
  type,
  onSuccess
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async () => {
    try {
      setResendLoading(true);
      setError('');

      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database (you'll need to create this table)
      const { error: storeError } = await supabase
        .from('otp_codes')
        .upsert({
          email: email.toLowerCase(),
          code: otpCode,
          type: type,
          expires_at: expiresAt.toISOString(),
          used: false
        });

      if (storeError) {
        throw storeError;
      }

      // In a real app, you would send this via email service
      // For demo purposes, we'll show it in console
      console.log(`OTP for ${email}: ${otpCode}`);
      
      // Show success message
      alert(`OTP sent to ${email}. For demo purposes, check the console. OTP: ${otpCode}`);
      
      setResendCooldown(60); // 60 second cooldown
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Verify OTP from database
      const { data: otpData, error: verifyError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('code', otpString)
        .eq('type', type)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (verifyError || !otpData) {
        setError('Invalid or expired OTP code. Please try again.');
        return;
      }

      // Mark OTP as used
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otpData.id);

      if (type === 'verification') {
        // For email verification, mark user as verified
        const { error: updateError } = await supabase.auth.updateUser({
          email_confirm: true
        });

        if (updateError) {
          throw updateError;
        }
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP when modal opens
  useEffect(() => {
    if (isOpen && email) {
      sendOTP();
    }
  }, [isOpen, email]);

  const handleClose = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {success ? 'Verified!' : 'Enter Verification Code'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {type === 'verification' ? 'Email Verified!' : 'Code Verified!'}
              </h3>
              <p className="text-gray-600">
                {type === 'verification' 
                  ? 'Your email has been successfully verified.'
                  : 'You can now reset your password.'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-600">
                  We've sent a 6-digit verification code to
                </p>
                <p className="font-semibold text-gray-900">{email}</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter 6-digit code
                </label>
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOTP}
                disabled={loading || otp.join('').length !== 6}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium mb-4"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={sendOTP}
                  disabled={resendLoading || resendCooldown > 0}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center mx-auto"
                >
                  {resendLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    'Resend Code'
                  )}
                </button>
              </div>

              {/* Back Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={onBackToAuth}
                  className="flex items-center justify-center w-full text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};