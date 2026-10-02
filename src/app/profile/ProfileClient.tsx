"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "@/app/actions";
import { User } from "@/lib/db";

export default function ProfileClient({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateProfile, undefined);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address || "");
  const [clientError, setClientError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!name.trim()) {
      e.preventDefault();
      setClientError("Nama tidak boleh kosong");
      return;
    }
    if (!phone.trim()) {
      e.preventDefault();
      setClientError("Nomor HP tidak boleh kosong");
      return;
    }
    setClientError("");
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Email (Tidak bisa diubah)</label>
        <input 
          type="email" 
          disabled 
          value={user.email} 
          className="w-full border p-2 rounded bg-gray-100" 
          data-testid="input-email-disabled" 
        />
      </div>
      <div>
        <label className="block mb-1">Nama Lengkap</label>
        <input 
          type="text" 
          name="name" 
          required 
          className="w-full border p-2 rounded" 
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1">Nomor HP</label>
        <input 
          type="text" 
          name="phone" 
          required 
          className="w-full border p-2 rounded" 
          data-testid="input-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1">Alamat Lengkap</label>
        <textarea 
          name="address" 
          className="w-full border p-2 rounded" 
          rows={3} 
          data-testid="textarea-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>
      </div>
      
      {state?.success && (
        <div className="bg-green-100 text-green-700 p-2 rounded text-sm" data-testid="success-message">
          {state.success}
        </div>
      )}
      
      {(clientError || state?.error) && (
        <p className="text-red-500 text-sm" data-testid="error-message">{clientError || state?.error}</p>
      )}
      
      <button type="submit" className="w-full bg-navy-900 text-white p-2 rounded hover:bg-slate-800 bg-slate-900" data-testid="btn-submit-profile">
        Simpan Perubahan
      </button>
    </form>
  );
}
