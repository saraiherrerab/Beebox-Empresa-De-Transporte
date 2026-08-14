"use client";

import React from "react";
import { Plane, Ship, Truck, Plus, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminRutasPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Logística y Rutas</h1>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          CATÁLOGO Y MONITOREO EN TIEMPO REAL
        </span>
      </div>

      {/* Top Section: Catálogo de Rutas Predeterminadas (Matching Mockup 4) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-black text-slate-900">Catálogo de Rutas Predeterminadas</h3>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            OPCIONES DISPONIBLES PARA SELECCIÓN DEL CLIENTE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Miami Express */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
              <Plane className="w-6 h-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-500">
              AÉREA
            </span>
            <div>
              <h4 className="text-sm font-black text-slate-900">Miami Express</h4>
              <span className="text-[10px] font-medium text-slate-400">Frecuencia: Diaria</span>
            </div>
            <div className="space-y-1 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Tiempo Est.:</span> <span className="font-bold text-slate-900">3–5 días</span>
              </div>
              <div className="flex justify-between">
                <span>Costo Base:</span> <span className="font-bold text-amber-600 font-mono">$12.00 / kg</span>
              </div>
            </div>
            <button className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-900 pt-2 block mx-auto">
              EDITAR CONFIGURACIÓN
            </button>
          </div>

          {/* Madrid Cargo */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto border border-slate-200">
              <Ship className="w-6 h-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-500">
              MARÍTIMA
            </span>
            <div>
              <h4 className="text-sm font-black text-slate-900">Madrid Cargo</h4>
              <span className="text-[10px] font-medium text-slate-400">Frecuencia: Semanal</span>
            </div>
            <div className="space-y-1 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Tiempo Est.:</span> <span className="font-bold text-slate-900">15–20 días</span>
              </div>
              <div className="flex justify-between">
                <span>Costo Base:</span> <span className="font-bold text-amber-600 font-mono">$6.00 / kg</span>
              </div>
            </div>
            <button className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-900 pt-2 block mx-auto">
              EDITAR CONFIGURACIÓN
            </button>
          </div>

          {/* CDMX Local */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto border border-slate-200">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-500">
              TERRESTRE
            </span>
            <div>
              <h4 className="text-sm font-black text-slate-900">CDMX Local</h4>
              <span className="text-[10px] font-medium text-slate-400">Frecuencia: Diaria</span>
            </div>
            <div className="space-y-1 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Tiempo Est.:</span> <span className="font-bold text-slate-900">24–48 hrs</span>
              </div>
              <div className="flex justify-between">
                <span>Costo Base:</span> <span className="font-bold text-amber-600 font-mono">$5.00 fijo</span>
              </div>
            </div>
            <button className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-900 pt-2 block mx-auto">
              EDITAR CONFIGURACIÓN
            </button>
          </div>

          {/* Dotted Add to Catalog Card */}
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500 transition-colors bg-white/50">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">AÑADIR AL CATÁLOGO</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Monitoreo de Rutas en Curso (Matching Mockup 4) */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-base font-black text-slate-900">Monitoreo de Rutas en Curso</h3>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            SEGUIMIENTO EN TIEMPO REAL DE DESPACHOS ACTIVOS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ruta Poniente Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200">
                🚴
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider">
                EN ENTREGA
              </span>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900">Ruta Poniente (CDMX)</h4>
              <p className="text-[11px] text-slate-500">Chofer Asignado: <strong>Roberto Gómez</strong></p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-500">
                <span>PROGRESO DE LA RUTA</span>
                <span className="font-mono">8/12 (66%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 w-[66%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 border-t border-slate-100 pt-3">
              <div>
                <span className="block text-slate-400 uppercase">ÚLTIMA PARADA</span>
                <strong className="text-slate-800">Polanco Secc. 1</strong>
              </div>
              <div>
                <span className="block text-slate-400 uppercase">PRÓXIMA</span>
                <strong className="text-amber-600">Lomas de Chap.</strong>
              </div>
            </div>

            <button className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md">
              RASTREAR EN MAPA
            </button>
          </div>

          {/* Ruta Centro Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                🚐
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider">
                INICIANDO
              </span>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900">Ruta Centro (CDMX)</h4>
              <p className="text-[11px] text-slate-500">Chofer Asignado: <strong>Luis Miguel</strong></p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-500">
                <span>PROGRESO DE LA RUTA</span>
                <span className="font-mono">2/15 (13%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 w-[13%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 border-t border-slate-100 pt-3">
              <div>
                <span className="block text-slate-400 uppercase">ÚLTIMA PARADA</span>
                <strong className="text-slate-800">Centro Hist.</strong>
              </div>
              <div>
                <span className="block text-slate-400 uppercase">PRÓXIMA</span>
                <strong className="text-amber-600">Roma Norte</strong>
              </div>
            </div>

            <button className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md">
              RASTREAR EN MAPA
            </button>
          </div>

          {/* Dotted Assign New Active Route Card */}
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500 transition-colors bg-white/50 space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Asignar Nueva Ruta Activa</span>
            <p className="text-[11px] text-slate-400">Selecciona un chofer y una zona para iniciar un nuevo monitoreo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
