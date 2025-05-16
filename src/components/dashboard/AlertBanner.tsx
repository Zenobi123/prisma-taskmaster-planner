
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertBannerProps {
  message: string;
  onRefresh?: () => void;
  variant?: 'info' | 'warning' | 'error' | 'success';
}

const AlertBanner: React.FC<AlertBannerProps> = ({ 
  message, 
  onRefresh,
  variant = 'info'
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default: // info
        return 'bg-blue-50 border-blue-200';
    }
  };
  
  const getIconColor = () => {
    switch (variant) {
      case 'warning':
        return 'text-amber-600';
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      default: // info
        return 'text-blue-600';
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'warning':
        return 'text-amber-800';
      case 'error':
        return 'text-red-800';
      case 'success':
        return 'text-green-800';
      default: // info
        return 'text-blue-800';
    }
  };

  return (
    <Alert className={`${getStyles()} my-4`}>
      <AlertCircle className={`h-4 w-4 ${getIconColor()}`} />
      <AlertDescription className={`flex justify-between items-center ${getTextColor()}`}>
        <span>{message}</span>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className={`ml-4 border-${variant === 'info' ? 'blue' : variant}-300`}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Actualiser
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default AlertBanner;
