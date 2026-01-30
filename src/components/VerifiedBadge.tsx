import { CheckCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
  variant?: 'icon' | 'shield';
}

const sizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
  xl: 'w-10 h-10',
};

const containerSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function VerifiedBadge({ 
  size = 'md', 
  showLabel = false, 
  className,
  variant = 'icon'
}: VerifiedBadgeProps) {
  const Icon = variant === 'shield' ? ShieldCheck : CheckCircle;
  const isLarge = size === 'lg' || size === 'xl';
  
  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full',
          isLarge ? 'verified-badge-large' : 'verified-badge',
          containerSizeClasses[size]
        )}
        aria-label="已驗證 Verified"
      >
        <Icon className={cn(sizeClasses[size], 'text-accent-foreground')} />
      </div>
      {showLabel && (
        <span className={cn(
          'font-medium text-accent',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        )}>
          已驗證
        </span>
      )}
    </div>
  );
}

interface UnverifiedBadgeProps {
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function UnverifiedBadge({ 
  size = 'md', 
  showLabel = false,
  className 
}: UnverifiedBadgeProps) {
  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      {showLabel && (
        <span className={cn(
          'font-medium px-2 py-0.5 rounded-full unverified-warning',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          未驗證用戶
        </span>
      )}
    </div>
  );
}
