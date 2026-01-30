import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerifiedBadge } from './VerifiedBadge';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
};

const badgePositions = {
  sm: '-bottom-0.5 -right-0.5',
  md: '-bottom-0.5 -right-0.5',
  lg: '-bottom-1 -right-1',
  xl: '-bottom-1 -right-1',
};

const onlinePositions = {
  sm: 'bottom-0 right-0',
  md: 'bottom-0 right-0',
  lg: 'bottom-1 right-1',
  xl: 'bottom-2 right-2',
};

const onlineSizes = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
  xl: 'w-4 h-4',
};

// Generate consistent color based on name
function getAvatarColor(name: string): string {
  const colors = [
    'bg-primary',
    'bg-accent',
    'bg-blue-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-orange-600',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function Avatar({
  name,
  src,
  size = 'md',
  isVerified = false,
  showOnlineStatus = false,
  isOnline = false,
  className,
}: AvatarProps) {
  const initials = name.charAt(0);
  const badgeSize = size === 'xl' ? 'lg' : size === 'lg' ? 'md' : 'sm';

  return (
    <div className={cn('relative inline-flex', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            'rounded-full object-cover ring-2 ring-background',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold text-primary-foreground ring-2 ring-background',
            sizeClasses[size],
            getAvatarColor(name)
          )}
        >
          {initials}
        </div>
      )}
      
      {/* Verified badge */}
      {isVerified && (
        <div className={cn('absolute', badgePositions[size])}>
          <VerifiedBadge size={badgeSize} />
        </div>
      )}
      
      {/* Online status (only show if not showing verified badge) */}
      {showOnlineStatus && !isVerified && (
        <div
          className={cn(
            'absolute rounded-full ring-2 ring-background',
            onlinePositions[size],
            onlineSizes[size],
            isOnline ? 'bg-accent' : 'bg-muted-foreground/50'
          )}
        />
      )}
    </div>
  );
}
