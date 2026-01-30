import { Smartphone } from 'lucide-react';

export function DesktopNotice() {
  return (
    <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Smartphone className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          請使用手機訪問
        </h1>
        <p className="text-muted-foreground mb-2">
          Please use mobile for best experience
        </p>
        <p className="text-sm text-muted-foreground">
          SecureChannel 是為移動設備優化的應用程式。請使用手機或縮小瀏覽器視窗以獲得最佳體驗。
        </p>
        
        <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-sm text-primary font-medium">
            💡 提示：將瀏覽器視窗縮小至 768px 以下即可預覽
          </p>
        </div>
      </div>
    </div>
  );
}
