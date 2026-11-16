"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/config/api";

interface SlideData {
  id: string;
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

const DEFAULT_SLIDES: SlideData[] = [
  {
    id: "default-1",
    badge: "⚡ CASILLERO VIRTUAL EN OKLAHOMA & MIAMI",
    titleLine1: "RASTREA TUS SUEÑOS,",
    titleLine2: "NOSOTROS LOS LLEVAMOS.",
    description:
      "Tu casillero internacional con entregas rápidas, tarifas transparentes y soporte personalizado en cada envío.",
    primaryBtnText: "ABRIR CASILLERO GRATIS",
    primaryBtnHref: "/registro",
    secondaryBtnText: "CALCULAR TARIFA",
    secondaryBtnHref: "#calculadora",
    bgGradient: "from-slate-950 via-slate-900 to-slate-950",
  },
  {
    id: "default-2",
    badge: "🚢 LOGÍSTICA MARÍTIMA Y AÉREA INTEGRAL",
    titleLine1: "IMPORTACIONES DIRECTAS",
    titleLine2: "CON TARIFAS PREFERENCIALES.",
    description:
      "Consolida tus compras de Amazon, eBay y Walmart. Nosotros nos encargamos de todo el despacho aduanero.",
    primaryBtnText: "ABRIR CASILLERO GRATIS",
    primaryBtnHref: "/registro",
    secondaryBtnText: "VER COBERTURA",
    secondaryBtnHref: "#cobertura",
    bgGradient: "from-slate-950 via-slate-900 to-slate-950",
  },
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>(DEFAULT_SLIDES);

  useEffect(() => {
    fetch(`${API_URL}/cms`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          const heroItems = data.items.filter(
            (item: any) =>
              item.active !== false &&
              (item.type?.toLowerCase() === "hero_banner" || item.type?.toLowerCase() === "hero")
          );
          if (heroItems.length > 0) {
            const dynamicSlides: SlideData[] = heroItems.map((item: any) => ({
              id: item.id,
              badge: "✨ DESTACADO BEEBOX",
              titleLine1: item.title.toUpperCase(),
              titleLine2: "LOGÍSTICA INTERNACIONAL 24/7",
              description: item.description,
              primaryBtnText: "ABRIR CASILLERO GRATIS",
              primaryBtnHref: item.linkUrl || "/registro",
              secondaryBtnText: "CALCULAR TARIFA",
              secondaryBtnHref: "#calculadora",
              bgGradient: "from-slate-950 via-slate-900 to-slate-950",
            }));
            setSlides([...dynamicSlides, ...DEFAULT_SLIDES]);
            setCurrentSlide(0);
          }
        }
      })
      .catch(() => {});
  }, []);

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

  const slide = slides[currentSlide] || slides[0];

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
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-amber-400">
              {slide.titleLine2}
            </h2>
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
          aria-label="Diapositiva anterior"
          className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 shadow-md backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Siguiente diapositiva"
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
            aria-label={`Ir a diapositiva ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${
              currentSlide === idx ? "w-8 bg-amber-400" : "w-2 bg-slate-700"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
