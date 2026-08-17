import React from 'react';

// Renders a `type: "select"` question. Options — including their labels —
// come entirely from the config the server returned; nothing here is

export default function SelectQuestion({ question, value, onChange, error }) {
  return (
    <fieldset className="animate-riseIn">
      <legend className="mb-2 text-lg font-semibold text-slate-900">{question.label}</legend>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {question.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center justify-between rounded-lg border-2 px-3 py-3
                text-sm transition-all duration-150
                ${selected
                  ? 'border-copper-500 bg-copper-100 font-semibold text-copper-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
            >
              <span>{opt.label}</span>
              <input
                type="radio"
                name={question.key}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(question.key, opt.value)}
                className="h-5 w-5 accent-copper-500"
              />
            </label>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </fieldset>
  );
}
