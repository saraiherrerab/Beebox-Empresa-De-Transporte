"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Globe,
  Eye,
  ArrowLeft,
  ArrowRight,
  Copy,
  Sparkles,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SlideItem {
  id: string;
  tabLabel: string;
  badge: string;
  title1: string;
  titleHighlight: string;
  description: string;
  primaryBtnText: string;
  primaryBtnUrl: string;
  secondaryBtnText: string;
  secondaryBtnUrl: string;
  bgGradient: string;
  status: "published" | "draft";
}

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "metrics" | "promos" | "how" | "about" | "coverage" | "footer">("hero");
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Hero Carousel State - Multiple Interactive Slides
  const [slides, setSlides] = useState<SlideItem[]>([
    {
      id: "slide_1",
      tabLabel: "Slide 1: Miami Express",
      badge: "⚡ CASILLERO VIRTUAL EN MIAMI & MADRID",
      title1: "RASTREA TUS SUEÑOS,",
      titleHighlight: "NOSOTROS LOS LLEVAMOS.",
      description: "Tu casillero virtual en Miami, Madrid y Shenzhen con entregas rápidas, tarifas transparentes y soporte personalizado.",
      primaryBtnText: "ABRIR CASILLERO GRATIS",
      primaryBtnUrl: "/registro",
      secondaryBtnText: "CALCULAR TARIFA",
      secondaryBtnUrl: "/dashboard/calculadora",
      bgGradient: "from-slate-900 via-slate-900 to-slate-950",
      status: "published",
    },
    {
      id: "slide_2",
      tabLabel: "Slide 2: Madrid Cargo",
      badge: "🚢 FLETE MARÍTIMO DE ALTA CAPACIDAD",
      title1: "ENVIOS DESDE ESPAÑA,",
      titleHighlight: "TARIFAS DESDE $6/KG.",
      description: "Importa repuestos, ropa y mercancía consolidada desde Europa directamente a tu puerta.",
      primaryBtnText: "COTIZAR FLETE MARÍTIMO",
      primaryBtnUrl: "/dashboard/calculadora",
      secondaryBtnText: "VER COBERTURA",
      secondaryBtnUrl: "#cobertura",
      bgGradient: "from-slate-900 via-amber-950 to-slate-950",
      status: "published",
    },
    {
      id: "slide_3",
      tabLabel: "Slide 3: Soluciones PyME",
      badge: "💼 IMPORTACIONES EMPRESARIALES",
      title1: "IMPULSA TU NEGOCIO CON",
      titleHighlight: "LOGÍSTICA INTEGRAL BEEBOX.",
      description: "Soluciones de importación masiva, despacho aduanero y entregas programadas para empresas.",
      primaryBtnText: "CONTACTAR A UN ASESOR",
      primaryBtnUrl: "/contacto",
      secondaryBtnText: "CONOCER MÁS",
      secondaryBtnUrl: "#nosotros",
      bgGradient: "from-slate-900 via-slate-800 to-slate-950",
      status: "draft",
    },
  ]);

  const [activeSlideId, setActiveSlideId] = useState<string>("slide_1");

  const currentSlide = slides.find((s) => s.id === activeSlideId) || slides[0];

  const updateCurrentSlide = (field: keyof SlideItem, value: any) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === activeSlideId ? { ...s, [field]: value } : s))
    );
  };

  const handleAddSlide = () => {
    const newId = `slide_${Date.now()}`;
    const newSlide: SlideItem = {
      id: newId,
      tabLabel: `Slide ${slides.length + 1}: Nueva Promo`,
      badge: "✨ NUEVA PROMOCIÓN BEEBOX",
      title1: "NUEVA OFERTA ESPECIAL,",
      titleHighlight: "DISFRUTA DESCUENTOS ÚNICOS.",
      description: "Aprovecha nuestras tarifas especiales para importaciones de temporada.",
      primaryBtnText: "APROVECHAR OFERTA",
      primaryBtnUrl: "/registro",
      secondaryBtnText: "VER DETALLES",
      secondaryBtnUrl: "/promociones",
      bgGradient: "from-slate-900 via-slate-900 to-slate-950",
      status: "draft",
    };
    setSlides([...slides, newSlide]);
    setActiveSlideId(newId);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) return;
    const filtered = slides.filter((s) => s.id !== id);
    setSlides(filtered);
    setActiveSlideId(filtered[0].id);
  };

  const handleSave = (sectionName: string) => {
    setSavedNotice(`¡Carrusel y sección '${sectionName}' guardados y sincronizados con la Landing Page!`);
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

      {/* Main Section Tabs */}
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

      {/* TAB 1: INTUITIVE HERO CAROUSEL MANAGER WITH LIVE PREVIEW */}
      {activeTab === "hero" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Sub-Header: Slide Selector Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSlideId(s.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                    activeSlideId === s.id
                      ? "bg-slate-900 text-amber-400 shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-mono text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{s.tabLabel}</span>
                  {s.status === "published" ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              ))}

              <button
                onClick={handleAddSlide}
                className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Plus className="w-4 h-4" /> Añadir Diapositiva
              </button>
            </div>

            {/* Slide Action Controls */}
            <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <button
                onClick={() =>
                  updateCurrentSlide("status", currentSlide.status === "published" ? "draft" : "published")
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  currentSlide.status === "published"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                {currentSlide.status === "published" ? "● PUBLICADO EN WEB" : "○ BORRADOR (OCULTO)"}
              </button>

              {slides.length > 1 && (
                <button
                  onClick={() => handleDeleteSlide(currentSlide.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Eliminar esta diapositiva"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Grid Layout: Live Slide Preview (Top/Right) + Structured Edit Form (Left) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LIVE INTERACTIVE SLIDE PREVIEW (5 Cols) */}
            <div className="lg:col-span-5 space-y-3 sticky top-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-600" /> VISTA PREVIA EN VIVO (LIVE PREVIEW)
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">SIMULADOR HERO</span>
              </div>

              {/* Simulated Hero Carousel Card */}
              <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-2xl space-y-4 border border-slate-800 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Badge */}
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-wider border border-amber-500/30">
                  {currentSlide.badge || "SIN BADGE"}
                </span>

                {/* Main Titles */}
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white leading-tight tracking-tight">
                    {currentSlide.title1}
                  </h3>
                  <h3 className="text-lg font-black text-amber-400 leading-tight tracking-tight">
                    {currentSlide.titleHighlight}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {currentSlide.description}
                </p>

                {/* Buttons Preview */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md">
                    {currentSlide.primaryBtnText || "BOTÓN PRIMARIO"}
                  </button>

                  {currentSlide.secondaryBtnText && (
                    <button className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider border border-slate-700">
                      {currentSlide.secondaryBtnText}
                    </button>
                  )}
                </div>

                {/* Live Footer Dots */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>DESLIZANDO CADA 5s</span>
                  <div className="flex items-center gap-1.5">
                    {slides.map((s) => (
                      <span
                        key={s.id}
                        className={`w-2 h-2 rounded-full ${
                          s.id === currentSlide.id ? "bg-amber-400" : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* STRUCTURED SLIDE EDIT FORM (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Formulario de Edición: {currentSlide.tabLabel}
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">
                    LOS CAMBIOS SE REFLEJAN EN LA VISTA PREVIA EN TIEMPO REAL
                  </span>
                </div>

                <Button
                  onClick={() => handleSave(currentSlide.tabLabel)}
                  variant="amber"
                  size="sm"
                  className="rounded-xl font-bold text-xs"
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> Guardar Slide
                </Button>
              </div>

              <div className="space-y-4">
                {/* Badge Text */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    ETIQUETA SUPERIOR / BADGE
                  </label>
                  <input
                    type="text"
                    value={currentSlide.badge}
                    onChange={(e) => updateCurrentSlide("badge", e.target.value)}
                    placeholder="Ej. ⚡ LOGÍSTICA INTERNACIONAL 24/7"
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Title Line 1 */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    TÍTULO PRINCIPAL (LÍNEA 1)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.title1}
                    onChange={(e) => updateCurrentSlide("title1", e.target.value)}
                    placeholder="Ej. RASTREA TUS SUEÑOS,"
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Title Highlight Line 2 */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    FRASE DESTACADA AMARILLO CORPORATIVO (LÍNEA 2)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.titleHighlight}
                    onChange={(e) => updateCurrentSlide("titleHighlight", e.target.value)}
                    placeholder="Ej. NOSOTROS LOS LLEVAMOS."
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-bold text-amber-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    DESCRIPCIÓN / SUBTÍTULO
                  </label>
                  <textarea
                    rows={3}
                    value={currentSlide.description}
                    onChange={(e) => updateCurrentSlide("description", e.target.value)}
                    placeholder="Escribe la descripción clara del servicio..."
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* CTA Buttons Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  {/* Primary CTA */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider block">
                      BOTÓN PRIMARIO (LLAMADA A LA ACCIÓN)
                    </span>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">TEXTO</label>
                      <input
                        type="text"
                        value={currentSlide.primaryBtnText}
                        onChange={(e) => updateCurrentSlide("primaryBtnText", e.target.value)}
                        className="w-full rounded-xl bg-white border border-slate-200 p-2.5 text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">ENLACE / URL</label>
                      <input
                        type="text"
                        value={currentSlide.primaryBtnUrl}
                        onChange={(e) => updateCurrentSlide("primaryBtnUrl", e.target.value)}
                        className="w-full rounded-xl bg-white border border-slate-200 p-2.5 text-xs font-mono font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Secondary CTA */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider block">
                      BOTÓN SECUNDARIO (OPCIONAL)
                    </span>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">TEXTO</label>
                      <input
                        type="text"
                        value={currentSlide.secondaryBtnText}
                        onChange={(e) => updateCurrentSlide("secondaryBtnText", e.target.value)}
                        className="w-full rounded-xl bg-white border border-slate-200 p-2.5 text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">ENLACE / URL</label>
                      <input
                        type="text"
                        value={currentSlide.secondaryBtnUrl}
                        onChange={(e) => updateCurrentSlide("secondaryBtnUrl", e.target.value)}
                        className="w-full rounded-xl bg-white border border-slate-200 p-2.5 text-xs font-mono font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Métricas */}
      {activeTab === "metrics" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <h3 className="text-base font-black text-slate-900">Módulo de Métricas e Indicadores Clave</h3>
          <p className="text-xs text-slate-500">Estadísticas mostradas en la sección intermedia de la landing page.</p>

          <Button onClick={() => handleSave("Métricas")} variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs uppercase">
            GUARDAR MÉTRICAS
          </Button>
        </div>
      )}
    </div>
  );
}
