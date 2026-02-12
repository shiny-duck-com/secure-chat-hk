import { useState } from 'react';
import { Search, Pin, ScanLine, SquarePen, Archive, ChevronRight, ArrowLeft } from 'lucide-react';
import { Contact, ChatFilter } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { VerifiedBadge, UnverifiedBadge } from './VerifiedBadge';

interface ChatListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onOpenQRScanner: () => void;
  onNewChat: () => void;
}

const filters: { id: ChatFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'unread', label: '未讀' },
  { id: 'pinned', label: '置頂' },
];

export function ChatList({ contacts, onSelectContact, onOpenQRScanner, onNewChat }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ChatFilter>('all');
  const [showArchived, setShowArchived] = useState(false);

  const archivedContacts = contacts.filter((c) => c.isArchived);
  const activeContacts = contacts.filter((c) => !c.isArchived);

  const displayContacts = showArchived ? archivedContacts : activeContacts;

  const filteredContacts = displayContacts
    .filter((contact) => {
      const matchesSearch =
        contact.name.chinese.includes(searchQuery) ||
        contact.name.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery);

      if (!matchesSearch) return false;

      if (showArchived) return true;

      switch (activeFilter) {
        case 'unread':
          return (contact.unreadCount ?? 0) > 0;
        case 'pinned':
          return contact.isPinned;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  if (showArchived) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button
            onClick={() => setShowArchived(false)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors active:scale-95 transform"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">已封存</h1>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          {archivedContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Archive className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">沒有已封存的聊天</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {archivedContacts.map((contact) => (
                <ChatListItem
                  key={contact.id}
                  contact={contact}
                  onClick={() => onSelectContact(contact)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">聊天</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenQRScanner}
              className="p-2 rounded-lg hover:bg-secondary transition-colors active:scale-95 transform text-foreground"
              aria-label="掃描二維碼"
            >
              <ScanLine className="w-5 h-5" />
            </button>
            <button
              onClick={onNewChat}
              className="p-2 rounded-lg hover:bg-secondary transition-colors active:scale-95 transform text-foreground"
              aria-label="新對話"
            >
              <SquarePen className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜尋聊天或聯絡人"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2">
          {filters.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 transform',
                activeFilter === id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {/* Archived row */}
        {archivedContacts.length > 0 && (
          <button
            onClick={() => setShowArchived(true)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border"
          >
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Archive className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <span className="font-semibold text-foreground">已封存</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">{archivedContacts.length}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        )}

        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">找不到聊天記錄</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredContacts.map((contact) => (
              <ChatListItem
                key={contact.id}
                contact={contact}
                onClick={() => onSelectContact(contact)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ChatListItemProps {
  contact: Contact;
  onClick: () => void;
}

function ChatListItem({ contact, onClick }: ChatListItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors active:bg-secondary text-left"
    >
      <Avatar
        name={contact.name.chinese}
        size="md"
        showOnlineStatus
        isOnline={contact.isOnline}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground truncate">
            {contact.name.chinese}
          </span>
          {contact.isVerified && (
            <VerifiedBadge size="md" />
          )}
          {!contact.isVerified && (
            <UnverifiedBadge size="sm" />
          )}
          {contact.isPinned && (
            <Pin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate mt-0.5">
          {contact.lastMessage}
        </p>
      </div>
      
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {contact.lastMessageTime}
        </span>
        {(contact.unreadCount ?? 0) > 0 && (
          <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-bold text-primary-foreground bg-primary rounded-full">
            {contact.unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}
