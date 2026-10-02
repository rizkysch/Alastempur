"use client";

import { useActionState, useState, useTransition } from "react";
import { createPromo, deletePromo } from "@/app/admin-actions";
import { Promo } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function PromosClient({ initialPromos }: { initialPromos: Promo[] }) {
  const [state, formAction] = useActionState(createPromo, undefined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [clientError, setClientError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const value = parseFloat(fd.get("value") as string);
    const type = fd.get("type") as string;
    
    if (value <= 0) {
      e.preventDefault();
      setClientError("Nilai diskon harus lebih dari 0");
      return;
    }
    if (type === "Percent" && value > 100) {
      e.preventDefault();
      setClientError("Diskon persentase tidak boleh lebih dari 100%");
      return;
    }
    setClientError("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus kode promo ini?")) {
      startTransition(async () => {
        await deletePromo(id);
        router.refresh();
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Tambah Promo */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Buat Promo Baru</h2>
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Kode Voucher</label>
            <input type="text" name="code" required placeholder="Contoh: ALAS10" className="w-full border p-2 rounded uppercase" data-testid="input-promo-code" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Tipe Diskon</label>
            <select name="type" className="w-full border p-2 rounded" data-testid="select-promo-type">
              <option value="Percent">Persentase (%)</option>
              <option value="Nominal">Nominal (Rp)</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Nilai Diskon</label>
            <input type="number" name="value" required min="1" className="w-full border p-2 rounded" data-testid="input-promo-value" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Tanggal Kedaluwarsa</label>
            <input type="date" name="expiryDate" required className="w-full border p-2 rounded" data-testid="input-promo-expiry" />
          </div>
          
          {(clientError || state?.error) && (
            <p className="text-red-500 text-sm" data-testid="promo-form-error">{clientError || state?.error}</p>
          )}
          {state?.success && (
            <p className="text-green-600 text-sm" data-testid="promo-form-success">{state.success}</p>
          )}
          
          <button type="submit" className="w-full bg-slate-900 text-white p-2 rounded hover:bg-slate-800 transition" data-testid="btn-add-promo">
            Buat Voucher
          </button>
        </form>
      </div>

      {/* Tabel Daftar Promo */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Daftar Kode Promo</h2>
        <table className="w-full text-left border-collapse" data-testid="promo-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Kode</th>
              <th className="border p-2">Tipe</th>
              <th className="border p-2">Nilai</th>
              <th className="border p-2">Kedaluwarsa</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {initialPromos.length > 0 ? initialPromos.map((promo) => (
              <tr key={promo.id} className="hover:bg-gray-50">
                <td className="border p-2 font-bold text-blue-600">{promo.code}</td>
                <td className="border p-2">{promo.type === 'Percent' ? 'Persen' : 'Nominal'}</td>
                <td className="border p-2">
                  {promo.type === 'Percent' ? `${promo.value}%` : `Rp ${promo.value.toLocaleString("id-ID")}`}
                </td>
                <td className="border p-2">{new Date(promo.expiryDate).toLocaleDateString("id-ID")}</td>
                <td className="border p-2">
                  <button 
                    onClick={() => handleDelete(promo.id)}
                    disabled={isPending}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-red-300 transition"
                    data-testid="btn-delete-promo"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="border p-4 text-center text-gray-500">Tidak ada kode promo aktif</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
