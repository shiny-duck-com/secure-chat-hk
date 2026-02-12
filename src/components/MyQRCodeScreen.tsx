import { ArrowLeft, QrCode, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { VerifiedBadge } from './VerifiedBadge';
import { getCurrentUser } from '@/data/mockData';
import { toast } from 'sonner';

interface MyQRCodeScreenProps {
  onBack: () => void;
}

export function MyQRCodeScreen({ onBack }: MyQRCodeScreenProps) {
  const user = getCurrentUser();

  return (
    <div className="flex flex-col h-full bg-background screen-enter">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors active:scale-95 transform"
          aria-label="返回"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">我的二維碼</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* User info */}
        <div className="flex flex-col items-center mb-8">
          <Avatar name={user.name.chinese} size="lg" isVerified={user.isVerified} />
          <div className="mt-3 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="text-lg font-bold text-foreground">{user.name.chinese}</h2>
              {user.isVerified && <VerifiedBadge size="md" />}
            </div>
            <p className="text-sm text-muted-foreground">{user.phone}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-lg">
          <div className="w-52 h-52 bg-foreground/5 rounded-2xl flex items-center justify-center relative">
            <div className="grid grid-cols-11 gap-[3px] p-4">
              {Array.from({ length: 121 }).map((_, i) => {
                const row = Math.floor(i / 11);
                const col = i % 11;
                const isCorner = (row < 3 && col < 3) || (row < 3 && col > 7) || (row > 7 && col < 3);
                const isFilled = isCorner || Math.random() > 0.5;
                return (
                  <div
                    key={i}
                    className={cn(
                      'w-3 h-3 rounded-[2px]',
                      isFilled ? 'bg-foreground' : 'bg-transparent'
                    )}
                  />
                );
              })}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <QrCode className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          讓其他用戶掃描此二維碼以添加您為聯絡人
        </p>

        <button
          onClick={() => toast.success('二維碼已複製')}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors active:scale-95 transform"
        >
          <Share2 className="w-5 h-5" />
          分享二維碼
        </button>
      </div>
    </div>
  );
}
