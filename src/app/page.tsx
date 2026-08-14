import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { MetricsSection } from "@/components/home/MetricsSection";
import { PromosSection } from "@/components/home/PromosSection";
import { RateCalculator } from "@/components/home/RateCalculator";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AboutUs } from "@/components/home/AboutUs";
import { GlobalCoverage } from "@/components/home/GlobalCoverage";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Interactive Hero Carousel */}
        <HeroCarousel />

        {/* Key Metrics Intermediate Section (Replaces top newsletter) */}
        <MetricsSection />

        {/* Promociones Activas */}
        <section id="promociones">
          <PromosSection />
        </section>

        {/* Módulo Calcula tu Envío */}
        <section id="cotizador" className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RateCalculator />
          </div>
        </section>

        {/* ¿Cómo Funciona? */}
        <section id="como-funciona">
          <HowItWorks />
        </section>

        {/* Quiénes Somos (Misión y Visión) */}
        <section id="nosotros">
          <AboutUs />
        </section>

        {/* Mapa de Cobertura Internacional */}
        <section id="cobertura">
          <GlobalCoverage />
        </section>
      </main>

      <Footer />
    </div>
  );
}
