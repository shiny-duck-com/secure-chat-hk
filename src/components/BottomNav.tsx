import { MessageCircle, Phone, Settings } from 'lucide-react';
import { TabType } from '@/types';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
}

const tabs = [
  { id: 'chats' as TabType, icon: MessageCircle, label: '聊天' },
  { id: 'calls' as TabType, icon: Phone, label: '通話' },
  { id: 'settings' as TabType, icon: Settings, label: '設定' },
];

export function BottomNav({ activeTab, onTabChange, unreadCount = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-nav-background border-t border-nav-border bottom-nav-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'active:scale-95 transform'
              )}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-6 h-6 transition-colors duration-200',
                    isActive ? 'text-nav-active' : 'text-nav-inactive'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {id === 'chats' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-primary-foreground bg-destructive rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-200',
                  isActive ? 'text-nav-active' : 'text-nav-inactive'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
