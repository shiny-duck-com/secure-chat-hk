import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Contact } from '@/types';
import { Avatar } from './Avatar';
import { VerifiedBadge } from './VerifiedBadge';

interface NewChatScreenProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onCancel: () => void;
}

export function NewChatScreen({ contacts, onSelectContact, onCancel }: NewChatScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery) return true;
    return (
      contact.name.chinese.includes(searchQuery) ||
      contact.name.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
    );
  });

  return (
    <div className="flex flex-col h-full bg-background screen-enter">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          onClick={onCancel}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          取消
        </button>
        <h1 className="flex-1 text-lg font-semibold text-foreground text-center">新對話</h1>
        <div className="w-8" />
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜尋姓名或號碼"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <div className="divide-y divide-border">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onSelectContact(contact)}
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
                  {contact.isVerified && <VerifiedBadge size="md" />}
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {contact.phone}
                </p>
              </div>
            </button>
          ))}
          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">找不到聯絡人</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
