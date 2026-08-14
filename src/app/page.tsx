import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { PromosSection } from "@/components/home/PromosSection";
import { RateCalculator } from "@/components/home/RateCalculator";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AboutUs } from "@/components/home/AboutUs";
import { GlobalCoverage } from "@/components/home/GlobalCoverage";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Exclusive Offer Newsletter Banner (Matching Image 1) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
          <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 p-8 sm:p-12 text-slate-950 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl space-y-3 relative z-10">
              <span className="text-xs font-black uppercase tracking-widest bg-slate-950/10 px-3 py-1 rounded-full text-slate-950 inline-block">
                OFERTAS EXCLUSIVAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase leading-tight">
                ¡RECIBE OFERTAS EXCLUSIVAS!
              </h2>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                Suscríbete a nuestro boletín para obtener un 15% de descuento en tu primer envío y enterarte de nuestras ofertas antes que nadie.
              </p>

              <form className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    className="w-full rounded-xl bg-white/90 px-4 py-3 pl-10 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>
                <Button variant="amber" className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-6">
                  SUSCRIBIRSE
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Promociones Activas */}
        <PromosSection />

        {/* Calcula tu envío */}
        <RateCalculator />

        {/* ¿Cómo funciona? */}
        <HowItWorks />

        {/* Quiénes somos */}
        <AboutUs />

        {/* Cobertura Mundial */}
        <GlobalCoverage />
      </main>

      <Footer />
    </div>
  );
}
