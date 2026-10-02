import { createClient } from "@/utils/supabase/server";
import PromosClient from "./PromosClient";

export default async function AdminPromosPage() {
  const supabase = await createClient();
  const { data: promosData } = await supabase.from("promos").select("*").order("created_at", { ascending: false });

  const mappedPromos = (promosData || []).map(p => ({
    id: p.id,
    code: p.code,
    type: p.type,
    value: p.value,
    expiryDate: p.expiry_date
  }));
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Manajemen Promo & Voucher</h1>
      <PromosClient initialPromos={mappedPromos} />
    </div>
  );
}
