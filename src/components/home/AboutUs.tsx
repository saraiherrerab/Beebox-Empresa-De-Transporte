import React from "react";
import { CheckCircle2 } from "lucide-react";

export const AboutUs: React.FC = () => {
  return (
    <section id="nosotros" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-lg h-56 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                  alt="Equipo Beebox"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-amber-500 rounded-3xl p-6 text-white text-center shadow-lg">
                <span className="text-3xl font-black font-mono block">+15</span>
                <span className="text-xs font-bold uppercase tracking-wider">Años de experiencia</span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="bg-amber-400 rounded-3xl p-6 text-slate-950 font-bold shadow-lg">
                <span className="text-4xl font-black block">100%</span>
                <span className="text-xs uppercase tracking-wider">Satisfacción Cliente</span>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg h-56 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80"
                  alt="Almacén de carga"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Story Text */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Sobre Nosotros</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              QUIÉNES SOMOS
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              Damos soluciones en logística desde el año 2017 en la región de Latinoamérica y Estados Unidos. Nos caracterizamos por mantener estándares de alta seguridad, tecnología de rastreo en tiempo real y flexibilidad adaptada a las necesidades de pequeñas empresas, multinacionales y clientes individuales.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Misión</h4>
                  <p className="text-xs text-slate-500">
                    Conectar personas y marcas mediante logística confiable, segura y eficiente, eliminando las fronteras del comercio internacional.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Visión</h4>
                  <p className="text-xs text-slate-500">
                    Ser la red de transporte y casilleros de mayor innovación y rapidez tecnológica en la región.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
