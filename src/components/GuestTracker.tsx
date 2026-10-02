"use client";

import { useActionState } from "react";
import { trackGuestOrder } from "@/app/actions";

export default function GuestTracker() {
  const [state, formAction] = useActionState(trackGuestOrder, undefined);

  return (
    <div className="w-full max-w-md mx-auto md:mx-0 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 relative z-10 mt-8 md:mt-0">
      <h3 className="text-xl font-bold mb-4 text-slate-900 text-center">Cek Status Pesanan</h3>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Masukkan ID Pesanan Anda (contoh: ORD-123456)
      </p>
      
      <form action={formAction} className="space-y-3">
        <div className="flex gap-2">
          <input 
            type="text" 
            name="orderId" 
            placeholder="ORD-XXXXXX"
            required
            className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" 
            data-testid="input-guest-track"
          />
          <button 
            type="submit" 
            className="bg-slate-900 text-white px-6 rounded-lg font-semibold hover:bg-slate-800 transition"
            data-testid="btn-guest-track"
          >
            Lacak
          </button>
        </div>
      </form>

      {state?.error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
          {state.error}
        </div>
      )}

      {state?.order && (
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg" data-testid="guest-track-result">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-900">{state.order.id}</span>
            <span className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded">
              {state.order.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{state.order.serviceType}</p>
          <p className="text-sm font-semibold text-slate-800">Rp {state.order.price.toLocaleString("id-ID")}</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" 
              style={{ 
                width: state.order.status === 'Pending' ? '25%' : 
                        state.order.status === 'Processing' ? '50%' : 
                        state.order.status === 'Ready to Pickup' ? '75%' : '100%' 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
