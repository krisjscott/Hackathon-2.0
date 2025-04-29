import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 6;

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setCaptchaText(result);
    setUserInput('');
    setVerified(false);
    setError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userInput === captchaText) {
      setVerified(true);
      setError(false);
      onVerify(true);
    } else {
      setError(true);
      onVerify(false);
      generateCaptcha();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="form-label" htmlFor="captcha">
          {t('common.captcha')}
        </label>
        
        <div className="flex items-center mt-1 mb-3">
          <div 
            className="captcha-container bg-gray-100 px-4 py-3 rounded-md select-none text-lg font-mono tracking-wider"
            style={{
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/white-carbon.png")',
              letterSpacing: '0.25em',
              textDecoration: 'line-through',
              fontStyle: 'italic',
              position: 'relative'
            }}
          >
            <span className="relative z-10">{captchaText}</span>
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="w-full h-0.5 bg-black transform rotate-5"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="w-full h-0.5 bg-black transform -rotate-5"></div>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={generateCaptcha}
            className="ml-3 p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            aria-label={t('common.captchaRefresh')}
          >
            <RefreshCw size={18} className="text-gray-700" />
          </button>
        </div>
        
        {!verified ? (
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              id="captcha"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={`form-input ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              placeholder="Enter the code above"
              required
            />
            <button 
              type="submit" 
              className="ml-2 btn btn-primary"
            >
              Verify
            </button>
          </form>
        ) : (
          <div className="bg-success-100 text-success-800 px-4 py-2 rounded-md">
            Captcha verified successfully!
          </div>
        )}
        
        {error && (
          <p className="error-message mt-2">
            Incorrect captcha. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default Captcha;