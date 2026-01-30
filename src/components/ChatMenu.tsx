import { 
  Pin, 
  BellOff, 
  Search, 
  Trash2, 
  Ban, 
  Trash, 
  FileDown,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  isPinned?: boolean;
  isMuted?: boolean;
}

const menuItems = [
  { id: 'pin', icon: Pin, label: '置頂聊天', labelEn: 'Pin Chat' },
  { id: 'mute', icon: BellOff, label: '靜音', labelEn: 'Mute' },
  { id: 'search', icon: Search, label: '搜尋訊息', labelEn: 'Search in Chat' },
  { id: 'export', icon: FileDown, label: '匯出聊天記錄', labelEn: 'Export Chat History' },
  { id: 'clear', icon: Trash2, label: '清除聊天', labelEn: 'Clear Chat', danger: true },
  { id: 'block', icon: Ban, label: '封鎖', labelEn: 'Block', danger: true },
  { id: 'delete', icon: Trash, label: '刪除聊天', labelEn: 'Delete Chat', danger: true },
];

export function ChatMenu({ isOpen, onClose, onExport }: ChatMenuProps) {
  if (!isOpen) return null;

  const handleItemClick = (id: string) => {
    if (id === 'export') {
      onExport();
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl modal-content pb-safe">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>
        
        <div className="px-2 pb-4">
          {menuItems.map(({ id, icon: Icon, label, labelEn, danger }) => (
            <button
              key={id}
              onClick={() => handleItemClick(id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors',
                danger 
                  ? 'hover:bg-destructive/10 active:bg-destructive/20' 
                  : 'hover:bg-secondary active:bg-secondary/80'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                danger ? 'bg-destructive/10' : 'bg-secondary'
              )}>
                <Icon className={cn(
                  'w-5 h-5',
                  danger ? 'text-destructive' : 'text-muted-foreground'
                )} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-baseline gap-1.5">
                  <span className={cn(
                    'font-medium',
                    danger ? 'text-destructive' : 'text-foreground'
                  )}>{label}</span>
                  <span className={cn(
                    'text-sm',
                    danger ? 'text-destructive/70' : 'text-muted-foreground'
                  )}>{labelEn}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors active:scale-[0.98] transform"
          >
            取消 Cancel
          </button>
        </div>
      </div>
    </>
  );
}
