import React from "react";
import EstimatorWizard from "../components/estimator/EstimatorWizard.jsx";

export default function EstimatorPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-copper-600">
            Northline Roofing & Exteriors
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Get your roof estimate
          </h1>
          <p className="mt-1.5 text-base text-slate-600">
            A few quick questions, then a real price range — no calls needed.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-6">
        <EstimatorWizard />
      </main>

      <footer className="mx-auto max-w-2xl px-5 pb-6 text-center text-sm text-slate-400">
        Northline Roofing & Exteriors · Columbus, OH
      </footer>
    </div>
  );
}
