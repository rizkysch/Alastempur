import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { adminLogout } from "@/app/admin-actions";

import { createClient } from "@/utils/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/admin-login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "Admin" && profile.role !== "Super Admin")) {
    redirect("/admin-login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-slate-700">
          Super Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Dashboard</Link>
          <Link href="/admin/admins" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Manajemen Admin</Link>
          <Link href="/admin/transactions" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Riwayat Transaksi</Link>
          <Link href="/admin/services" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Manajemen Layanan</Link>
          <Link href="/admin/cms" className="block px-4 py-2 rounded hover:bg-slate-800 transition">CMS & Konten</Link>
          <Link href="/admin/promos" className="block px-4 py-2 rounded hover:bg-slate-800 transition">Promo & Voucher</Link>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <form action={adminLogout}>
            <button type="submit" className="w-full bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition">Logout</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
