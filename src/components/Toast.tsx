import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        let icon = <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />;
        let borderClass = 'border-sky-500/30 bg-slate-900/95 text-slate-100';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
          borderClass = 'border-emerald-500/40 bg-slate-900/95 text-emerald-50';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
          borderClass = 'border-amber-500/40 bg-slate-900/95 text-amber-50';
        } else if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />;
          borderClass = 'border-rose-500/40 bg-slate-900/95 text-rose-50';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-tight text-white">{toast.title}</div>
              {toast.description && (
                <div className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
