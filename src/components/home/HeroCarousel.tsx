"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Sparkles, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SlideData {
  id: number;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
  bgGradient: string;
}

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideData[] = [
    {
      id: 1,
      badge: "⚡ CASILLERO VIRTUAL EN MIAMI & MADRID",
      titleLine1: "RASTREA TUS SUEÑOS,",
      titleLine2: "NOSOTROS LOS LLEVAMOS.",
      description:
        "Tu casillero virtual en Miami, Madrid y Shenzhen con entregas rápidas, tarifas transparentes y soporte personalizado.",
      primaryBtnText: "ABRIR CASILLERO GRATIS",
      primaryBtnHref: "/registro",
      secondaryBtnText: "CALCULAR TARIFA",
      secondaryBtnHref: "#calculadora",
      bgGradient: "from-slate-950 via-slate-900 to-slate-950",
    },
    {
      id: 2,
      badge: "🚢 LOGÍSTICA MARÍTIMA Y AÉREA INTEGRAL",
      titleLine1: "IMPORTACIONES DIRECTAS",
      titleLine2: "CON TARIFAS DESDE $6/KG.",
      description:
        "Consolida tus compras de Amazon, eBay y proveedores de China. Nosotros nos encargamos de todo el despacho aduanero.",
      primaryBtnText: "SOLICITAR PICKUP",
      primaryBtnHref: "/dashboard/pickup",
      secondaryBtnText: "VER COBERTURA",
      secondaryBtnHref: "#cobertura",
      bgGradient: "from-slate-950 via-slate-900 to-slate-950",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
        <div className="max-w-3xl space-y-6 sm:space-y-8 animate-in fade-in duration-500">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-widest border border-amber-500/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {slide.badge}
          </span>

          {/* Main Titles (Fluid Responsive Sizing) */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              {slide.titleLine1}
            </h1>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-amber-400">
              {slide.titleLine2}
            </h1>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
            {slide.description}
          </p>

          {/* Responsive CTA Buttons (Stack on Mobile, Row on Desktop) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href={slide.primaryBtnHref} className="w-full sm:w-auto">
              <Button
                variant="amber"
                size="lg"
                className="w-full sm:w-auto rounded-2xl px-8 py-4 font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-amber-500/20"
              >
                {slide.primaryBtnText} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href={slide.secondaryBtnHref} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase border border-slate-700 transition-colors">
                {slide.secondaryBtnText}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel Arrow Navigation */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 shadow-md backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 shadow-md backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Carousel Slide Indicators */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === idx ? "w-8 bg-amber-400" : "w-2 bg-slate-700"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
