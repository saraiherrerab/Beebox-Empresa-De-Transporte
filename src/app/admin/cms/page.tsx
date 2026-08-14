"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Save, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminCMSPage() {
  const [slide1Title, setSlide1Title] = useState("RASTREA TUS SUEÑOS,");
  const [slide1Highlight, setSlide1Highlight] = useState("NOSOTROS LOS LLEVAMOS.");
  const [saved, setSaved] = useState(false);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Administrador de Banners e Interacciones (CMS)</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Gestión 100% editable de banners rotativos principales, títulos, imágenes promocionales y bloques informativos.
          </p>
        </div>

        <Button onClick={handleSaveCMS} variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs uppercase shrink-0">
          <Save className="w-4 h-4 mr-1.5" /> GUARDAR CAMBIOS CMS
        </Button>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ¡Contenidos del portal web actualizados correctamente!
        </div>
      )}

      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl max-w-3xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-amber-400" /> Editar Carrusel Principal (Hero Section)
        </h3>

        <form onSubmit={handleSaveCMS} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Slide 1 - Título Principal
            </label>
            <input
              type="text"
              value={slide1Title}
              onChange={(e) => setSlide1Title(e.target.value)}
              className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Slide 1 - Frase Destacada (Amarillo)
            </label>
            <input
              type="text"
              value={slide1Highlight}
              onChange={(e) => setSlide1Highlight(e.target.value)}
              className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs uppercase">
              GUARDAR SLIDE 1
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
