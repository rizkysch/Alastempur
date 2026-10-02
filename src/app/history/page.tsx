import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data: userOrdersData } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Map to match the expected Order type in HistoryClient
  const userOrders = (userOrdersData || []).map(o => ({
    id: o.id,
    userId: o.user_id,
    shoeType: o.shoe_type,
    serviceType: o.service_type,
    pairs: o.pairs,
    notes: o.notes,
    price: o.price,
    status: o.status,
    createdAt: o.created_at
  }));

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Riwayat Transaksi</h1>
      <HistoryClient initialOrders={userOrders} />
    </div>
  );
}
