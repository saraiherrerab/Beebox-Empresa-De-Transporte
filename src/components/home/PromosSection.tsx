import React from "react";
import { Tag, Clock, ArrowRight } from "lucide-react";

export const PromosSection: React.FC = () => {
  const promos = [
    {
      id: "promo-1",
      title: "Black Friday Logístico",
      subtitle: "Hasta 40% de descuento en envíos pesados desde Miami.",
      badge: "-40% OFF",
      days: "04",
      hours: "12",
      mins: "45",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "promo-2",
      title: "Primer Envío Gratis",
      subtitle: "Registra tu casillero hoy y tu primer consolidado es sin costo de flete base.",
      badge: "NUEVOS USUARIOS",
      imageUrl: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "promo-3",
      title: "Flete Madrid Express",
      subtitle: "48 horas garantizadas para carga corporativa europea.",
      badge: "EXPRESS EU",
      days: "09",
      hours: "22",
      mins: "00",
      imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section id="promociones" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Tarifas Especiales</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Promociones Activas</h2>
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
                      <span className="font-bold text-slate-800">{promo.days}d {promo.hours}h {promo.mins}m</span>
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
