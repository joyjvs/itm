import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import cn from '../../utils/cn';

export type AlertVariant = 'default' | 'destructive' | 'success' | 'warning';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', title, onClose, children, className, ...props }, ref) => {
    const variants = {
      default: 'border-blue-200 bg-blue-50 text-blue-900',
      destructive: 'border-red-200 bg-red-50 text-red-900',
      success: 'border-green-200 bg-green-50 text-green-900',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    };

    const iconVariants = {
      default: <Info className="h-4 w-4" />,
      destructive: <AlertCircle className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full rounded-lg border p-4 flex gap-4',
          variants[variant],
          className
        )}
        {...props}
      >
        <div className="flex-shrink-0">{iconVariants[variant]}</div>
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export default Alert;