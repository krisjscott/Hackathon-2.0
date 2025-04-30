import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, Key, Mail, Phone, AlertCircle, Loader } from 'lucide-react';
import Captcha from '../components/common/Captcha';


const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear general login error when user changes input
    if (loginError) {
      setLoginError(null);
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (loginMethod === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.mobile) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!captchaVerified) {
      newErrors.captcha = 'Please complete the CAPTCHA verification';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setLoginError(null);
      
      try {
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (loginMethod === 'mobile') {
          // For mobile login, show OTP verification
          setShowOtpVerification(true);
        } else {
          // For email login, proceed with login
          // In a real app, this would make an API call to authenticate
          console.log('Logging in with:', formData);
          
          // For demo purposes, test credentials
          if (formData.email === 'test@example.com' && formData.password === 'password123') {
            navigate('/dashboard');
          } else {
            setLoginError('Invalid email or password. Please try again.');
          }
        }
      } catch (error) {
        setLoginError('A network error occurred. Please try again later.');
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };
  
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      setErrors({ otp: 'Please enter the OTP sent to your mobile' });
      return;
    }
    
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, any 6-digit OTP is considered valid
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        console.log('OTP verified, logging in with:', formData);
        navigate('/dashboard');
      } else {
        setLoginError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setLoginError('A network error occurred. Please try again later.');
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setLoginError('OTP has been resent to your mobile number.');
    } catch (error) {
      setLoginError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (showOtpVerification) {
    return (
      <div className="fade-in py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-primary-100 rounded-full mb-4">
                <LogIn size={32} className="text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Verify OTP
              </h1>
              <p className="text-gray-600">
                A one-time password has been sent to your mobile: {formData.mobile}
              </p>
            </div>
            
            {loginError && (
              <div className={`mb-4 p-3 rounded ${loginError.includes('resent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} flex items-start`}>
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <label htmlFor="otp" className="form-label">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className={`form-input text-center tracking-widest text-xl ${errors.otp ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="******"
                  maxLength={6}
                />
                {errors.otp && (
                  <p className="error-message">{errors.otp}</p>
                )}
              </div>
              
              <div className="mb-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  disabled={isLoading}
                >
                  Didn't receive the OTP? Resend
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fade-in py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-primary-100 rounded-full mb-4">
                <LogIn size={32} className="text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {t('auth.login')}
              </h1>
              <p className="text-gray-600">
                Access your property search account
              </p>
            </div>
            
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-2 px-4 flex justify-center items-center ${
                    loginMethod === 'email' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Mail size={18} className="mr-2" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('mobile')}
                  className={`flex-1 py-2 px-4 flex justify-center items-center ${
                    loginMethod === 'mobile' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Phone size={18} className="mr-2" />
                  Mobile
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {loginMethod === 'email' ? (
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input pl-10 ${errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="error-message">{errors.email}</p>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <label htmlFor="mobile" className="form-label">
                    {t('auth.mobile')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`form-input pl-10 ${errors.mobile ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="error-message">{errors.mobile}</p>
                  )}
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex justify-between">
                  <label htmlFor="password" className="form-label">
                    {t('auth.password')}
                  </label>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-800">
                    {t('auth.forgotPassword')}
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input pl-10 ${errors.password ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="error-message">{errors.password}</p>
                )}
              </div>
              
              <div className="mb-6">
                <Captcha onVerify={(verified) => setCaptchaVerified(verified)} />
                {errors.captcha && (
                  <p className="error-message mt-2">{errors.captcha}</p>
                )}
              </div>
              
              <div className="mb-6">
                <button 
                  type="submit" 
                  className="btn btn-primary w-full flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      {t('auth.login')}
                    </>
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600">
                  {t('auth.noAccount')} 
                  <Link to="/register" className="text-primary-600 hover:text-primary-800 ml-1">
                    {t('auth.signUp')}
                  </Link>
                </p>
              </div>
            </form>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              For demo purposes, use email: <strong>test@example.com</strong> and password: <strong>password123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;