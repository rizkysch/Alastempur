"use client";

import { useActionState, useState, Suspense } from "react";
import { resetPassword } from "@/app/actions";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPassword, undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [clientError, setClientError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (password.length < 8) {
      e.preventDefault();
      setClientError("Password minimal 8 karakter");
      return;
    }
    if (password !== confirmPassword) {
      e.preventDefault();
      setClientError("Password tidak cocok");
      return;
    }
    setClientError("");
  };

  if (!token) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded text-center">
        Token reset password tidak ditemukan. Silakan gunakan link dari email Anda.
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      
      <div>
        <label className="block mb-1">Password Baru</label>
        <input 
          type="password" 
          name="password" 
          required 
          className="w-full border p-2 rounded focus:ring-2 focus:ring-slate-900" 
          data-testid="input-new-password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div>
        <label className="block mb-1">Konfirmasi Password Baru</label>
        <input 
          type="password" 
          name="confirmPassword" 
          required 
          className="w-full border p-2 rounded focus:ring-2 focus:ring-slate-900" 
          data-testid="input-confirm-new-password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      
      {(clientError || state?.error) && (
        <p className="text-red-500 text-sm bg-red-50 p-2 rounded" data-testid="error-message">
          {clientError || state?.error}
        </p>
      )}
      
      <button type="submit" className="w-full bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition" data-testid="btn-submit-reset">
        Simpan Password Baru
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
      <Suspense fallback={<div className="text-center">Memuat...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
