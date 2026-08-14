"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Package, ArrowRight, ShieldCheck, Plane, Ship } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: "LOGÍSTICA INTERNACIONAL & CASILLERO VIRTUAL",
      title: "RASTREA TUS SUEÑOS,",
      highlight: "NOSOTROS LOS LLEVAMOS.",
      desc: "Tu casillero virtual en Miami, Madrid y Shenzhen con entregas rápidas y seguras en todo el país.",
      ctaPrimary: "ABRIR CASILLERO GRATIS",
      ctaPrimaryHref: "/registro",
      ctaSecondary: "SOLICITAR PICKUP",
      ctaSecondaryHref: "/dashboard/pickup",
      bgGradient: "from-slate-950 via-slate-900 to-amber-950",
      icon: Plane,
    },
    {
      badge: "CARGA MARÍTIMA Y AÉREA EMPRESARIAL",
      title: "TRANSPORTE DE CARGA",
      highlight: "SIN FRONTERAS NI DEMORAS.",
      desc: "Soluciones de consolidación y flete internacional parametrizadas a la medida de tu negocio.",
      ctaPrimary: "COTIZAR MI ENVÍO",
      ctaPrimaryHref: "/#cotizador",
      ctaSecondary: "PORTAL CLIENTES",
      ctaSecondaryHref: "/dashboard",
      bgGradient: "from-slate-900 via-amber-950 to-slate-950",
      icon: Ship,
    },
    {
      badge: "RECOLECCIONES A DOMICILIO",
      title: "PICKUP INTERNACIONAL",
      highlight: "DESDE TU PUERTA.",
      desc: "Programamos la recolección de tus paquetes en cualquier dirección con monitoreo GPS en tiempo real.",
      ctaPrimary: "PROGRAMAR PICKUP",
      ctaPrimaryHref: "/dashboard/pickup",
      ctaSecondary: "VER COBERTURA",
      ctaSecondaryHref: "/#cobertura",
      bgGradient: "from-slate-950 via-slate-900 to-slate-950",
      icon: Package,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[540px] sm:min-h-[600px] flex items-center justify-center">
      {/* Background Gradient & Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {slides.map((slide, idx) => {
        const Icon = slide.icon;
        const isActive = currentSlide === idx;

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${slide.bgGradient} opacity-95 flex items-center`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-6">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-black tracking-widest uppercase">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      {slide.badge}
                    </span>

                    <div className="space-y-2">
                      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                        {slide.title} <br />
                        <span className="text-amber-400">{slide.highlight}</span>
                      </h1>
                      <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-medium leading-relaxed">
                        {slide.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link href={slide.ctaPrimaryHref}>
                        <Button variant="amber" className="rounded-full px-8 py-4 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20">
                          {slide.ctaPrimary} <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                      <Link href={slide.ctaSecondaryHref}>
                        <Button variant="outline" className="rounded-full px-7 py-4 text-xs font-bold text-white border-white/20 hover:bg-white/10 uppercase tracking-wider">
                          {slide.ctaSecondary}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="hidden lg:flex lg:col-span-4 justify-center">
                    <div className="w-48 h-48 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-2xl backdrop-blur-md">
                      <Icon className="w-24 h-24 text-amber-400 stroke-[1.5]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? "w-8 bg-amber-400" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
