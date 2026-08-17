import React from 'react';

export default function Spinner({ label = 'Loading…', size = 'md' }) {
  const dims = size === 'sm' ? 'h-4 w-4 border-2' : 'h-8 w-8 border-[3px]';

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-slate-600">
      <div className={`${dims} animate-spin rounded-full border-copper-500 border-t-transparent`} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
