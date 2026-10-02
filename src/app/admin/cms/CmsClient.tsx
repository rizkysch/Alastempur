"use client";

import { useActionState, useState } from "react";
import { updateCms } from "@/app/admin-actions";
import { ContentCMS } from "@/lib/db";

export default function CmsClient({ initialCms }: { initialCms: ContentCMS }) {
  const [state, formAction] = useActionState(updateCms, undefined);
  const [clientError, setClientError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const phone = fd.get("phone") as string;
    
    // Basic phone validation (only numbers and some symbols)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      e.preventDefault();
      setClientError("Format nomor telepon tidak valid");
      return;
    }
    
    setClientError("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Teks Hero (Halaman Utama)</label>
          <input type="text" name="heroText" defaultValue={initialCms.heroText} required className="w-full border p-2 rounded" data-testid="input-cms-hero" />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Deskripsi Tentang Kami</label>
          <textarea name="aboutText" defaultValue={initialCms.aboutText} required rows={4} className="w-full border p-2 rounded" data-testid="input-cms-about"></textarea>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Email Kontak</label>
          <input type="email" name="email" defaultValue={initialCms.email} required className="w-full border p-2 rounded" data-testid="input-cms-email" />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Nomor WhatsApp / HP</label>
          <input type="text" name="phone" defaultValue={initialCms.phone} required className="w-full border p-2 rounded" data-testid="input-cms-phone" />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Alamat Lokasi Utama</label>
          <textarea name="address" defaultValue={initialCms.address} required rows={2} className="w-full border p-2 rounded" data-testid="input-cms-address"></textarea>
        </div>
        
        {(clientError || state?.error) && (
          <p className="text-red-500 text-sm" data-testid="cms-error-message">{clientError || state?.error}</p>
        )}
        {state?.success && (
          <p className="text-green-600 text-sm font-medium" data-testid="cms-success-message">{state.success}</p>
        )}
        
        <button type="submit" className="w-full bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition" data-testid="btn-save-cms">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
