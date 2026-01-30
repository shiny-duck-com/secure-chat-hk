import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Pin, 
  Send, 
  Paperclip,
  CheckCheck,
  Check,
  Lock,
  X
} from 'lucide-react';
import { Contact, Message } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { VerifiedBadge } from './VerifiedBadge';

interface ChatScreenProps {
  contact: Contact;
  messages: Message[];
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenMenu: () => void;
  onSendMessage: (content: string) => void;
}

export function ChatScreen({
  contact,
  messages,
  onBack,
  onOpenProfile,
  onOpenMenu,
  onSendMessage,
}: ChatScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pinnedMessages = messages.filter((m) => m.isPinned);
  const [showPinnedBanner, setShowPinnedBanner] = useState(pinnedMessages.length > 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background screen-enter">
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-2 border-b border-border bg-card">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-secondary transition-colors active:scale-95 transform"
          aria-label="返回"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        
        <button 
          onClick={onOpenProfile}
          className="flex-1 flex items-center gap-3 py-1 hover:bg-secondary/50 rounded-lg transition-colors"
        >
          <Avatar
            name={contact.name.chinese}
            size="sm"
            isVerified={contact.isVerified}
          />
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">
                {contact.name.chinese}
              </span>
              {contact.isVerified && <VerifiedBadge size="sm" />}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>端對端加密</span>
            </div>
          </div>
        </button>
        
        <button
          onClick={onOpenMenu}
          className="p-2 rounded-full hover:bg-secondary transition-colors active:scale-95 transform"
          aria-label="更多選項"
        >
          <MoreVertical className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Pinned message banner */}
      {showPinnedBanner && pinnedMessages.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 border-b border-warning/20 animate-slide-down">
          <Pin className="w-4 h-4 text-warning flex-shrink-0" />
          <p className="flex-1 text-sm text-foreground truncate">
            {pinnedMessages[0].content}
          </p>
          <button
            onClick={() => setShowPinnedBanner(false)}
            className="p-1 rounded-full hover:bg-warning/20 transition-colors"
            aria-label="關閉"
          >
            <X className="w-4 h-4 text-warning" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isSent={message.senderId === 'me'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-3 py-3 border-t border-border bg-card pb-safe">
        <div className="flex items-center gap-2">
          <button
            className="p-2.5 rounded-full hover:bg-secondary transition-colors active:scale-95 transform"
            aria-label="附加檔案"
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={isFocused ? '發送訊息' : '輸入訊息...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              className="w-full h-11 px-4 rounded-full bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn(
              'p-2.5 rounded-full transition-all duration-200 active:scale-95 transform',
              inputValue.trim()
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-muted-foreground'
            )}
            aria-label="發送"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
}

function MessageBubble({ message, isSent }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex message-slide-in',
        isSent ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] px-4 py-2.5 rounded-2xl relative',
          isSent
            ? 'bg-chat-sent text-chat-sent-foreground rounded-br-md'
            : 'bg-chat-received text-chat-received-foreground rounded-bl-md',
          message.isPinned && 'ring-2 ring-warning/50'
        )}
      >
        {message.isPinned && (
          <Pin className="absolute -top-2 -right-2 w-4 h-4 text-warning" />
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <div className={cn(
          'flex items-center justify-end gap-1 mt-1',
          isSent ? 'text-chat-sent-foreground/70' : 'text-muted-foreground'
        )}>
          <span className="text-[10px]">{message.timestamp}</span>
          {isSent && (
            message.isRead ? (
              <CheckCheck className="w-3.5 h-3.5" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
