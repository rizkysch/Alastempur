"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" name="email" required className="w-full border p-2 rounded" data-testid="input-email" />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input type="password" name="password" required className="w-full border p-2 rounded" data-testid="input-password" />
        </div>
        
        {state?.error && (
          <p className="text-red-500 text-sm" data-testid="error-message">{state.error}</p>
        )}
        
        <button type="submit" className="w-full bg-navy-900 text-white p-2 rounded hover:bg-slate-800 bg-slate-900" data-testid="btn-submit-login">
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/forgot-password" className="text-blue-600 text-sm" data-testid="link-forgot-password">
          Lupa Password?
        </Link>
      </div>
    </div>
  );
}
