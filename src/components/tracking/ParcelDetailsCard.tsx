import React from "react";
import { Package, User, MapPin, Calendar, Weight, Ruler, ShieldCheck } from "lucide-react";
import { Shipment } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface ParcelDetailsCardProps {
  shipment: Shipment;
}

export const ParcelDetailsCard: React.FC<ParcelDetailsCardProps> = ({ shipment }) => {
  return (
    <Card className="space-y-6 border-slate-800 bg-beebox-navy-900/90">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Código de Guía:</span>
          <h3 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <Package className="w-6 h-6 text-beebox-amber-400" />
            {shipment.trackingCode}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="amber">Servicio {shipment.serviceType}</Badge>
          <Badge variant="cyan">En Reparto</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origin / Sender */}
        <div className="space-y-3 p-4 rounded-xl bg-beebox-navy-950/80 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-beebox-amber-400" /> Origen & Remitente
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{shipment.sender.name}</h4>
            <p className="text-xs text-slate-400">Ciudad: {shipment.sender.city}</p>
          </div>
        </div>

        {/* Destination / Recipient */}
        <div className="space-y-3 p-4 rounded-xl bg-beebox-navy-950/80 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <User className="w-4 h-4 text-beebox-cyan-400" /> Destino & Destinatario
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{shipment.recipient.name}</h4>
            <p className="text-xs text-slate-400">{shipment.recipient.address}, {shipment.recipient.city}</p>
          </div>
        </div>
      </div>

      {/* Package Tech Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Weight className="w-3.5 h-3.5 text-beebox-amber-400" /> Peso Total
          </div>
          <span className="text-sm font-bold text-white font-mono">{shipment.weightKg} kg</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Ruler className="w-3.5 h-3.5 text-beebox-cyan-400" /> Dimensiones
          </div>
          <span className="text-sm font-bold text-white font-mono">{shipment.dimensions}</span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Entrega Estimada
          </div>
          <span className="text-xs font-bold text-emerald-300">{shipment.estimatedDelivery}</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Envío Asegurado por Seguros Beebox SpA
        </span>
        <span className="font-mono text-[10px] text-emerald-400">PÓLIZA #88492-CH</span>
      </div>
    </Card>
  );
};
