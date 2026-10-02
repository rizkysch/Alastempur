import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase.from("orders").select("status, price");
  const ordersList = orders || [];
  
  const totalRevenue = ordersList.filter(o => o.status === "Completed").reduce((sum, o) => sum + o.price, 0);
  const pendingOrders = ordersList.filter(o => o.status === "Pending").length;
  const processingOrders = ordersList.filter(o => o.status === "Processing").length;
  const completedOrders = ordersList.filter(o => o.status === "Completed").length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Dashboard Keuangan & Analitik</h1>
      
      {/* Date Filter Form (Static for simulation) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex gap-4 items-end">
        <div>
          <label className="block text-sm mb-1 font-medium">Tanggal Mulai</label>
          <input type="date" className="border p-2 rounded" data-testid="filter-start-date" />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Tanggal Akhir</label>
          <input type="date" className="border p-2 rounded" data-testid="filter-end-date" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" data-testid="btn-filter-date">
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-semibold">Total Pendapatan</p>
          <p className="text-2xl font-bold text-slate-900 mt-2" data-testid="metric-revenue">Rp {totalRevenue.toLocaleString("id-ID")}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm font-semibold">Pesanan Masuk (Pending)</p>
          <p className="text-2xl font-bold text-slate-900 mt-2" data-testid="metric-pending">{pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-semibold">Pesanan Diproses</p>
          <p className="text-2xl font-bold text-slate-900 mt-2" data-testid="metric-processing">{processingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-gray-800">
          <p className="text-gray-500 text-sm font-semibold">Pesanan Selesai</p>
          <p className="text-2xl font-bold text-slate-900 mt-2" data-testid="metric-completed">{completedOrders}</p>
        </div>
      </div>
    </div>
  );
}
