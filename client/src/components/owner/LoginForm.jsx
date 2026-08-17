import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(username, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-riseIn mx-auto max-w-sm space-y-4"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Owner panel</h1>
        <p className="mt-1 text-slate-400">
          Sign in to manage rates, questions, and leads.
        </p>
      </div>

      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-semibold text-slate-300"
        >
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="w-full rounded-xl border-2 border-slate-700 bg-slate-800 px-3 py-2.5 text-base text-white
            focus:outline-none focus:border-copper-500 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-300"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-xl border-2 border-slate-700 bg-slate-800 px-3 py-2.5 text-base text-white
            focus:outline-none focus:border-copper-500 transition-colors"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
