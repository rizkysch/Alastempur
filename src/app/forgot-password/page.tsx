"use client";

import { useActionState } from "react";
import { forgotPassword } from "@/app/actions";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPassword, undefined);
  const [email, setEmail] = useState("");
  const [clientError, setClientError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!email.includes("@")) {
      e.preventDefault();
      setClientError("Format email tidak valid");
    } else {
      setClientError("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Lupa Password</h1>
      {state?.success ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-4" data-testid="success-message">
          <p className="mb-2">{state.success}</p>
          {state.resetLink && (
            <a href={state.resetLink} className="text-blue-600 underline font-semibold break-all" data-testid="simulated-reset-link">
              {state.resetLink}
            </a>
          )}
        </div>
      ) : (
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full border p-2 rounded" 
              data-testid="input-email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          {(clientError || state?.error) && (
            <p className="text-red-500 text-sm" data-testid="error-message">{clientError || state?.error}</p>
          )}
          
          <button type="submit" className="w-full bg-navy-900 text-white p-2 rounded hover:bg-slate-800 bg-slate-900" data-testid="btn-submit-forgot">
            Kirim Tautan Reset
          </button>
        </form>
      )}
    </div>
  );
}
