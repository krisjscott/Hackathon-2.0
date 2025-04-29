import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  isMobile?: boolean;
  closeMenu?: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  isMobile = false, 
  closeMenu 
}) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    if (closeMenu) closeMenu();
  };

  if (isMobile) {
    return (
      <div className="language-selector-mobile">
        <div className="font-medium text-neutral-800 mb-2 flex items-center">
          <Globe size={18} className="inline mr-2" />
          Select Language / भाषा चुनें
        </div>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`text-sm py-2 px-3 rounded-md transition-colors ${
                i18n.language === lang.code
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="block">{lang.name}</span>
              <span className="block text-xs">{lang.nativeName}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`block w-full text-left px-4 py-2 text-sm ${
            i18n.language === lang.code
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>{lang.name}</span>
          <span className="ml-2 text-xs text-gray-500">({lang.nativeName})</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;