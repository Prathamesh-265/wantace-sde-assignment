import React, { useEffect } from 'react';

export default function Toast({ message, tone = 'error', onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const toneClasses =
    tone === 'success'
      ? 'bg-slate-900 border-copper-500'
      : 'bg-slate-900 border-red-400';

  return (
    <div
      role="status"
      className={`fixed bottom-5 left-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 rounded-xl border-l-4 ${toneClasses}
        px-4 py-3 text-white shadow-xl animate-riseIn`}
    >
      <p className="text-sm leading-snug">{message}</p>
    </div>
  );
}
