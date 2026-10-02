"use client";

import { useActionState, useState, useTransition } from "react";
import { createService, toggleServiceStatus, deleteService } from "@/app/admin-actions";
import { ServiceItem } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function ServiceClient({ initialServices }: { initialServices: ServiceItem[] }) {
  const [state, formAction] = useActionState(createService, undefined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [clientError, setClientError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const price = parseInt(fd.get("price") as string);
    const durationDays = parseInt(fd.get("durationDays") as string);
    
    if (price < 0) {
      e.preventDefault();
      setClientError("Harga tidak boleh negatif");
      return;
    }
    if (durationDays <= 0) {
      e.preventDefault();
      setClientError("Durasi pengerjaan harus minimal 1 hari");
      return;
    }
    setClientError("");
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleServiceStatus(id, !currentStatus);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus layanan ini?")) {
      startTransition(async () => {
        await deleteService(id);
        router.refresh();
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Tambah Layanan */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Tambah Layanan Baru</h2>
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Nama Layanan</label>
            <input type="text" name="name" required maxLength={50} placeholder="Maks. 50 karakter" className="w-full border p-2 rounded" data-testid="input-service-name" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Harga (Rp)</label>
            <input type="number" name="price" required min="0" className="w-full border p-2 rounded" data-testid="input-service-price" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Estimasi Waktu (Hari)</label>
            <input type="number" name="durationDays" required min="1" className="w-full border p-2 rounded" data-testid="input-service-duration" />
          </div>
          
          {(clientError || state?.error) && (
            <p className="text-red-500 text-sm" data-testid="service-form-error">{clientError || state?.error}</p>
          )}
          {state?.success && (
            <p className="text-green-600 text-sm" data-testid="service-form-success">{state.success}</p>
          )}
          
          <button type="submit" className="w-full bg-slate-900 text-white p-2 rounded hover:bg-slate-800 transition" data-testid="btn-add-service">
            Simpan Layanan
          </button>
        </form>
      </div>

      {/* Tabel Daftar Layanan */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Daftar Layanan</h2>
        <table className="w-full text-left border-collapse" data-testid="service-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nama Layanan</th>
              <th className="border p-2">Harga</th>
              <th className="border p-2">Durasi</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {initialServices.length > 0 ? initialServices.map((svc) => (
              <tr key={svc.id} className="hover:bg-gray-50">
                <td className="border p-2 font-semibold">{svc.name}</td>
                <td className="border p-2">Rp {svc.price.toLocaleString("id-ID")}</td>
                <td className="border p-2">{svc.durationDays} Hari</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleToggle(svc.id, svc.isActive)}
                    disabled={isPending}
                    className={`px-3 py-1 rounded text-xs font-bold text-white transition ${
                      svc.isActive ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
                    }`}
                    data-testid={`btn-toggle-service-${svc.id}`}
                  >
                    {svc.isActive ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="border p-2">
                  <button 
                    onClick={() => handleDelete(svc.id)}
                    disabled={isPending}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-red-300 transition"
                    data-testid="btn-delete-service"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="border p-4 text-center text-gray-500">Belum ada layanan terdaftar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
