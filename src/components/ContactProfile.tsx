import { 
  Phone, 
  Video, 
  Share2, 
  ChevronRight, 
  Image as ImageIcon, 
  Pin, 
  Trash2, 
  Ban, 
  AlertTriangle,
  ArrowLeft,
  Building2,
  MapPin,
  IdCard,
  FileCheck,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { Contact } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { VerifiedBadge, UnverifiedBadge } from './VerifiedBadge';

interface ContactProfileProps {
  contact: Contact;
  onBack: () => void;
  onCall: () => void;
  onVideoCall: () => void;
  onShare: () => void;
}

export function ContactProfile({ 
  contact, 
  onBack, 
  onCall, 
  onVideoCall, 
  onShare 
}: ContactProfileProps) {
  const { verificationDetails } = contact;

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
        <h1 className="text-lg font-semibold text-foreground">聯絡人資料</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {/* Profile header */}
        <div className="flex flex-col items-center px-4 py-6 bg-gradient-to-b from-primary/5 to-transparent">
          <Avatar
            name={contact.name.chinese}
            size="xl"
            isVerified={contact.isVerified}
          />
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-foreground">
              {contact.name.chinese}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {contact.name.english}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {contact.phone}
            </p>
            
            {contact.isVerified ? (
              <div className="flex items-center justify-center gap-2 mt-3">
                <VerifiedBadge size="lg" variant="shield" showLabel />
              </div>
            ) : (
              <div className="mt-3">
                <UnverifiedBadge size="md" showLabel />
              </div>
            )}
          </div>
        </div>

        {/* Verification details card - STAR FEATURE */}
        {contact.isVerified && verificationDetails && (
          <div className="mx-4 mt-2 mb-4 p-4 bg-card rounded-2xl border border-accent/30 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">專業資格驗證</h3>
                <p className="text-xs text-muted-foreground">Professional Verification</p>
              </div>
            </div>

            <div className="space-y-3">
              <VerificationRow
                icon={Building2}
                label="組織"
                labelEn="Organization"
                value={verificationDetails.organization.chinese}
                valueEn={verificationDetails.organization.english}
              />
              <VerificationRow
                icon={MapPin}
                label="分行"
                labelEn="Branch"
                value={verificationDetails.branch.chinese}
                valueEn={verificationDetails.branch.english}
              />
              <VerificationRow
                icon={IdCard}
                label="員工號碼"
                labelEn="Employee ID"
                value={verificationDetails.employeeId}
              />
              <VerificationRow
                icon={FileCheck}
                label="許可證號碼"
                labelEn="License Number"
                value={verificationDetails.licenseNumber}
              />
              <VerificationRow
                icon={Calendar}
                label="驗證日期"
                labelEn="Verification Date"
                value={verificationDetails.verificationDate}
              />
            </div>

            {/* License status badge */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">執照狀態</span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse-ring" />
                  <span className="text-sm font-medium text-accent">已驗證 Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning for unverified users */}
        {!contact.isVerified && (
          <div className="mx-4 mt-2 mb-4 p-4 rounded-2xl warning-card animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground">未驗證用戶</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  此用戶尚未通過專業資格驗證。請謹慎處理任何財務相關事宜。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center gap-4 px-4 py-4">
          <ActionButton
            icon={Phone}
            label="通話"
            onClick={onCall}
            primary
          />
          <ActionButton
            icon={Video}
            label="視像通話"
            onClick={onVideoCall}
          />
          <ActionButton
            icon={Share2}
            label="分享聯絡人"
            onClick={onShare}
          />
        </div>

        {/* Additional sections */}
        <div className="mt-4">
          <SectionButton
            icon={ImageIcon}
            label="媒體"
            labelEn="Media"
            count={12}
          />
          <SectionButton
            icon={Pin}
            label="置頂訊息"
            labelEn="Pinned Messages"
            count={3}
          />
        </div>

        {/* Danger zone */}
        <div className="mt-6 pt-4 border-t border-border">
          <DangerButton
            icon={Trash2}
            label="清除聊天"
            labelEn="Clear Chat"
          />
          <DangerButton
            icon={Ban}
            label="封鎖"
            labelEn="Block"
          />
          <DangerButton
            icon={AlertTriangle}
            label="檢舉"
            labelEn="Report"
            isReport
          />
        </div>
      </div>
    </div>
  );
}

interface VerificationRowProps {
  icon: React.ElementType;
  label: string;
  labelEn: string;
  value: string;
  valueEn?: string;
}

function VerificationRow({ icon: Icon, label, labelEn, value, valueEn }: VerificationRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-xs text-muted-foreground/60">{labelEn}</span>
        </div>
        <p className="font-medium text-foreground truncate">{value}</p>
        {valueEn && (
          <p className="text-sm text-muted-foreground truncate">{valueEn}</p>
        )}
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  primary?: boolean;
}

function ActionButton({ icon: Icon, label, onClick, primary }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 active:scale-95 transform min-w-[80px]',
        primary
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

interface SectionButtonProps {
  icon: React.ElementType;
  label: string;
  labelEn: string;
  count?: number;
}

function SectionButton({ icon: Icon, label, labelEn, count }: SectionButtonProps) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors active:bg-secondary">
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-baseline gap-1.5">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-sm text-muted-foreground">{labelEn}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {count !== undefined && (
          <span className="text-sm text-muted-foreground">{count}</span>
        )}
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </button>
  );
}

interface DangerButtonProps {
  icon: React.ElementType;
  label: string;
  labelEn: string;
  isReport?: boolean;
}

function DangerButton({ icon: Icon, label, labelEn, isReport }: DangerButtonProps) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3.5 transition-colors',
        isReport 
          ? 'hover:bg-warning/10 active:bg-warning/20' 
          : 'hover:bg-destructive/10 active:bg-destructive/20'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center',
        isReport ? 'bg-warning/10' : 'bg-destructive/10'
      )}>
        <Icon className={cn(
          'w-5 h-5',
          isReport ? 'text-warning' : 'text-destructive'
        )} />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-baseline gap-1.5">
          <span className={cn(
            'font-medium',
            isReport ? 'text-warning' : 'text-destructive'
          )}>{label}</span>
          <span className={cn(
            'text-sm',
            isReport ? 'text-warning/70' : 'text-destructive/70'
          )}>{labelEn}</span>
        </div>
      </div>
      <ChevronRight className={cn(
        'w-5 h-5',
        isReport ? 'text-warning' : 'text-destructive'
      )} />
    </button>
  );
}
