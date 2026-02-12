import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Pin, 
  Send, 
  Paperclip,
  CheckCheck,
  Check,
  Lock,
  X,
  Phone,
  Reply,
  Forward,
  Copy,
  Info,
  Trash2,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { Contact, Message } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { VerifiedBadge } from './VerifiedBadge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { toast } from 'sonner';

interface ChatScreenProps {
  contact: Contact;
  messages: Message[];
  onBack: () => void;
  onOpenProfile: () => void;
  onCall: () => void;
  onSendMessage: (content: string, replyTo?: { id: string; content: string; senderName: string }) => void;
}

export function ChatScreen({
  contact,
  messages,
  onBack,
  onOpenProfile,
  onCall,
  onSendMessage,
}: ChatScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; content: string; senderName: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pinnedMessages = messages.filter((m) => m.isPinned);
  const [showPinnedBanner, setShowPinnedBanner] = useState(pinnedMessages.length > 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim(), replyingTo ?? undefined);
      setInputValue('');
      setReplyingTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('已複製到剪貼簿');
  };

  const handleReply = (message: Message) => {
    const senderName = message.senderId === 'me' ? '你' : contact.name.chinese;
    setReplyingTo({ id: message.id, content: message.content, senderName });
    inputRef.current?.focus();
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
          onClick={onCall}
          className="p-2 rounded-full hover:bg-secondary transition-colors active:scale-95 transform"
          aria-label="撥打電話"
        >
          <Phone className="w-6 h-6 text-foreground" />
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
        {/* E2E encryption badge */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              此對話的訊息受端對端加密保護
            </span>
          </div>
        </div>

        {messages.map((message) => (
          <ContextMenu key={message.id}>
            <ContextMenuTrigger>
              <MessageBubble
                message={message}
                isSent={message.senderId === 'me'}
                contactName={contact.name.chinese}
              />
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuItem onClick={() => handleReply(message)} className="gap-2">
                <Reply className="w-4 h-4" /> 回覆
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast.info('轉發功能開發中')} className="gap-2">
                <Forward className="w-4 h-4" /> 轉發
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleCopy(message.content)} className="gap-2">
                <Copy className="w-4 h-4" /> 複製
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast.info(`發送時間: ${message.timestamp}`)} className="gap-2">
                <Info className="w-4 h-4" /> 資訊
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast.success('已置頂訊息')} className="gap-2">
                <Pin className="w-4 h-4" /> 置頂
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => toast.success('已檢舉此訊息')} className="gap-2 text-warning focus:text-warning">
                <AlertTriangle className="w-4 h-4" /> 檢舉
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast.success('訊息已刪除')} className="gap-2 text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4" /> 刪除
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply banner */}
      {replyingTo && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border-t border-primary/10">
          <Reply className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary">{replyingTo.senderName}</p>
            <p className="text-xs text-muted-foreground truncate">{replyingTo.content}</p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

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
  contactName: string;
}

function MessageBubble({ message, isSent, contactName }: MessageBubbleProps) {
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
        {/* Reply reference */}
        {message.replyTo && (
          <div className="mb-2 px-3 py-1.5 rounded-lg bg-foreground/5 border-l-2 border-primary">
            <p className="text-xs font-medium text-primary">{message.replyTo.senderName}</p>
            <p className="text-xs text-muted-foreground truncate">{message.replyTo.content}</p>
          </div>
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
