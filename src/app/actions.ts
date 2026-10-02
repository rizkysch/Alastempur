"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email.includes("@")) return { error: "Format email tidak valid" };
  if (password.length < 8) return { error: "Password minimal 8 karakter" };
  if (password !== confirmPassword) return { error: "Password tidak cocok" };

  const supabase = await createClient();

  // 1. Sign up user (Trigger will handle profile creation)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone,
      },
      emailRedirectTo: "http://localhost:3000/auth/callback"
    }
  });

  if (authError) {
    return { error: authError.message };
  }

  // Jika email confirmation aktif, user mungkin perlu cek email
  if (!authData.session) {
    return { success: "Pendaftaran berhasil! Supabase membutuhkan aktivasi. Silakan cek kotak masuk Email/Gmail Anda dan klik tautan verifikasi sebelum melakukan login." };
  }

  redirect("/login");
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau password salah" };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  if (!email.includes("@")) return { error: "Format email tidak valid" };
  
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/reset-password",
  });

  if (error) {
    return { error: error.message };
  }
  
  return { 
    success: "Tautan reset password telah dikirim ke email Anda. Cek kotak masuk Anda."
  };
}

export async function resetPassword(prevState: any, formData: FormData) {
  // In a real app with Supabase, the user arrives at the reset link,
  // which sets their session securely, allowing them to update their password.
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password.length < 8) return { error: "Password minimal 8 karakter" };
  if (password !== confirmPassword) return { error: "Password tidak cocok" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  
  if (error) {
    return { error: error.message };
  }

  redirect("/login");
}

const SERVICES = {
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

export async function createOrder(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Anda belum login" };

  const category = formData.get("category") as keyof typeof SERVICES;
  const itemType = formData.get("itemType") as string;
  const pairs = parseInt(formData.get("pairs") as string);
  const notes = formData.get("notes") as string;
  const isExpress = formData.get("isExpress") === "yes";
  const isUnyellowing = formData.get("isUnyellowing") === "yes";
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);
  const address = formData.get("address") as string;

  if (isNaN(pairs) || pairs < 1 || pairs > 10) {
    return { error: "Jumlah barang harus antara 1 dan 10" };
  }
  if (!category || !itemType) {
    return { error: "Kategori dan pilihan item harus diisi" };
  }

  // Calculate Price Server Side
  const basePrice = (SERVICES[category] as any)?.[itemType] || 0;
  const addonExpress = isExpress ? 15000 : 0;
  const addonUnyellowing = isUnyellowing ? 20000 : 0;
  const price = (basePrice + addonExpress + addonUnyellowing) * pairs;
  
  // Format the service name for display
  const addons = [isExpress && "Express", isUnyellowing && "Unyellowing"].filter(Boolean).join(", ");
  const formattedServiceType = `${category} - ${itemType}${addons ? ` (+${addons})` : ""}`;

  const { error } = await supabase.from("orders").insert({
    user_id: user.id,
    shoe_type: itemType,
    service_type: formattedServiceType,
    pairs,
    notes,
    price,
    status: "Pending",
    latitude: isNaN(latitude) ? null : latitude,
    longitude: isNaN(longitude) ? null : longitude,
    pickup_address: address
  });

  if (error) {
    return { error: "Gagal membuat pesanan: " + error.message };
  }
  
  redirect("/tracking");
}

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Anda belum login" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  if (!name || !phone) return { error: "Nama dan Nomor HP tidak boleh kosong" };

  const { error } = await supabase
    .from("profiles")
    .update({ name, phone, address })
    .eq("id", user.id);

  if (error) return { error: error.message };

  return { success: "Profil berhasil diperbarui" };
}

export async function trackGuestOrder(prevState: any, formData: FormData) {
  const orderId = formData.get("orderId") as string;
  if (!orderId) return { error: "ID Pesanan tidak boleh kosong" };

  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, service_type, status, price, created_at")
    .eq("id", orderId.trim())
    .single();

  if (error || !order) return { error: "Pesanan tidak ditemukan. Pastikan ID pesanan (UUID) sudah benar." };

  return { 
    order: {
      id: order.id,
      serviceType: order.service_type,
      status: order.status,
      price: order.price,
      createdAt: order.created_at
    } 
  };
}
