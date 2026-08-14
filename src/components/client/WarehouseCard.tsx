import React from "react";
import { Building2, Copy, Check } from "lucide-react";
import { useState } from "react";

export const WarehouseCard: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("8400 NW 25th St, Miami, FL 33198");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Mis Almacenes</h3>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            🇺🇸 MIAMI WAREHOUSE
          </span>
          <button
            onClick={handleCopy}
            className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Nombre:</span>
            <span className="font-bold text-slate-800">Juan Pérez CAS-88293</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Dirección:</span>
            <span className="font-bold text-slate-800">8400 NW 25th St</span>
          </div>
        </div>
      </div>
    </div>
  );
};
