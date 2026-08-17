import React from "react";

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ResultCard({ result, onStartOver }) {
  return (
    <div className="animate-riseIn text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-copper-600">
        Your estimate
      </p>
      <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
        {formatCurrency(result.estimate_low, result.currency)}
        <span className="mx-2 text-slate-400">–</span>
        {formatCurrency(result.estimate_high, result.currency)}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
        This range reflects current material costs, your roof's pitch and
        layers, and a standard permit fee. A Northline estimator will follow up
        to confirm exact pricing.
      </p>
      <div className="pitch-divider my-5" />
      <button
        onClick={onStartOver}
        className="text-sm font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4
          hover:text-copper-600"
      >
        Start a new estimate
      </button>
    </div>
  );
}
