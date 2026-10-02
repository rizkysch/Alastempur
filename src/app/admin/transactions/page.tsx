import { createClient } from "@/utils/supabase/server";
import TransactionsClient from "./TransactionsClient";

export default async function AdminTransactionsPage() {
  const supabase = await createClient();
  
  const { data: ordersData } = await supabase
    .from("orders")
    .select(`
      *,
      profiles!orders_user_id_fkey (name),
      handled_by_profile:profiles!orders_handled_by_fkey (name)
    `)
    .order("created_at", { ascending: false });

  const enrichedOrders = (ordersData || []).map((o: any) => ({
    id: o.id,
    userId: o.user_id,
    shoeType: o.shoe_type,
    serviceType: o.service_type,
    pairs: o.pairs,
    notes: o.notes,
    price: o.price,
    status: o.status,
    createdAt: o.created_at,
    handledBy: o.handled_by,
    customerName: o.profiles?.name || "Unknown",
    adminName: o.handled_by_profile?.name || "-"
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Riwayat Transaksi Global</h1>
      <TransactionsClient initialOrders={enrichedOrders} />
    </div>
  );
}
