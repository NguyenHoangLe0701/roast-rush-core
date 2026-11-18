import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';

export const ToastContainer: React.FC = () => {
  const { toastMessage, dismissToast } = useRoastRush();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md">
      <div
        className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-xl border ${
          toastMessage.type === 'success'
            ? 'bg-white border-emerald-200 text-stone-800'
            : toastMessage.type === 'warn'
            ? 'bg-white border-amber-200 text-stone-800'
            : 'bg-white border-rose-200 text-stone-800'
        }`}
      >
        {toastMessage.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              toastMessage.type === 'warn' ? 'text-amber-600' : 'text-rose-600'
            }`}
          />
        )}
        <div className="text-sm font-medium leading-relaxed flex-1">{toastMessage.text}</div>
        <button onClick={dismissToast} className="text-stone-400 hover:text-stone-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

