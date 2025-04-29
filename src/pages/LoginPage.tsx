import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, Key, Mail, Phone } from 'lucide-react';
import Captcha from '../components/common/Captcha';
import OtpVerification from '../components/common/OtpVerification';

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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    }
    
    if (!captchaVerified) {
      newErrors.captcha = 'Please complete the CAPTCHA verification';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (loginMethod === 'mobile') {
        // For mobile login, show OTP verification
        setShowOtpVerification(true);
      } else {
        // For email login, proceed with login
        // In a real app, this would make an API call to authenticate
        console.log('Logging in with:', formData);
        navigate('/dashboard');
      }
    }
  };
  
  const handleOtpVerified = (verified: boolean) => {
    if (verified) {
      // OTP verified successfully, proceed with login
      console.log('OTP verified, logging in with:', formData);
      navigate('/dashboard');
    }
  };
  
  if (showOtpVerification) {
    return (
      <div className="fade-in py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <OtpVerification 
              mobileNumber={formData.mobile} 
              onVerify={handleOtpVerified} 
            />
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
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="form-label">
                    {t('auth.password')}
                  </label>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-800">
                    Forgot Password?
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
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="error-message">{errors.password}</p>
                )}
              </div>
              
              <div className="mb-6">
                <Captcha onVerify={setCaptchaVerified} />
                {errors.captcha && (
                  <p className="error-message">{errors.captcha}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full py-3 text-lg mb-4"
              >
                {t('auth.login')}
              </button>
              
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
                  {t('auth.register')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;