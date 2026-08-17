import React, { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import QuestionEditRow from "./QuestionEditRow.jsx";
import Button from "../ui/Button.jsx";
import Spinner from "../ui/Spinner.jsx";

export default function ConfigEditor({ onSaved }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getAdminConfig()
      .then(setConfig)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function updateQuestion(key, updater) {
    setConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.key === key ? updater(q) : q)),
    }));
  }

  function handleLabelChange(key, label) {
    updateQuestion(key, (q) => ({ ...q, label }));
  }

  function handleToggleActive(key) {
    updateQuestion(key, (q) => ({ ...q, active: !q.active }));
  }

  function handleOptionRateChange(key, optionValue, field, rawValue) {
    updateQuestion(key, (q) => ({
      ...q,
      options: q.options.map((opt) =>
        opt.value === optionValue ? { ...opt, [field]: Number(rawValue) } : opt,
      ),
    }));
  }

  function handleModifierChange(field, rawValue) {
    setConfig((prev) => ({
      ...prev,
      modifiers: { ...prev.modifiers, [field]: Number(rawValue) },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updated = await api.updateAdminConfig({
        questions: config.questions,
        modifiers: config.modifiers,
        business: config.business,
      });
      setConfig(updated);
      onSaved?.(updated.config_version);
    } catch (err) {
      setError(err.details?.join(" ") || err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Loading configuration…" />;
  if (!config) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Questions & rates</h2>
        <p className="mt-1 text-slate-600">
          Edit labels, adjust rates, or switch a question off. Changes go live
          the moment you save — the estimator keeps working while you edit.
        </p>
      </div>

      <div className="space-y-4">
        {config.questions.map((q) => (
          <QuestionEditRow
            key={q.key}
            question={q}
            onLabelChange={handleLabelChange}
            onToggleActive={handleToggleActive}
            onOptionRateChange={handleOptionRateChange}
          />
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Global settings
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Waste factor (e.g. 0.10 = 10%)
            </label>
            <input
              type="number"
              step="0.01"
              value={config.modifiers.waste_factor}
              onChange={(e) =>
                handleModifierChange("waste_factor", e.target.value)
              }
              className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-copper-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Permit fee ($)
            </label>
            <input
              type="number"
              step="1"
              value={config.modifiers.permit_flat_fee}
              onChange={(e) =>
                handleModifierChange("permit_flat_fee", e.target.value)
              }
              className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-copper-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Range spread (%)
            </label>
            <input
              type="number"
              step="1"
              value={config.modifiers.range_spread_pct}
              onChange={(e) =>
                handleModifierChange("range_spread_pct", e.target.value)
              }
              className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-copper-500"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <span className="text-sm text-slate-500">
          Current version: v{config.config_version}
        </span>
      </div>
    </div>
  );
}
