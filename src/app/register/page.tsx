"use client";

import { useActionState, useEffect, useState } from "react";
import { register } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      alert(state.success);
      router.push("/login"); // Redirect to login after alert is dismissed
    } else if (state?.error) {
      alert(state.error);
    }
  }, [state, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!email.includes("@")) {
      e.preventDefault();
      alert("Format email tidak valid");
      return;
    }
    if (password.length < 8) {
      e.preventDefault();
      alert("Password minimal 8 karakter");
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Daftar Akun</h1>
      <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nama Lengkap</label>
          <input type="text" name="name" required className="w-full border p-2 rounded" data-testid="input-name" />
        </div>
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
        <div>
          <label className="block mb-1">Nomor HP</label>
          <input type="text" name="phone" required className="w-full border p-2 rounded" data-testid="input-phone" />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input 
            type="password" 
            name="password" 
            required 
            className="w-full border p-2 rounded" 
            data-testid="input-password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Konfirmasi Password</label>
          <input type="password" name="confirmPassword" required className="w-full border p-2 rounded" data-testid="input-confirm-password" />
        </div>
        
        <button type="submit" className="w-full bg-navy-900 text-white p-2 rounded hover:bg-slate-800 bg-slate-900" data-testid="btn-submit-register">
          Daftar
        </button>
      </form>
    </div>
  );
}
