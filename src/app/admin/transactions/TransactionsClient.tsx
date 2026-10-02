"use client";

import { useState } from "react";
import { Order } from "@/lib/db";

type EnrichedOrder = Order & { customerName: string; adminName: string };

export default function TransactionsClient({ initialOrders }: { initialOrders: EnrichedOrder[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredOrders = initialOrders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Cari berdasarkan Order ID atau Nama Pelanggan..." 
          className="w-full md:w-1/2 border p-2 rounded focus:ring-2 focus:ring-slate-900"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          data-testid="input-search-transaction"
        />
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-left border-collapse" data-testid="global-transactions-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Pelanggan</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Total Harga</th>
              <th className="border p-2">Admin Pemroses</th>
              <th className="border p-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? paginatedOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border p-2 font-mono text-sm">{order.id}</td>
                <td className="border p-2">{order.customerName}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border p-2">Rp {order.price.toLocaleString("id-ID")}</td>
                <td className="border p-2">{order.adminName}</td>
                <td className="border p-2 text-sm">{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="border p-4 text-center text-gray-500">Tidak ada transaksi ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">Halaman {currentPage} dari {totalPages}</p>
          <div className="space-x-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
              data-testid="btn-prev-page"
            >
              Sebelumnya
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
              data-testid="btn-next-page"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
