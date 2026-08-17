import React from 'react';

// One question's worth of editable fields: label, active toggle, and
// whatever rate/multiplier fields its options carry. Built to be usable
// by someone non-technical — plain labels, no JSON in sight.
export default function QuestionEditRow({ question, onLabelChange, onToggleActive, onOptionRateChange }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Question text
          </label>
          <input
            value={question.label}
            onChange={(e) => onLabelChange(question.key, e.target.value)}
            className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-base font-medium
              focus:outline-none focus:border-copper-500"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 pt-4 select-none">
          <span className="text-sm text-slate-500">{question.active ? 'On' : 'Off'}</span>
          <button
            type="button"
            role="switch"
            aria-checked={question.active}
            onClick={() => onToggleActive(question.key)}
            className={`h-7 w-12 rounded-full transition-colors ${question.active ? 'bg-copper-500' : 'bg-slate-300'}`}
          >
            <span
              className={`block h-5 w-5 translate-x-1 rounded-full bg-white transition-transform ${
                question.active ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </div>

      {Array.isArray(question.options) && question.options.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
          {question.options.map((opt) => {
            const rateField = 'rate_per_sqft' in opt ? 'rate_per_sqft'
              : 'multiplier' in opt ? 'multiplier'
              : 'tear_off_per_sqft' in opt ? 'tear_off_per_sqft'
              : null;
            if (!rateField) return null;

            return (
              <div key={opt.value}>
                <label className="mb-1 block text-xs text-slate-500">{opt.label}</label>
                <input
                  type="number"
                  step="0.01"
                  value={opt[rateField]}
                  onChange={(e) => onOptionRateChange(question.key, opt.value, rateField, e.target.value)}
                  className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-base
                    focus:outline-none focus:border-copper-500"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
