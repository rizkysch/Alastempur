"use client";

import { useState, useEffect } from "react";

const IMAGES = [
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=800",
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl group">
      {IMAGES.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        />
      ))}
      
      {/* Slider Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-slate-900" : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
