import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface OtpVerificationProps {
  mobileNumber: string;
  onVerify: (verified: boolean) => void;
  resendTime?: number;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ 
  mobileNumber,
  onVerify,
  resendTime = 30
}) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(resendTime);
  const [error, setError] = useState('');
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if user pastes multiple characters
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Move to next input if current one is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d*$/.test(pastedData)) return;
    
    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];
    
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    
    setOtp(newOtp);
    
    // Focus last input based on pasted length
    if (digits.length < 6) {
      inputRefs.current[digits.length]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleResendOtp = () => {
    // In a real app, this would call an API to resend the OTP
    console.log('Resending OTP to', mobileNumber);
    setTimeLeft(resendTime);
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter a complete 6-digit OTP');
      return;
    }
    
    // In a real app, this would verify the OTP with an API
    // For demo, we'll assume 123456 is the valid OTP
    if (otpValue === '123456') {
      onVerify(true);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">{t('auth.otp')}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {t('auth.otpSent')} <strong>{mobileNumber}</strong>
        </p>
      </div>
      
      <div className="flex justify-center space-x-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-10 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            maxLength={1}
          />
        ))}
      </div>
      
      {error && (
        <div className="error-message text-center mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          type="button"
          onClick={handleVerify}
          className="btn btn-primary w-full sm:w-auto"
        >
          {t('auth.verifyOtp')}
        </button>
        
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={timeLeft > 0}
          className={`text-sm ${
            timeLeft > 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-primary-600 hover:text-primary-800'
          }`}
        >
          {timeLeft > 0 
            ? `${t('auth.resendOtp')} (${timeLeft}s)` 
            : t('auth.resendOtp')}
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;