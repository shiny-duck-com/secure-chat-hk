import { useState } from 'react';
import { 
  Phone, 
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
  ShieldCheck,
  UserMinus,
  Archive,
  X
} from 'lucide-react';
import { Contact } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { VerifiedBadge, UnverifiedBadge } from './VerifiedBadge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

interface ContactProfileProps {
  contact: Contact;
  onBack: () => void;
  onCall: () => void;
  onShare: () => void;
  onClearChat: () => void;
  onBlockContact: () => void;
  onReportContact: (reason: string) => void;
  onDeleteContact: () => void;
  onArchiveChat: () => void;
}

const reportReasons = [
  { id: 'spam', label: '垃圾訊息', labelEn: 'Spam' },
  { id: 'phishing', label: '網絡釣魚', labelEn: 'Phishing' },
  { id: 'trademark', label: '商標侵權', labelEn: 'Trademark Infringements' },
  { id: 'adult', label: '成人色情內容', labelEn: 'Adult Sexual Material' },
  { id: 'prohibited', label: '違禁或受限產品', labelEn: 'Prohibited or Restricted Products' },
  { id: 'misleading', label: '誤導性商品服務資訊', labelEn: 'Misleading Information' },
  { id: 'inauthentic', label: '虛假帳戶', labelEn: 'Inauthentic Accounts' },
  { id: 'others', label: '其他', labelEn: 'Others' },
];

export function ContactProfile({ 
  contact, 
  onBack, 
  onCall, 
  onShare,
  onClearChat,
  onBlockContact,
  onReportContact,
  onDeleteContact,
  onArchiveChat,
}: ContactProfileProps) {
  const { verificationDetails } = contact;
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const handleClearConfirm = () => {
    onClearChat();
    setShowClearDialog(false);
    toast.success('聊天記錄已清除');
  };

  const handleBlockConfirm = () => {
    onBlockContact();
    setShowBlockDialog(false);
    toast.success('已封鎖此聯絡人');
  };

  const handleReportConfirm = () => {
    if (!selectedReason) {
      toast.error('請選擇檢舉原因');
      return;
    }
    onReportContact(selectedReason);
    setShowReportDialog(false);
    setSelectedReason('');
    toast.success('檢舉已提交', { description: '已發送至 ADCC (反詐騙協調中心)' });
  };

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

        {/* Action buttons - no labels */}
        <div className="flex justify-center gap-4 px-4 py-4">
          <button
            onClick={onCall}
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 transform"
            aria-label="通話"
          >
            <Phone className="w-6 h-6" />
          </button>
          <button
            onClick={onShare}
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all active:scale-95 transform"
            aria-label="分享聯絡人"
          >
            <Share2 className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              onDeleteContact();
              toast.success('已刪除聯絡人', { description: `${contact.name.chinese} 已從聯絡人列表中移除` });
            }}
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all active:scale-95 transform"
            aria-label="刪除聯絡人"
          >
            <UserMinus className="w-6 h-6" />
          </button>
        </div>

        {/* Verification details accordion */}
        {contact.isVerified && verificationDetails && (
          <div className="mx-4 mt-2 mb-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="verification" className="border border-accent/30 rounded-2xl overflow-hidden bg-card shadow-sm">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground text-sm">專業資格驗證</h3>
                      <p className="text-xs text-muted-foreground">Professional Verification</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-4 pb-2 space-y-3">
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
                    {/* License status badge */}
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">執照狀態</span>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10">
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-ring" />
                          <span className="text-sm font-medium text-accent">已驗證 Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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

        {/* Additional sections */}
        <div className="mt-4">
          <SectionButton icon={ImageIcon} label="媒體" labelEn="Media" count={12} />
          <SectionButton icon={Pin} label="置頂訊息" labelEn="Pinned Messages" count={3} />
        </div>

        {/* Danger zone */}
        <div className="mt-6 pt-4 border-t border-border">
          <DangerButton icon={Archive} label="封存聊天" labelEn="Archive Chat" onClick={onArchiveChat} />
          <DangerButton icon={Trash2} label="清除聊天" labelEn="Clear Chat" onClick={() => setShowClearDialog(true)} />
          <DangerButton icon={Ban} label="封鎖" labelEn="Block" onClick={() => setShowBlockDialog(true)} />
          <DangerButton icon={AlertTriangle} label="檢舉" labelEn="Report" isReport onClick={() => setShowReportDialog(true)} />
        </div>
      </div>

      {/* Clear Chat Dialog */}
      {showClearDialog && (
        <DialogOverlay onClose={() => setShowClearDialog(false)}>
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-destructive" />
            </div>
            <h3 className="text-lg font-bold text-foreground">清除聊天記錄</h3>
            <p className="text-sm text-muted-foreground mt-2">
              確定要清除與 {contact.name.chinese} 的所有聊天記錄嗎？此操作無法撤銷。
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowClearDialog(false)}
              className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors active:scale-95 transform"
            >
              取消
            </button>
            <button
              onClick={handleClearConfirm}
              className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors active:scale-95 transform"
            >
              清除
            </button>
          </div>
        </DialogOverlay>
      )}

      {/* Block Dialog */}
      {showBlockDialog && (
        <DialogOverlay onClose={() => setShowBlockDialog(false)}>
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Ban className="w-7 h-7 text-destructive" />
            </div>
            <h3 className="text-lg font-bold text-foreground">封鎖聯絡人</h3>
            <p className="text-sm text-muted-foreground mt-2">
              確定要封鎖 {contact.name.chinese} 嗎？封鎖後將無法收到此聯絡人的訊息。
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBlockDialog(false)}
              className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors active:scale-95 transform"
            >
              取消
            </button>
            <button
              onClick={handleBlockConfirm}
              className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors active:scale-95 transform"
            >
              確認封鎖
            </button>
          </div>
        </DialogOverlay>
      )}

      {/* Report Dialog */}
      {showReportDialog && (
        <DialogOverlay onClose={() => setShowReportDialog(false)}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">檢舉聯絡人</h3>
                <p className="text-xs text-muted-foreground">Report Contact</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              請選擇檢舉原因：
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {reportReasons.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left',
                    selectedReason === reason.id
                      ? 'border-warning bg-warning/10'
                      : 'border-border hover:bg-secondary/50'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    selectedReason === reason.id ? 'border-warning' : 'border-muted-foreground/30'
                  )}>
                    {selectedReason === reason.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-warning" />
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-sm">{reason.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">{reason.labelEn}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setShowReportDialog(false); setSelectedReason(''); }}
              className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors active:scale-95 transform"
            >
              取消
            </button>
            <button
              onClick={handleReportConfirm}
              className={cn(
                'flex-1 py-3 rounded-xl font-medium transition-colors active:scale-95 transform',
                selectedReason
                  ? 'bg-warning text-warning-foreground hover:bg-warning/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              確認檢舉
            </button>
          </div>
        </DialogOverlay>
      )}
    </div>
  );
}

// Reusable dialog overlay
function DialogOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl p-6 mx-6 w-full max-w-sm shadow-xl modal-content">
        {children}
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
  onClick?: () => void;
}

function DangerButton({ icon: Icon, label, labelEn, isReport, onClick }: DangerButtonProps) {
  return (
    <button
      onClick={onClick}
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
