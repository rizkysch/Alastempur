"use client";

import { useState } from "react";
import { Order } from "@/lib/db";

export default function HistoryClient({ initialOrders }: { initialOrders: Order[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredOrders = initialOrders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Cari ID Pesanan..." 
          className="border p-2 rounded flex-grow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-history"
        />
        <select 
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="select-filter-status"
        >
          <option value="">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Ready to Pickup">Ready to Pickup</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500" data-testid="no-history-data">Tidak ada riwayat transaksi yang sesuai.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" data-testid="history-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID Pesanan</th>
                <th className="border p-2">Layanan</th>
                <th className="border p-2">Total Harga</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50" data-testid={`history-row-${order.id}`}>
                  <td className="border p-2" data-testid="col-order-id">{order.id}</td>
                  <td className="border p-2" data-testid="col-service">{order.serviceType} ({order.pairs} psg)</td>
                  <td className="border p-2" data-testid="col-price">Rp {order.price.toLocaleString("id-ID")}</td>
                  <td className="border p-2" data-testid="col-status">
                    <span className="bg-gray-200 px-2 py-1 rounded text-sm">{order.status}</span>
                  </td>
                  <td className="border p-2" data-testid="col-date">{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
