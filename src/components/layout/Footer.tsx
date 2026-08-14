import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Shield, ArrowRight } from "lucide-react";
import { COMPANY_INFO, NAV_LINKS, SERVICES_LIST } from "@/constants";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-beebox-navy-950 border-t border-slate-800 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="block">
              <img
                src="/beebox-logo.jpg"
                alt="Beebox Logo"
                className="h-12 w-auto object-contain bg-white p-1.5 rounded-xl shadow-md"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empresa líder en soluciones de casillero internacional, transporte terrestre, logística de distribución y gestión de última milla.
            </p>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-beebox-amber-500 shrink-0" />
                <span>{COMPANY_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-beebox-amber-500 shrink-0" />
                <span>{COMPANY_INFO.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-beebox-amber-500 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Navegación</h3>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-beebox-amber-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-beebox-amber-500 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Services */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Servicios</h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICES_LIST.map((srv) => (
                <li key={srv.id}>
                  <Link href="/#servicios" className="hover:text-beebox-amber-400 transition-colors">
                    {srv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Security / Coverage */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Cobertura</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Almacenes en Miami, Madrid, Shenzhen y red logística integrada de Arica a Punta Arenas.
            </p>
            <div className="rounded-xl border border-slate-800 bg-beebox-navy-900/60 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Shield className="w-4 h-4 shrink-0" />
                Monitoreo GPS 24/7
              </div>
              <p className="text-[11px] text-slate-400">
                Seguimiento en tiempo real y trámites aduanales garantizados.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Beebox Empresa de Transporte SpA. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400">Términos y Condiciones</a>
            <a href="#" className="hover:text-slate-400">Política de Privacidad</a>
            <a href="#" className="hover:text-slate-400">Seguros de Carga</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
