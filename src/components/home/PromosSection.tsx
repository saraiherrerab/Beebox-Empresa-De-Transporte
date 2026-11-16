"use client";

import React, { useState, useEffect } from "react";
import { Clock, Megaphone } from "lucide-react";
import { API_URL } from "@/config/api";

interface PromoItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  days?: string;
  hours?: string;
  mins?: string;
  imageUrl: string;
}

const DEFAULT_PROMOS: PromoItem[] = [
  {
    id: "promo-1",
    title: "Black Friday Logístico",
    subtitle: "Hasta 40% de descuento en envíos pesados consolidados.",
    badge: "-40% OFF",
    days: "04",
    hours: "12",
    mins: "45",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "promo-2",
    title: "Primer Envío Preferencial",
    subtitle: "Registra tu casillero hoy y recibe tarifa preferencial en tu primera consolidación.",
    badge: "NUEVOS USUARIOS",
    imageUrl: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "promo-3",
    title: "Flete Aéreo Express",
    subtitle: "Salidas semanales garantizadas desde nuestro almacén en Oklahoma.",
    badge: "EXPRESS US",
    days: "09",
    hours: "22",
    mins: "00",
    imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80",
  },
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80",
];

export const PromosSection: React.FC = () => {
  const [promos, setPromos] = useState<PromoItem[]>(DEFAULT_PROMOS);
  const [notices, setNotices] = useState<Array<{ id: string; title: string; description: string }>>([]);

  useEffect(() => {
    fetch(`${API_URL}/cms`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          const activeItems = data.items.filter((i: any) => i.active !== false);

          const cmsNotices = activeItems.filter((i: any) => (i.type || "").toLowerCase() === "notice");
          setNotices(cmsNotices);

          const cmsPromos = activeItems.filter((i: any) => {
            const t = (i.type || "").toLowerCase();
            return t === "promo" || t === "banner";
          });

          if (cmsPromos.length > 0) {
            const mapped: PromoItem[] = cmsPromos.map((item: any, idx: number) => ({
              id: item.id,
              title: item.title,
              subtitle: item.description,
              badge: (item.type || "").toLowerCase() === "promo" ? "PROMOCIÓN" : "ANUNCIO DESTACADO",
              imageUrl: item.imageUrl || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
            }));
            setPromos(mapped);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="promociones" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Avisos oficiales publicados en CMS (tipo notice) */}
        {notices.length > 0 && (
          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-4 sm:p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    AVISO IMPORTANTE BEEBOX
                  </span>
                  <h4 className="text-sm font-black text-slate-900">{n.title}</h4>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">{n.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Tarifas y Novedades</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Promociones y Banners Activos</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-amber-100 text-amber-700 tracking-wide">
                    {promo.badge}
                  </span>
                  {promo.days && (
                    <div className="flex items-center gap-1 text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-bold text-slate-800">
                        {promo.days}d {promo.hours}h {promo.mins}m
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {promo.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{promo.subtitle}</p>
              </div>

              {/* Image Preview */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                <img
                  src={promo.imageUrl}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
