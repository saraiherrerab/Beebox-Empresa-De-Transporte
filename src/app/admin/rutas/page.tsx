"use client";

import React, { useState, useEffect } from "react";
import { Plane, Ship, Truck, Plus, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ApiRoute {
  id: string;
  name: string;
  originCity: string;
  destCity: string;
  status: string;
  vehicle?: {
    id: string;
    name: string;
    category: string;
  };
}

interface ApiVehicle {
  id: string;
  name: string;
  category: string;
  capacity: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminRutasPage() {
  const [routes, setRoutes] = useState<ApiRoute[]>([]);
  const [fleet, setFleet] = useState<ApiVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  // Form state
  const [routeName, setRouteName] = useState("");
  const [originCity, setOriginCity] = useState("Miami, FL");
  const [destCity, setDestCity] = useState("Ciudad de México");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const fetchData = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      fetch(`${API_URL}/routes`, { headers }).then((res) => res.json()),
      fetch(`${API_URL}/fleet`).then((res) => res.json()),
    ])
      .then(([routesData, fleetData]) => {
        if (routesData && routesData.routes) {
          setRoutes(routesData.routes);
        }
        if (Array.isArray(fleetData)) {
          setFleet(fleetData);
        }
      })
      .catch(() => {
        setRoutes([
          { id: "r1", name: "Miami Express", originCity: "Miami, FL", destCity: "Ciudad de México", status: "ACTIVA" },
          { id: "r2", name: "Madrid Cargo", originCity: "Madrid, ES", destCity: "Ciudad de México", status: "ACTIVA" },
          { id: "r3", name: "CDMX Local", originCity: "CDMX Central", destCity: "CDMX Vallejo", status: "ACTIVA" },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName || !originCity || !destCity) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetch(`${API_URL}/routes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: routeName,
            originCity,
            destCity,
            vehicleId: selectedVehicleId || undefined,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setNoticeMsg(`Ruta ${routeName} creada exitosamente.`);
          setRouteName("");
          setShowAddForm(false);
          fetchData();
          setTimeout(() => setNoticeMsg(null), 4000);
        }
      } catch {
        setNoticeMsg("Error de conexión al crear ruta.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Logística y Rutas de Transporte</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            CATÁLOGO Y MONITOREO DE DESPACHOS ACTIVOS
          </span>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="amber" className="rounded-2xl font-bold text-xs">
          <Plus className="w-4 h-4 mr-1" /> NUEVA RUTA
        </Button>
      </div>

      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {noticeMsg}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleCreateRoute} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 animate-in slide-in-from-top-4">
          <h3 className="text-sm font-black text-slate-900 uppercase">Añadir Nueva Ruta de Transporte</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nombre de Ruta (ej. Ruta Norte CDMX)"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
              required
            />
            <input
              type="text"
              placeholder="Ciudad de Origen"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              className="p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
              required
            />
            <input
              type="text"
              placeholder="Ciudad de Destino"
              value={destCity}
              onChange={(e) => setDestCity(e.target.value)}
              className="p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="text-xs font-bold text-slate-400">
              CANCELAR
            </button>
            <Button type="submit" variant="amber" className="rounded-xl px-6 py-2 text-xs font-bold">
              GUARDAR RUTA
            </Button>
          </div>
        </form>
      )}

      {/* Top Section: Catálogo de Rutas */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-black text-slate-900">Catálogo de Rutas Activas</h3>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            OPCIONES CONFIGURADAS EN EL SISTEMA
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Cargando rutas...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {routes.map((r) => (
              <div key={r.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
                  {r.name.toLowerCase().includes("express") ? <Plane className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                  {r.status}
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{r.name}</h4>
                  <span className="text-[10px] font-medium text-slate-400">
                    {r.originCity} ➔ {r.destCity}
                  </span>
                </div>
              </div>
            ))}

            <div
              onClick={() => setShowAddForm(true)}
              className="border-2 border-dashed border-slate-300 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500 transition-colors bg-white/50"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-2">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">AÑADIR AL CATÁLOGO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
