import React from 'react';

// Renders a `type: "number"` question exactly as described by the config
// object the server sent — label, unit, min/max all come from props.
export default function NumberQuestion({ question, value, onChange, error }) {
  return (
    <div className="animate-riseIn">
      <label htmlFor={question.key} className="mb-1.5 block text-lg font-semibold text-slate-900">
        {question.label}
      </label>
      <div className="relative">
        <input
          id={question.key}
          type="number"
          inputMode="numeric"
          min={question.min}
          max={question.max}
          value={value ?? ''}
          onChange={(e) => onChange(question.key, e.target.value)}
          placeholder={`Between ${question.min ?? ''}–${question.max ?? ''}`}
          className={`w-full rounded-lg border-2 bg-white px-3 py-2.5 text-base text-slate-900
            placeholder:text-slate-400 focus:outline-none focus:border-copper-500 transition-colors
            ${error ? 'border-red-400' : 'border-slate-200'}`}
        />
        {question.unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            {question.unit}
          </span>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
