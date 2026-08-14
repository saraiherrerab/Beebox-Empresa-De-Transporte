"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Save, CheckCircle2, Plus, Trash2, Globe, Phone, Mail, MapPin, ShieldCheck, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "metrics" | "promos" | "how" | "about" | "coverage" | "footer">("hero");
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Form State for Hero
  const [heroSlide1Title, setHeroSlide1Title] = useState("RASTREA TUS SUEÑOS,");
  const [heroSlide1Highlight, setHeroSlide1Highlight] = useState("NOSOTROS LOS LLEVAMOS.");
  const [heroSlide1Desc, setHeroSlide1Desc] = useState("Tu casillero virtual en Miami, Madrid y Shenzhen con entregas rápidas y seguras.");
  const [heroSlide1BtnText, setHeroSlide1BtnText] = useState("ABRIR CASILLERO GRATIS");

  // Form State for Metrics
  const [metricAir, setMetricAir] = useState("+120,000");
  const [metricSea, setMetricSea] = useState("+85,000");
  const [metricAccuracy, setMetricAccuracy] = useState("99.4%");

  // Form State for About Us
  const [missionText, setMissionText] = useState("Proveer soluciones logísticas internacionales integrales con los más altos estándares de rapidez y seguridad.");
  const [visionText, setVisionText] = useState("Ser la empresa de transporte y casilleros virtuales líder en Latinoamérica, conectando comercios y personas.");

  // Form State for Footer
  const [contactPhone, setContactPhone] = useState("+56 2 2987 6543 / +52 55 9876 5432");
  const [contactEmail, setContactEmail] = useState("soporte@beebox.com / contacto@beebox.com");
  const [contactAddress, setContactAddress] = useState("Av. Providencia 1234, Santiago • CDMX Vallejo Hub");

  const handleSave = (sectionName: string) => {
    setSavedNotice(`¡Sección '${sectionName}' actualizada y publicada exitosamente en la Landing Page!`);
    setTimeout(() => setSavedNotice(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Administrador de Contenidos Landing (CMS)</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Gestión 100% personalizable de todas las secciones, banners, estadísticas, promociones y contactos del portal público.
          </p>
        </div>

        <Button
          onClick={() => handleSave("Global")}
          variant="amber"
          className="rounded-2xl px-6 py-3 font-bold text-xs uppercase shrink-0 shadow-md"
        >
          <Save className="w-4 h-4 mr-1.5" /> PUBLICAR TODO EN LANDING
        </Button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {savedNotice}
        </div>
      )}

      {/* Tabs Navigation (Matching All 7 Landing Sections) */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: "hero", label: "🎯 HERO CAROUSEL" },
          { id: "metrics", label: "📊 MÉTRICAS" },
          { id: "promos", label: "🏷️ PROMOCIONES" },
          { id: "how", label: "⚡ ¿CÓMO FUNCIONA?" },
          { id: "about", label: "🏢 QUIÉNES SOMOS" },
          { id: "coverage", label: "🌐 COBERTURA" },
          { id: "footer", label: "📞 FOOTER & CONTACTO" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-all shrink-0 ${
              activeTab === tab.id
                ? "border-amber-500 text-slate-950 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Hero Carousel */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-600" /> Diapositiva 1 (Slide Principal)
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              ● Activa en Producción
            </span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={heroSlide1Title}
                onChange={(e) => setHeroSlide1Title(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Frase Destacada (Color Amarillo Beebox)
              </label>
              <input
                type="text"
                value={heroSlide1Highlight}
                onChange={(e) => setHeroSlide1Highlight(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-bold text-amber-700 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Descripción Subtítulo
              </label>
              <textarea
                rows={3}
                value={heroSlide1Desc}
                onChange={(e) => setHeroSlide1Desc(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Texto del Botón Principal (CTA)
              </label>
              <input
                type="text"
                value={heroSlide1BtnText}
                onChange={(e) => setHeroSlide1BtnText(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <Button onClick={() => handleSave("Hero Carousel")} variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs uppercase">
                GUARDAR CAMBIOS EN HERO
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Métricas */}
      {activeTab === "metrics" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <h3 className="text-base font-black text-slate-900">Módulo de Métricas e Indicadores Clave</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Total Envíos Aéreos</label>
              <input
                type="text"
                value={metricAir}
                onChange={(e) => setMetricAir(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-200 p-3 text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Total Envíos Marítimos</label>
              <input
                type="text"
                value={metricSea}
                onChange={(e) => setMetricSea(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-200 p-3 text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">% Entregas a Tiempo</label>
              <input
                type="text"
                value={metricAccuracy}
                onChange={(e) => setMetricAccuracy(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-200 p-3 text-xs font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <Button onClick={() => handleSave("Métricas")} variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs uppercase">
            GUARDAR MÉTRICAS
          </Button>
        </div>
      )}

      {/* Tab 3: Promociones */}
      {activeTab === "promos" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Listado Dinámico de Promociones Activas</h3>
            <Button variant="outline" size="sm" className="rounded-xl border-amber-500 text-amber-700 text-xs font-bold">
              <Plus className="w-4 h-4 mr-1" /> AÑADIR PROMOCIÓN
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[10px] font-black text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded">BLACK FRIDAY</span>
              <h4 className="text-xs font-bold text-slate-900">30% OFF Flete Aéreo Miami</h4>
              <p className="text-[11px] text-slate-500">Válido para paquetes recibidos entre el 15 y 30 de Noviembre.</p>
              <Button size="sm" variant="outline" className="w-full text-xs font-bold rounded-xl border-slate-300">EDITAR TARJETA</Button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[10px] font-black text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded">NUEVO USUARIO</span>
              <h4 className="text-xs font-bold text-slate-900">Primer Envío Gratis</h4>
              <p className="text-[11px] text-slate-500">Hasta 2 KG sin costo de transporte al abrir tu casillero.</p>
              <Button size="sm" variant="outline" className="w-full text-xs font-bold rounded-xl border-slate-300">EDITAR TARJETA</Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Quiénes Somos */}
      {activeTab === "about" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200 max-w-3xl">
          <h3 className="text-base font-black text-slate-900">Sección Quiénes Somos (Misión y Visión)</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Misión Institucional
              </label>
              <textarea
                rows={3}
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Visión Institucional
              </label>
              <textarea
                rows={3}
                value={visionText}
                onChange={(e) => setVisionText(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <Button onClick={() => handleSave("Quiénes Somos")} variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs uppercase">
              GUARDAR MISIÓN Y VISIÓN
            </Button>
          </div>
        </div>
      )}

      {/* Tab 7: Footer & Contacto */}
      {activeTab === "footer" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200 max-w-3xl">
          <h3 className="text-base font-black text-slate-900">Información Institucional & Contacto (Footer)</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Teléfonos de Atención
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Correos Electrónicos
              </label>
              <input
                type="text"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Dirección Física Matriz
              </label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <Button onClick={() => handleSave("Footer y Contacto")} variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs uppercase">
              GUARDAR DATOS DE CONTACTO
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
