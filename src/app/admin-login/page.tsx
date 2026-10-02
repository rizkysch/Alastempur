"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/admin-actions";

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(adminLogin, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border-t-4 border-slate-900">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-900">Admin Portal</h1>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email Admin</label>
            <input type="email" name="email" required className="w-full border p-2 rounded focus:ring-2 focus:ring-slate-900" data-testid="input-admin-email" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" name="password" required className="w-full border p-2 rounded focus:ring-2 focus:ring-slate-900" data-testid="input-admin-password" />
          </div>
          
          {state?.error && (
            <p className="text-red-500 text-sm bg-red-50 p-2 rounded text-center" data-testid="error-message">
              {state.error}
            </p>
          )}
          
          <button type="submit" className="w-full bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition" data-testid="btn-admin-login">
            Masuk sebagai Admin
          </button>
        </form>
      </div>
    </div>
  );
}
