import { createClient } from "@/utils/supabase/server";
import ServiceClient from "./ServiceClient";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data: servicesData } = await supabase.from("services").select("*").order("created_at", { ascending: true });
  
  const mappedServices = (servicesData || []).map(s => ({
    id: s.id,
    name: s.name,
    price: s.price,
    durationDays: s.duration_days,
    isActive: s.is_active
  }));
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Manajemen Layanan</h1>
      <ServiceClient initialServices={mappedServices} />
    </div>
  );
}
