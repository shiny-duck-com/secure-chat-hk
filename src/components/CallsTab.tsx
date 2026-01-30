import { useState } from 'react';
import { 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  Video,
  ShieldCheck
} from 'lucide-react';
import { CallRecord, CallFilter } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { VerifiedBadge } from './VerifiedBadge';

interface CallsTabProps {
  calls: CallRecord[];
}

const filters: { id: CallFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'missed', label: '未接' },
];

const callTypeIcons = {
  incoming: PhoneIncoming,
  outgoing: PhoneOutgoing,
  missed: PhoneMissed,
  video: Video,
};

const callTypeColors = {
  incoming: 'text-accent',
  outgoing: 'text-primary',
  missed: 'text-destructive',
  video: 'text-primary',
};

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function CallsTab({ calls }: CallsTabProps) {
  const [activeFilter, setActiveFilter] = useState<CallFilter>('all');

  const filteredCalls = calls.filter((call) => {
    if (activeFilter === 'missed') {
      return call.type === 'missed';
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground mb-4">通話</h1>
        
        {/* Verified notice */}
        <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-accent/10 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent">只有已驗證聯絡人可以通話</span>
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

      {/* Calls list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {filteredCalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <PhoneMissed className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">沒有通話記錄</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredCalls.map((call) => (
              <CallListItem key={call.id} call={call} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CallListItemProps {
  call: CallRecord;
}

function CallListItem({ call }: CallListItemProps) {
  const Icon = callTypeIcons[call.type];
  const iconColor = callTypeColors[call.type];

  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors active:bg-secondary text-left">
      <Avatar
        name={call.contact.name.chinese}
        size="md"
        isVerified={call.contact.isVerified}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-semibold truncate',
            call.type === 'missed' ? 'text-destructive' : 'text-foreground'
          )}>
            {call.contact.name.chinese}
          </span>
          {call.contact.isVerified && <VerifiedBadge size="sm" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <Icon className={cn('w-4 h-4', iconColor)} />
          <span className="text-sm text-muted-foreground">
            {call.type === 'video' ? '視像通話' : 
             call.type === 'incoming' ? '來電' : 
             call.type === 'outgoing' ? '去電' : '未接'}
            {call.duration && ` · ${formatDuration(call.duration)}`}
          </span>
        </div>
      </div>
      
      <span className="text-xs text-muted-foreground flex-shrink-0">
        {call.timestamp}
      </span>
    </button>
  );
}
