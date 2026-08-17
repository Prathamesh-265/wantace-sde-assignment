import React from 'react';

const variants = {
  primary: 'bg-copper-500 text-white hover:bg-copper-600 active:scale-[0.98]',
  ghost: 'bg-transparent text-slate-800 hover:bg-slate-800/5',
  dark: 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]',
};

export default function Button({ children, variant = 'primary', className = '', disabled, ...rest }) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold
        transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
