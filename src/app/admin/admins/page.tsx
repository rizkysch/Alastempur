import { createClient } from "@/utils/supabase/server";
import AdminClient from "./AdminClient";

export default async function AdminsPage() {
  const supabase = await createClient();
  const { data: admins } = await supabase
    .from("profiles")
    .select("id, name, role")
    .in("role", ["Admin", "Super Admin"]);
  
  // Note: Emails aren't exposed in profiles table by default for security, 
  // but for the sake of the client component rendering we will just pass a placeholder or we can map it if we really need to.
  // Actually, we can just pass them as they are. The client expects `email` and `password`, which we don't have.
  const mappedAdmins = (admins || []).map(a => ({
    id: a.id,
    name: a.name,
    email: "Email Hidden (Supabase Auth)", 
    role: a.role as "Admin" | "Super Admin"
  }));
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Manajemen Akun Admin</h1>
      <AdminClient initialAdmins={mappedAdmins} />
    </div>
  );
}
