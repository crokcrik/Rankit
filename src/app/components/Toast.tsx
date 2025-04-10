import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-background-elevated border border-border rounded-lg shadow-lg p-4 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <p className="text-text-primary">{message}</p>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary ml-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 