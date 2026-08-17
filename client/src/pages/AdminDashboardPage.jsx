import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ConfigEditor from "../components/owner/ConfigEditor.jsx";
import LeadsTable from "../components/owner/LeadsTable.jsx";
import Toast from "../components/ui/Toast.jsx";

export default function AdminDashboardPage() {
  const { owner, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("config");
  const [toast, setToast] = useState(null);

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-slate-200 bg-slate-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-sm text-slate-400">
              Northline Roofing & Exteriors
            </p>
            <h1 className="text-xl font-bold text-white">Owner panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:inline">
              {owner?.username}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300
                hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl gap-1 px-5">
          {[
            { id: "config", label: "Questions & Rates" },
            { id: "leads", label: "Leads" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.id
                  ? "border-copper-500 text-copper-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-5 py-6">
        {tab === "config" && (
          <ConfigEditor
            onSaved={(v) => setToast(`Saved — now live as config v${v}.`)}
          />
        )}
        {tab === "leads" && <LeadsTable />}
      </main>

      <Toast message={toast} tone="success" onDismiss={() => setToast(null)} />
    </div>
  );
}
