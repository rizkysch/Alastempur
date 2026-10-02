"use client";

import { useActionState, useState } from "react";
import { createOrder } from "@/app/actions";
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

const SERVICES = {
// ... same as before
  "Deep Clean": {
    "Sepatu Putih": 35000,
    "Sepatu Suede": 50000,
    "Sepatu Anak": 20000,
    "Flat Shoes": 20000,
    "Sepatu Non Putih": 30000,
  },
  "Fast Clean": {
    "Sepatu Putih": 25000,
    "Sepatu Suede": 30000,
    "Sepatu Non Putih": 20000,
  },
  "Lainnya": {
    "Cuci Poles Helm": 35000,
  }
};

export default function OrderPage() {
  const [state, formAction] = useActionState(createOrder, undefined);
  const [pairs, setPairs] = useState<number>(1);
  const [category, setCategory] = useState<keyof typeof SERVICES>("Deep Clean");
  
  const availableItems = Object.keys(SERVICES[category]);
  const [itemType, setItemType] = useState<string>(availableItems[0]);

  const [isExpress, setIsExpress] = useState(false);
  const [isUnyellowing, setIsUnyellowing] = useState(false);
  const [address, setAddress] = useState("");
  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);

  const [clientError, setClientError] = useState("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value as keyof typeof SERVICES;
    setCategory(newCat);
    setItemType(Object.keys(SERVICES[newCat])[0]);
  };

  const basePrice = SERVICES[category][itemType as keyof typeof SERVICES[typeof category]] || 0;
  const addonExpress = isExpress ? 15000 : 0;
  const addonUnyellowing = isUnyellowing ? 20000 : 0;
  const pricePerItem = basePrice + addonExpress + addonUnyellowing;
  const totalPrice = pairs * pricePerItem;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (pairs < 1 || pairs > 10) {
      e.preventDefault();
      setClientError("Jumlah barang harus antara 1 dan 10");
    } else if (!latLng) {
      e.preventDefault();
      setClientError("Silakan pilih titik lokasi penjemputan pada peta");
    } else if (!address.trim()) {
      e.preventDefault();
      setClientError("Alamat spesifik tidak boleh kosong");
    } else {
      setClientError("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md mb-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Buat Pesanan</h1>
      <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
        
        <input type="hidden" name="totalPrice" value={totalPrice} />
        <input type="hidden" name="latitude" value={latLng?.lat || ""} />
        <input type="hidden" name="longitude" value={latLng?.lng || ""} />
        
        {/* Detail Layanan */}
        <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
          <h2 className="font-semibold text-lg border-b pb-2">Detail Layanan</h2>
          <div>
            <label className="block mb-1">Kategori Layanan</label>
            <select 
              name="category" 
              className="w-full border p-2 rounded" 
              data-testid="select-category"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="Deep Clean">Deep Clean</option>
              <option value="Fast Clean">Fast Clean</option>
              <option value="Lainnya">Lainnya (Helm)</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Pilihan Item</label>
            <select 
              name="itemType" 
              className="w-full border p-2 rounded" 
              data-testid="select-item-type"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
            >
              {availableItems.map((item) => (
                <option key={item} value={item}>
                  {item} (Rp {SERVICES[category][item as keyof typeof SERVICES[typeof category]].toLocaleString("id-ID")})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Layanan Tambahan</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="isExpress" 
                  value="yes"
                  checked={isExpress} 
                  onChange={(e) => setIsExpress(e.target.checked)} 
                  data-testid="checkbox-express"
                />
                <span>Kilat Express (+Rp 15.000/item)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="isUnyellowing" 
                  value="yes"
                  checked={isUnyellowing} 
                  onChange={(e) => setIsUnyellowing(e.target.checked)} 
                  data-testid="checkbox-unyellowing"
                  disabled={category === "Lainnya"} 
                />
                <span className={category === "Lainnya" ? "text-gray-400" : ""}>
                  Unyellowing (+Rp 20.000/item)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-1">Jumlah (Pasang/Pcs)</label>
            <input 
              type="number" 
              name="pairs" 
              min="1" 
              max="10" 
              required 
              className="w-full border p-2 rounded" 
              data-testid="input-pairs" 
              value={pairs}
              onChange={(e) => setPairs(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Lokasi */}
        <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
          <h2 className="font-semibold text-lg border-b pb-2">Informasi Penjemputan</h2>
          
          <LocationPicker onLocationSelect={(lat, lng) => setLatLng({lat, lng})} />
          
          <div>
            <label className="block mb-1 font-medium">Alamat Lengkap / Spesifik</label>
            <textarea 
              name="address" 
              className="w-full border p-2 rounded" 
              rows={3} 
              placeholder="Cth: Jl. Merdeka No.1, RT 01/02, Rumah pagar hitam"
              data-testid="textarea-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium">Catatan Tambahan (Opsional)</label>
            <textarea name="notes" className="w-full border p-2 rounded" rows={2} data-testid="textarea-notes"></textarea>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded mt-4 text-center border">
          <h2 className="text-lg font-semibold mb-1 text-gray-600">Total Estimasi Harga</h2>
          <p className="text-3xl font-bold text-slate-900" data-testid="price-estimator">
            Rp {totalPrice.toLocaleString("id-ID")}
          </p>
        </div>

        {(clientError || state?.error) && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded" data-testid="error-message">
            {clientError || state?.error}
          </p>
        )}
        
        <button type="submit" className="w-full bg-slate-900 text-white p-4 text-lg font-bold rounded-lg hover:bg-slate-800 transition" data-testid="btn-submit-order">
          Konfirmasi Pesanan
        </button>
      </form>
    </div>
  );
}
