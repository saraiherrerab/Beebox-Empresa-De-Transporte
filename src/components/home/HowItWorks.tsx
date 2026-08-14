import React from "react";
import { UserPlus, ShoppingBag, PackageCheck, Home } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "1. Regístrate",
      desc: "Crea tu cuenta gratis y obtén tu dirección física de casillero en Miami, Madrid o Shenzhen.",
      icon: <UserPlus className="w-6 h-6 text-amber-500" />,
    },
    {
      step: 2,
      title: "2. Compra online",
      desc: "Realiza tus compras en cualquier tienda internacional y usa la dirección de tu casillero Beebox.",
      icon: <ShoppingBag className="w-6 h-6 text-amber-500" />,
    },
    {
      step: 3,
      title: "3. Recibimos",
      desc: "Recibimos tu paquete en nuestro almacén, lo inspeccionamos y te notificamos de inmediato.",
      icon: <PackageCheck className="w-6 h-6 text-amber-500" />,
    },
    {
      step: 4,
      title: "4. Entrega final",
      desc: "Despachamos tu carga con trámite de aduana directo hasta la puerta de tu domicilio u oficina.",
      icon: <Home className="w-6 h-6 text-amber-500" />,
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Paso a Paso</span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 mb-3">
          ¿CÓMO FUNCIONA?
        </h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto mb-14">
          Traer tus compras internacionales o enviar carga corporativa nunca fue tan fácil y seguro.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-200/60">
                {item.icon}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
