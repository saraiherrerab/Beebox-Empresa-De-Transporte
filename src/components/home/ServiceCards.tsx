import React from "react";
import { Zap, Truck, PackageCheck, ThermometerSnowflake, CheckCircle2, ArrowRight } from "lucide-react";
import { SERVICES_LIST } from "@/constants";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-beebox-amber-400" />,
  Truck: <Truck className="w-6 h-6 text-beebox-cyan-400" />,
  PackageCheck: <PackageCheck className="w-6 h-6 text-emerald-400" />,
  ThermometerSnowflake: <ThermometerSnowflake className="w-6 h-6 text-blue-400" />,
};

export const ServiceCards: React.FC = () => {
  return (
    <section id="servicios" className="py-20 relative bg-beebox-navy-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Badge variant="cyan">Nuestras Soluciones</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Servicios Especializados de Transporte
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Diseñamos soluciones a la medida de tu negocio, desde paquetes prioritarios hasta logística pesada interregional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_LIST.map((service) => (
            <Card key={service.id} className="flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-beebox-amber-500/40 transition-colors">
                    {iconMap[service.iconName]}
                  </div>
                  {service.badge && <Badge variant="amber">{service.badge}</Badge>}
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-beebox-amber-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {service.shortDesc}
                </p>

                <div className="pt-2 space-y-2 border-t border-slate-800/80">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-beebox-amber-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/60">
                <Link
                  href="/#cotizador"
                  className="inline-flex items-center gap-2 text-xs font-bold text-beebox-amber-400 hover:text-amber-300 transition-colors"
                >
                  Solicitar Cotización <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
