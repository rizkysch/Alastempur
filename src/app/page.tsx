import Link from "next/link";
import ImageSlider from "@/components/ImageSlider";
import GuestTracker from "@/components/GuestTracker";
import TestimonialSlider from "@/components/TestimonialSlider";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  return (
    <div className="bg-gray-50">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-slate-900" data-testid="hero-title">
            Rawat Sepatu <br /> Kesayanganmu.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto md:mx-0" data-testid="hero-subtitle">
            Layanan cuci sepatu premium yang cepat, aman, dan terpercaya. Jadikan sepatumu tampak seperti baru lagi dengan sentuhan profesional dari <strong>Alas Tempur</strong>.
          </p>
          
          {userId ? (
            <Link 
              href="/order" 
              className="inline-block bg-slate-900 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
              data-testid="hero-btn-order"
            >
              Mulai Cuci Sepatu
            </Link>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Link 
                  href="/register" 
                  className="bg-slate-900 text-white font-semibold px-8 py-4 rounded-full text-lg text-center hover:bg-slate-800 hover:shadow-lg transform transition-all duration-300"
                  data-testid="hero-btn-register"
                >
                  Daftar Sekarang
                </Link>
                <Link 
                  href="/login" 
                  className="bg-white text-slate-900 font-semibold border-2 border-slate-900 px-8 py-4 rounded-full text-lg text-center hover:bg-gray-100 transform transition-all duration-300"
                  data-testid="hero-btn-login"
                >
                  Masuk
                </Link>
              </div>
              
              {/* Guest Tracker (only show if not logged in) */}
              <div className="mt-4 flex justify-center md:justify-start">
                <GuestTracker />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 w-full flex justify-center relative">
          <ImageSlider />
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 w-full order-2 md:order-1">
             <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800" 
                  alt="Alat Cuci Sepatu" 
                  className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                />
             </div>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Tentang Alas Tempur</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Alas Tempur bermula dari kecintaan kami terhadap sneakers dan sepatu berkualitas. Kami menyadari bahwa merawat sepatu membutuhkan teknik, cairan khusus, dan ketelitian agar bahan tidak rusak.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Dengan tim profesional yang terlatih, kami berkomitmen untuk mengembalikan kilau setiap langkah Anda. Mulai dari <em>canvas, leather, hingga suede</em>, kami memperlakukan setiap sepatu layaknya milik kami sendiri.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-20 bg-gray-50 container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Katalog Layanan</h2>
          <p className="text-gray-600">Pilih perawatan terbaik yang sesuai dengan kondisi sepatu dan kebutuhan waktu Anda.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Deep Clean */}
          <div className="bg-white border rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
            <div className="bg-slate-900 text-white p-6 group-hover:bg-slate-800 transition-colors">
              <h3 className="text-2xl font-bold">Deep Clean</h3>
              <p className="text-sm opacity-80 mt-1">Perawatan menyeluruh luar & dalam</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b pb-2"><span className="text-gray-700">Sepatu Putih</span> <span className="font-bold text-slate-900">Rp 35.000</span></li>
                <li className="flex justify-between items-center border-b pb-2"><span className="text-gray-700">Sepatu Suede</span> <span className="font-bold text-slate-900">Rp 50.000</span></li>
                <li className="flex justify-between items-center border-b pb-2"><span className="text-gray-700">Sepatu Anak</span> <span className="font-bold text-slate-900">Rp 20.000</span></li>
                <li className="flex justify-between items-center border-b pb-2"><span className="text-gray-700">Flat Shoes</span> <span className="font-bold text-slate-900">Rp 20.000</span></li>
                <li className="flex justify-between items-center"><span className="text-gray-700">Sepatu Non Putih</span> <span className="font-bold text-slate-900">Rp 30.000</span></li>
              </ul>
            </div>
          </div>

          {/* Fast Clean */}
          <div className="bg-white border rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
            <div className="bg-slate-900 text-white p-6 group-hover:bg-slate-800 transition-colors">
              <h3 className="text-2xl font-bold">Fast Clean</h3>
              <p className="text-sm opacity-80 mt-1">Cepat dan bersih untuk bagian luar</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b pb-2"><span className="text-gray-700">Sepatu Putih</span> <span className="font-bold text-slate-900">Rp 25.000</span></li>
                <li className="flex justify-between items-center border-b pb-2"><span className="text-gray-700">Sepatu Suede</span> <span className="font-bold text-slate-900">Rp 30.000</span></li>
                <li className="flex justify-between items-center"><span className="text-gray-700">Sepatu Non Putih</span> <span className="font-bold text-slate-900">Rp 20.000</span></li>
              </ul>
            </div>
          </div>

          {/* Layanan Tambahan */}
          <div className="bg-slate-900 text-white border rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-bl-full pointer-events-none"></div>
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-2xl font-bold">Layanan Ekstra</h3>
              <p className="text-sm opacity-80 mt-1">Maksimalkan hasil cucian Anda</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex justify-between items-center"><span className="text-gray-300">Kilat Express</span> <span className="font-bold text-yellow-400">+Rp 15.000</span></li>
                <li className="flex justify-between items-center"><span className="text-gray-300">Unyellowing</span> <span className="font-bold text-yellow-400">+Rp 20.000</span></li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-slate-700">
                <h4 className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">Layanan Lainnya</h4>
                <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg">
                  <span className="font-semibold">Cuci Poles Helm</span> 
                  <span className="font-bold text-white">Rp 35.000</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Kata Mereka</h2>
            <p className="text-gray-600">Ratusan pasang sepatu telah kembali bersih bersama kami.</p>
          </div>
          
          <TestimonialSlider />
        </div>
      </section>

      {/* Contact & Complaint Section (Footer-like) */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Brand & Address */}
          <div>
            <h2 className="text-2xl font-bold mb-6 tracking-wide">Alas Tempur</h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Jl. Bersih Berkilau No. 123, <br/>
              Kecamatan Sukamaju, <br/>
              Kota Bandung, Jawa Barat 40123
            </p>
            <p className="text-gray-400">
              Buka setiap hari: 08.00 - 20.00 WIB
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-slate-700 pb-2 inline-block">Menu Cepat</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/order" className="text-gray-400 hover:text-white transition-colors">Buat Pesanan</Link></li>
              <li><Link href="/tracking" className="text-gray-400 hover:text-white transition-colors">Lacak Pesanan</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Daftar Member</Link></li>
            </ul>
          </div>

          {/* Contact & Complaint */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-slate-700 pb-2 inline-block">Kontak & Komplain</h3>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Punya keluhan mengenai hasil cucian atau ingin menanyakan status pesanan? Tim kami siap membantu Anda.
            </p>
            <div className="space-y-3">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="flex items-center text-gray-300 hover:text-green-400 transition-colors">
                <span className="font-bold mr-2">WhatsApp:</span> 0812-3456-7890
              </a>
              <a href="mailto:cs@alastempur.com" className="flex items-center text-gray-300 hover:text-blue-400 transition-colors">
                <span className="font-bold mr-2">Email:</span> cs@alastempur.com
              </a>
              <a href="https://instagram.com/alastempur" target="_blank" rel="noreferrer" className="flex items-center text-gray-300 hover:text-pink-400 transition-colors">
                <span className="font-bold mr-2">Instagram:</span> @alastempur
              </a>
            </div>
          </div>
          
        </div>
        
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Alas Tempur. Hak Cipta Dilindungi. Dibuat untuk Keperluan SQA Testing.
        </div>
      </footer>
      
    </div>
  );
}
