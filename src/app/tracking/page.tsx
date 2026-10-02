import { readDb } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TrackingPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) {
    redirect("/login");
  }

  const db = readDb();
  // Active orders: Pending, Processing, Ready to Pickup
  const activeOrders = db.orders.filter(
    (o) => o.userId === userId && o.status !== "Completed"
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Lacak Pesanan</h1>
      {activeOrders.length === 0 ? (
        <p className="text-center text-gray-500" data-testid="no-active-orders">Tidak ada pesanan aktif.</p>
      ) : (
        <div className="space-y-6">
          {activeOrders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm" data-testid={`order-card-${order.id}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg" data-testid="order-id">Pesanan #{order.id}</h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded" data-testid="order-status">
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Layanan:</span> {order.serviceType}</p>
                <p><span className="font-medium">Sepatu:</span> {order.shoeType} ({order.pairs} pasang)</p>
                <p><span className="font-medium">Total Harga:</span> Rp {order.price.toLocaleString("id-ID")}</p>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-slate-800 h-2.5 rounded-full" 
                  style={{ 
                    width: order.status === 'Pending' ? '25%' : 
                           order.status === 'Processing' ? '50%' : 
                           order.status === 'Ready to Pickup' ? '75%' : '100%' 
                  }}
                  data-testid="status-progress-bar"
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
