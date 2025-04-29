import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  X, 
  Search, 
  LogIn, 
  UserPlus, 
  User,
  Languages,
  ChevronDown
} from 'lucide-react';
import LanguageSelector from '../common/LanguageSelector';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  // Check if user is logged in (in a real app, this would come from auth state)
  const isLoggedIn = false;

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-r from-primary-700 to-primary-600 py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-accent-500 rounded-md flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                <path 
                  fill="currentColor" 
                  d="M12,3L2,12H5V20H19V12H22L12,3M12,8.5A1.5,1.5 0 0,1 13.5,10A1.5,1.5 0 0,1 12,11.5A1.5,1.5 0 0,1 10.5,10A1.5,1.5 0 0,1 12,8.5M12,13.5A1.5,1.5 0 0,1 13.5,15A1.5,1.5 0 0,1 12,16.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 12,13.5Z" 
                />
              </svg>
            </div>
            <div>
              <h1 className={`font-heading font-bold text-lg md:text-xl ${
                isScrolled ? 'text-primary-700' : 'text-white'
              }`}>
                {t('app.name')}
              </h1>
              <p className={`text-xs ${
                isScrolled ? 'text-primary-500' : 'text-white/80'
              }`}>
                {t('app.tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`font-medium ${
                isScrolled ? 'text-neutral-700 hover:text-primary-600' : 'text-white hover:text-accent-200'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/about" 
              className={`font-medium ${
                isScrolled ? 'text-neutral-700 hover:text-primary-600' : 'text-white hover:text-accent-200'
              }`}
            >
              {t('nav.search')}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center space-x-1 font-medium ${
                  isScrolled 
                    ? 'text-neutral-700 hover:text-primary-600' 
                    : 'text-white hover:text-accent-200'
                }`}
              >
                <Languages size={16} />
                <span>{t('nav.langSwitch')}</span>
                <ChevronDown size={16} />
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <LanguageSelector closeMenu={() => setIsLangMenuOpen(false)} />
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                className={`font-medium ${
                  isScrolled ? 'text-neutral-700 hover:text-primary-600' : 'text-white hover:text-accent-200'
                }`}
              >
                <User size={18} className="inline mr-1" />
                {t('nav.dashboard')}
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className={`font-medium ${
                    isScrolled ? 'text-neutral-700 hover:text-primary-600' : 'text-white hover:text-accent-200'
                  }`}
                >
                  <LogIn size={18} className="inline mr-1" />
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/register" 
                  className={`btn ${
                    isScrolled 
                      ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                      : 'bg-accent-500 hover:bg-accent-600 text-white'
                  }`}
                >
                  <UserPlus size={18} className="inline mr-1" />
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className={isScrolled ? 'text-primary-700' : 'text-white'} />
            ) : (
              <Menu size={24} className={isScrolled ? 'text-primary-700' : 'text-white'} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-6 mt-2 rounded-b-lg">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="font-medium text-neutral-800 hover:text-primary-600">
              {t('nav.home')}
            </Link>
            <Link to="/about" className="font-medium text-neutral-800 hover:text-primary-600">
              <Search size={18} className="inline mr-2" />
              {t('nav.search')}
            </Link>
            <LanguageSelector isMobile />
            {isLoggedIn ? (
              <Link to="/dashboard" className="font-medium text-neutral-800 hover:text-primary-600">
                <User size={18} className="inline mr-2" />
                {t('nav.dashboard')}
              </Link>
            ) : (
              <>
                <Link to="/login" className="font-medium text-neutral-800 hover:text-primary-600">
                  <LogIn size={18} className="inline mr-2" />
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="font-medium text-neutral-800 hover:text-primary-600">
                  <UserPlus size={18} className="inline mr-2" />
                  {t('nav.register')}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;