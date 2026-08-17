import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/owner/LoginForm.jsx";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
      <div className="w-full max-w-sm">
        <LoginForm onSuccess={() => navigate("/admin")} />
      </div>
    </div>
  );
}
