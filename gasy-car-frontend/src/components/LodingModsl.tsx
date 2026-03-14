
import { Loader2 } from 'lucide-react';
;

export default function LoadingModal() {
  return (
    <div className="
      fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
      flex items-center justify-center
    ">
      <div className="bg-background rounded-xl px-5 py-5 shadow-md flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">
          Veuillez patienter...
        </span>
      </div>
    </div>
  );
}