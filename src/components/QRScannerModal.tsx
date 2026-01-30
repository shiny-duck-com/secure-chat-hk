import { useState, useEffect } from 'react';
import { X, Keyboard, CheckCircle, Loader2 } from 'lucide-react';
import { Contact } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { VerifiedBadge } from './VerifiedBadge';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactFound: (contact: Contact) => void;
}

type ScanState = 'scanning' | 'processing' | 'found' | 'manual';

export function QRScannerModal({ isOpen, onClose, onContactFound }: QRScannerModalProps) {
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setScanState('scanning');
      setPhoneNumber('');
      
      // Simulate QR scan detection after 2 seconds
      const timer = setTimeout(() => {
        setScanState('processing');
        
        // Simulate processing
        setTimeout(() => {
          setScanState('found');
        }, 1000);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mockFoundContact: Contact = {
    id: 'new-1',
    name: { chinese: '林志明', english: 'David Lam' },
    phone: '+852 9555 1234',
    isVerified: true,
    isOnline: true,
    verificationDetails: {
      organization: { chinese: '恒生銀行', english: 'Hang Seng Bank' },
      branch: { chinese: '旺角分行', english: 'Mong Kok Branch' },
      employeeId: 'EMP-40123',
      licenseNumber: 'HKMA-RP-99876',
      role: { chinese: '財富管理顧問', english: 'Wealth Management Advisor' },
      verificationDate: '2025-01-28',
      licenseStatus: 'verified',
    },
  };

  const handleAddContact = () => {
    onContactFound(mockFoundContact);
    onClose();
  };

  const handleManualAdd = () => {
    setScanState('manual');
  };

  return (
    <>
      {/* Full screen overlay */}
      <div className="fixed inset-0 z-50 bg-foreground">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/20 text-background hover:bg-background/30 transition-colors"
          aria-label="關閉"
        >
          <X className="w-6 h-6" />
        </button>

        {scanState === 'scanning' && (
          <div className="h-full flex flex-col items-center justify-center px-6">
            {/* Scanner frame */}
            <div className="relative w-64 h-64 mb-8">
              {/* Corner frames */}
              <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-accent rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-accent rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-accent rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-accent rounded-br-xl" />
              
              {/* Scanning line */}
              <div className="absolute inset-x-4 top-4 h-1 bg-gradient-to-r from-transparent via-accent to-transparent scanner-line opacity-80" />
              
              {/* Center grid */}
              <div className="absolute inset-8 grid grid-cols-3 grid-rows-3 gap-1 opacity-30">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-background/50 rounded" />
                ))}
              </div>
            </div>

            <h2 className="text-xl font-bold text-background mb-2">
              掃描二維碼
            </h2>
            <p className="text-sm text-background/70 text-center mb-8">
              Scan QR Code to add contact
            </p>
            <p className="text-sm text-background/60 text-center">
              掃描聯絡人的二維碼
            </p>

            {/* Manual add button */}
            <button
              onClick={handleManualAdd}
              className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-background/20 text-background hover:bg-background/30 transition-colors"
            >
              <Keyboard className="w-5 h-5" />
              依電話號碼新增
            </button>
          </div>
        )}

        {scanState === 'processing' && (
          <div className="h-full flex flex-col items-center justify-center px-6">
            <Loader2 className="w-16 h-16 text-accent spinner mb-6" />
            <h2 className="text-xl font-bold text-background mb-2">
              驗證中...
            </h2>
            <p className="text-sm text-background/70">
              Verifying professional credentials
            </p>
          </div>
        )}

        {scanState === 'found' && (
          <div className="h-full flex flex-col items-center justify-center px-6 modal-content">
            {/* Success animation */}
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-6 success-check">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>

            <h2 className="text-xl font-bold text-background mb-6">
              找到已驗證聯絡人
            </h2>

            {/* Contact card */}
            <div className="w-full max-w-sm bg-card rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  name={mockFoundContact.name.chinese}
                  size="lg"
                  isVerified={mockFoundContact.isVerified}
                />
                <div>
                  <h3 className="font-bold text-foreground">
                    {mockFoundContact.name.chinese}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {mockFoundContact.name.english}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockFoundContact.phone}
                  </p>
                </div>
              </div>

              {mockFoundContact.verificationDetails && (
                <div className="p-3 bg-accent/5 rounded-xl border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <VerifiedBadge size="sm" />
                    <span className="text-sm font-medium text-accent">專業資格已驗證</span>
                  </div>
                  <p className="text-sm text-foreground">
                    {mockFoundContact.verificationDetails.organization.chinese}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {mockFoundContact.verificationDetails.role.chinese}
                  </p>
                </div>
              )}

              <button
                onClick={handleAddContact}
                className="w-full mt-4 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors active:scale-[0.98] transform"
              >
                新增聯絡人 Add Contact
              </button>
            </div>
          </div>
        )}

        {scanState === 'manual' && (
          <div className="h-full flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-sm bg-card rounded-2xl p-5 shadow-2xl modal-content">
              <h2 className="text-xl font-bold text-foreground mb-2">
                輸入電話號碼
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter phone number to add contact
              </p>

              <div className="mb-4">
                <label className="text-sm font-medium text-foreground">電話號碼</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+852 9XXX XXXX"
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setScanState('scanning')}
                  className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
                >
                  返回掃描
                </button>
                <button
                  disabled={!phoneNumber}
                  className={cn(
                    'flex-1 py-3 rounded-xl font-medium transition-colors',
                    phoneNumber
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  搜尋
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
