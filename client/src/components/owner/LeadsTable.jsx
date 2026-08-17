import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Spinner from '../ui/Spinner.jsx';

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export default function LeadsTable() {
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api
      .getLeads()
      .then(setLeads)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>;
  if (!leads) return <Spinner label="Loading leads…" />;

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
        No leads yet. Once a homeowner completes the estimator, they'll show up here.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Captured leads</h2>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white sm:block">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-sm text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Phone</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Submitted</th>
              <th className="px-5 py-3 font-semibold">Estimate</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <React.Fragment key={lead.id}>
                <tr
                  onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                  <td className="px-4 py-3 text-slate-600">{lead.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(lead.captured_at)}</td>
                  <td className="px-4 py-3 font-semibold text-copper-600">
                    {formatCurrency(lead.estimate_low)} – {formatCurrency(lead.estimate_high)}
                  </td>
                </tr>
                {expandedId === lead.id && (
                  <tr className="border-t border-slate-100 bg-slate-50">
                    <td colSpan={5} className="px-4 py-3">
                      <AnswerDetail answers={lead.answers} configVersion={lead.config_version} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <button
              onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
              className="w-full text-left"
            >
              <p className="text-lg font-semibold text-slate-900">{lead.name}</p>
              <p className="text-sm text-slate-500">{lead.phone} · {lead.email}</p>
              <p className="mt-1 text-sm text-slate-400">{formatDate(lead.captured_at)}</p>
              <p className="mt-2 font-semibold text-copper-600">
                {formatCurrency(lead.estimate_low)} – {formatCurrency(lead.estimate_high)}
              </p>
            </button>
            {expandedId === lead.id && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <AnswerDetail answers={lead.answers} configVersion={lead.config_version} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnswerDetail({ answers, configVersion }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Answers (config v{configVersion})
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        {Object.entries(answers).map(([key, value]) => (
          <div key={key}>
            <dt className="text-slate-400">{key}</dt>
            <dd className="font-medium text-slate-700">{String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
