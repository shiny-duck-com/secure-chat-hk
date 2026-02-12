import { 
  User,
  QrCode,
  Building2,
  Shield,
  Bell,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { getCurrentUser } from '@/data/mockData';

interface SettingsTabProps {
  onOpenMyQR?: () => void;
}

export function SettingsTab({ onOpenMyQR }: SettingsTabProps) {
  const user = getCurrentUser();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground mb-4">設定</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {/* Profile section */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border">
            <Avatar
              name={user.name.chinese}
              size="lg"
              isVerified={user.isVerified}
            />
            <div className="flex-1">
              <h2 className="font-bold text-foreground">{user.name.chinese}</h2>
              <p className="text-sm text-muted-foreground">{user.name.english}</p>
              <p className="text-sm text-muted-foreground">{user.phone}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* My QR Code */}
        <div className="px-4 mb-6">
          <button
            onClick={onOpenMyQR}
            className="w-full flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/20 hover:bg-primary/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-foreground">我的二維碼</div>
              <div className="text-sm text-muted-foreground">My QR Code</div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Settings sections */}
        <SettingsSection title="帳戶" titleEn="Account">
          <SettingsItem
            icon={Building2}
            label="已連結機構"
            labelEn="Linked Organization"
            value="個人用戶"
          />
          <SettingsItem
            icon={ShieldCheck}
            label="驗證狀態"
            labelEn="Verification Status"
            value="已驗證"
            valueColor="text-accent"
          />
        </SettingsSection>

        <SettingsSection title="隱私" titleEn="Privacy">
          <SettingsToggle
            icon={Shield}
            label="只接受已驗證聯絡人"
            labelEn="Only accept verified contacts"
            defaultChecked={true}
          />
          <SettingsToggle
            icon={User}
            label="顯示在線狀態"
            labelEn="Show online status"
            defaultChecked={true}
          />
          <SettingsToggle
            icon={ShieldCheck}
            label="已讀回條"
            labelEn="Read receipts"
            defaultChecked={true}
          />
        </SettingsSection>

        <SettingsSection title="通知" titleEn="Notifications">
          <SettingsToggle
            icon={Bell}
            label="訊息通知"
            labelEn="Message notifications"
            defaultChecked={true}
          />
          <SettingsToggle
            icon={Bell}
            label="通話通知"
            labelEn="Call notifications"
            defaultChecked={true}
          />
        </SettingsSection>

        {/* App version */}
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            SecureChannel v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            端對端加密通訊平台
          </p>
        </div>
      </div>
    </div>
  );
}

interface SettingsSectionProps {
  title: string;
  titleEn: string;
  children: React.ReactNode;
}

function SettingsSection({ title, titleEn, children }: SettingsSectionProps) {
  return (
    <div className="mb-6">
      <div className="px-4 mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">{titleEn}</span>
        </div>
      </div>
      <div className="bg-card mx-4 rounded-2xl border border-border overflow-hidden divide-y divide-border">
        {children}
      </div>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ElementType;
  label: string;
  labelEn: string;
  value?: string;
  valueColor?: string;
}

function SettingsItem({ icon: Icon, label, labelEn, value, valueColor }: SettingsItemProps) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-baseline gap-1.5">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-sm text-muted-foreground">{labelEn}</span>
        </div>
      </div>
      {value && (
        <span className={cn('text-sm', valueColor || 'text-muted-foreground')}>
          {value}
        </span>
      )}
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}

interface SettingsToggleProps {
  icon: React.ElementType;
  label: string;
  labelEn: string;
  defaultChecked?: boolean;
}

function SettingsToggle({ icon: Icon, label, labelEn, defaultChecked }: SettingsToggleProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-medium text-foreground">{label}</span>
        </div>
        <span className="text-xs text-muted-foreground">{labelEn}</span>
      </div>
      <label className="relative inline-flex cursor-pointer">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors">
          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
        </div>
      </label>
    </div>
  );
}
