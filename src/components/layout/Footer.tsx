import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PhoneCall, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube 
} from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-800 text-white">
      <div className="container mx-auto px-4 py-10">
        {/* Top section with links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-accent-400">
              {t('app.name')}
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              {t('app.tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-accent-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-accent-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-accent-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-accent-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-accent-400">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  How to Use
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  E-Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  News & Updates
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-accent-400">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.termsOfUse')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.disclaimer')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Copyright Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Accessibility Statement
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-accent-400">{t('footer.contactUs')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <PhoneCall size={16} className="mr-2 mt-1 text-accent-400" />
                <span>{t('footer.helpline')}</span>
              </li>
              <li className="flex items-start">
                <Mail size={16} className="mr-2 mt-1 text-accent-400" />
                <span>support@propertysearch.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright and official info */}
        <div className="pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-300">
                {t('footer.copyright', { year: currentYear })}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                This website is designed, developed, and maintained by the Government of India.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;