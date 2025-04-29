import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 32, 
  text 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 
        size={size} 
        className="text-primary-600 animate-spin" 
      />
      <p className="mt-4 text-gray-600">
        {text || t('common.loading')}
      </p>
    </div>
  );
};

export default LoadingSpinner;