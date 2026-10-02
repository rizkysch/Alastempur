"use client";

import { useActionState, useState, useTransition } from "react";
import { createAdmin, deleteAdmin } from "@/app/admin-actions";
import { Admin } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function AdminClient({ initialAdmins }: { initialAdmins: Admin[] }) {
  const [state, formAction] = useActionState(createAdmin, undefined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const [clientError, setClientError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    
    if (password.length < 8) {
      e.preventDefault();
      setClientError("Password minimal 8 karakter");
      return;
    }
    setClientError("");
  };

  const handleDelete = (id: string, role: string) => {
    if (role === "Super Admin") {
      alert("Tidak dapat menghapus akun Super Admin!");
      return;
    }
    if (confirm("Yakin ingin menghapus admin ini?")) {
      startTransition(async () => {
        await deleteAdmin(id);
        router.refresh();
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Tambah Admin */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Tambah Admin Baru</h2>
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Nama Lengkap</label>
            <input type="text" name="name" required className="w-full border p-2 rounded" data-testid="input-admin-name" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input type="email" name="email" required className="w-full border p-2 rounded" data-testid="input-admin-email" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input type="password" name="password" required className="w-full border p-2 rounded" data-testid="input-admin-password" />
          </div>
          
          {(clientError || state?.error) && (
            <p className="text-red-500 text-sm" data-testid="admin-form-error">{clientError || state?.error}</p>
          )}
          {state?.success && (
            <p className="text-green-600 text-sm" data-testid="admin-form-success">{state.success}</p>
          )}
          
          <button type="submit" className="w-full bg-slate-900 text-white p-2 rounded hover:bg-slate-800 transition" data-testid="btn-add-admin">
            Simpan Admin
          </button>
        </form>
      </div>

      {/* Tabel Daftar Admin */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Daftar Akun Admin</h2>
        <table className="w-full text-left border-collapse" data-testid="admin-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nama</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {initialAdmins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50" data-testid={`admin-row-${admin.id}`}>
                <td className="border p-2">{admin.name}</td>
                <td className="border p-2">{admin.email}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {admin.role}
                  </span>
                </td>
                <td className="border p-2">
                  <button 
                    onClick={() => handleDelete(admin.id, admin.role)}
                    disabled={isPending || admin.role === "Super Admin"}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-red-300 transition"
                    data-testid="btn-delete-admin"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
