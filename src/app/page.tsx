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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-slate-950 scroll-smooth">
      <Navbar />

      <main className="flex-1">
        {/* Interactive Hero Carousel */}
        <HeroCarousel />

        {/* Key Metrics Intermediate Section */}
        <MetricsSection />

        {/* Servicios & ¿Cómo Funciona? */}
        <section id="servicios" className="scroll-mt-24">
          <HowItWorks />
        </section>

        {/* Módulo Calcula tu Envío (Calculadora) */}
        <section id="calculadora" className="py-16 bg-white border-y border-slate-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RateCalculator />
          </div>
        </section>

        {/* Promociones Activas */}
        <section id="promociones" className="scroll-mt-20">
          <PromosSection />
        </section>

        {/* Quiénes Somos (Misión y Visión) */}
        <section id="nosotros" className="scroll-mt-20">
          <AboutUs />
        </section>

        {/* Mapa de Cobertura Internacional */}
        <section id="cobertura" className="scroll-mt-20">
          <GlobalCoverage />
        </section>
      </main>

      <Footer />
    </div>
  );
}
