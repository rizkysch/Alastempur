"use client";

import { useState, useEffect } from "react";

const TESTIMONIALS = [
  {
    initial: "A",
    name: "Andi Saputra",
    stars: "★★★★★",
    text: "Sepatu putih saya yang menguning kembali seperti baru lagi setelah ambil paket Deep Clean + Unyellowing! Prosesnya cepat dan memuaskan."
  },
  {
    initial: "B",
    name: "Budi Santoso",
    stars: "★★★★★",
    text: "Layanan Express-nya benar-benar cepat. Pesan pagi, sore udah siap pakai lagi. Cocok buat yang butuh sepatu bersih mendadak."
  },
  {
    initial: "C",
    name: "Citra Kirana",
    stars: "★★★★☆",
    text: "Selain sepatu, saya coba cuci poles helm. Hasilnya kinclong dan wangi banget. Harga sangat terjangkau dibanding tempat lain."
  },
  {
    initial: "D",
    name: "Dina Mariana",
    stars: "★★★★★",
    text: "Noda lumpur di sepatu suede saya hilang tanpa merusak bulu suedenya. Benar-benar profesional dan paham cara handling sepatu."
  },
  {
    initial: "E",
    name: "Eko Pratama",
    stars: "★★★★★",
    text: "Fitur lacak pesanannya sangat membantu. Saya jadi tau kapan sepatu saya sedang dicuci dan kapan siap diambil."
  }
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        setIsFading(false);
      }, 500); // fade out duration
    }, 5000); // display duration
    return () => clearInterval(timer);
  }, []);

  const testi = TESTIMONIALS[currentIndex];

  return (
    <div className="relative w-full max-w-2xl mx-auto py-8">
      <div 
        className={`bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm transition-opacity duration-500 min-h-[250px] flex flex-col justify-center ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center mb-6 justify-center md:justify-start">
          <div className="h-14 w-14 bg-slate-900 text-white flex items-center justify-center rounded-full text-2xl font-bold shadow-md">
            {testi.initial}
          </div>
          <div className="ml-4 text-left">
            <p className="font-bold text-slate-900 text-lg">{testi.name}</p>
            <p className="text-yellow-500 text-sm tracking-widest">{testi.stars}</p>
          </div>
        </div>
        <p className="text-gray-600 italic leading-relaxed text-lg md:text-xl text-center md:text-left">
          "{testi.text}"
        </p>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-8 space-x-3">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsFading(true);
              setTimeout(() => {
                setCurrentIndex(i);
                setIsFading(false);
              }, 500);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-slate-900 w-8" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
