import { useState } from 'react';
import { 
  X, 
  FileText, 
  FileJson, 
  FileType,
  Calendar,
  ShieldCheck,
  Download,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { ExportFormat } from '@/types';
import { cn } from '@/lib/utils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
}

const formatOptions: { id: ExportFormat; icon: React.ElementType; label: string }[] = [
  { id: 'pdf', icon: FileText, label: 'PDF' },
  { id: 'txt', icon: FileType, label: 'TXT' },
  { id: 'json', icon: FileJson, label: 'JSON' },
];

export function ExportModal({ isOpen, onClose, contactName }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [forCompliance, setForCompliance] = useState(true);
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    setIsExporting(false);
    setExportSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      setExportSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-card rounded-3xl shadow-2xl modal-content overflow-hidden">
        {exportSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 success-check">
              <CheckCircle className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">匯出成功</h2>
            <p className="text-sm text-muted-foreground text-center">
              chat_export_{new Date().toISOString().split('T')[0]}.{selectedFormat}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">匯出聊天記錄</h2>
                <p className="text-sm text-muted-foreground">Export Chat History</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="關閉"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Contact info */}
              <div className="text-sm text-muted-foreground">
                聊天記錄: <span className="font-medium text-foreground">{contactName}</span>
              </div>

              {/* Date range */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  日期範圍 Date Range
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">開始日期</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl bg-secondary border-0 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">結束日期</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2.5 rounded-xl bg-secondary border-0 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Format selection */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground">
                  匯出格式 Export Format
                </div>
                <div className="flex gap-2">
                  {formatOptions.map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedFormat(id)}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200',
                        selectedFormat === id
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-secondary hover:border-primary/50'
                      )}
                    >
                      <Icon className={cn(
                        'w-6 h-6',
                        selectedFormat === id ? 'text-primary' : 'text-muted-foreground'
                      )} />
                      <span className={cn(
                        'text-sm font-medium',
                        selectedFormat === id ? 'text-primary' : 'text-muted-foreground'
                      )}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Compliance toggle */}
              <button
                onClick={() => setForCompliance(!forCompliance)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200',
                  forCompliance 
                    ? 'border-accent bg-accent/5' 
                    : 'border-border bg-secondary'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  forCompliance ? 'bg-accent/10' : 'bg-muted'
                )}>
                  <ShieldCheck className={cn(
                    'w-5 h-5',
                    forCompliance ? 'text-accent' : 'text-muted-foreground'
                  )} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-foreground">合規審計格式</div>
                  <div className="text-xs text-muted-foreground">Export for Compliance Audit</div>
                </div>
                <div className={cn(
                  'w-12 h-7 rounded-full p-1 transition-colors',
                  forCompliance ? 'bg-accent' : 'bg-muted'
                )}>
                  <div className={cn(
                    'w-5 h-5 rounded-full bg-white shadow transition-transform',
                    forCompliance ? 'translate-x-5' : 'translate-x-0'
                  )} />
                </div>
              </button>

              {/* Compliance note */}
              <p className="text-xs text-muted-foreground text-center">
                符合7年審計要求 | Meets 7-year audit requirements
              </p>

              {/* Export button */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-200',
                  isExporting
                    ? 'bg-primary/70 text-primary-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transform'
                )}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 spinner" />
                    匯出中...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    匯出 Export
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
