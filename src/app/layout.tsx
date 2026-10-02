import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { logout } from "./actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alas Tempur",
  description: "Jasa cuci sepatu berbasis web",
};

import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50 min-h-screen text-gray-900`}>
        <nav className="bg-navy-900 text-white p-4 shadow-md bg-slate-900" data-testid="navbar">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold" data-testid="nav-brand">Alas Tempur</Link>
            <div className="space-x-4 flex items-center">
              {userId ? (
                <>
                  <Link href="/order" className="hover:text-gray-300" data-testid="nav-order">Buat Pesanan</Link>
                  <Link href="/tracking" className="hover:text-gray-300" data-testid="nav-tracking">Lacak Pesanan</Link>
                  <Link href="/history" className="hover:text-gray-300" data-testid="nav-history">Riwayat</Link>
                  <Link href="/profile" className="hover:text-gray-300" data-testid="nav-profile">Profil</Link>
                  <form action={logout}>
                    <button type="submit" className="hover:text-gray-300" data-testid="btn-logout">Logout</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-gray-300" data-testid="nav-login">Login</Link>
                  <Link href="/register" className="hover:text-gray-300" data-testid="nav-register">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
