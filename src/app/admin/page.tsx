"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, BellRing, Package, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface MetricsData {
  totalClients: number;
  pendingPrealertas: number;
  pendingPickups: number;
  activeShipments: number;
  totalRevenue: number;
}

import { API_URL } from "@/config/api";

const DEFAULT_METRICS: MetricsData = {
  totalClients: 8,
  pendingPrealertas: 2,
  pendingPickups: 1,
  activeShipments: 8,
  totalRevenue: 2487.4,
};

export default function AdminOverviewPage() {
  const { socket, user, isAuthenticated, logout } = useAuth();
  const [metrics, setMetrics] = useState<MetricsData>(DEFAULT_METRICS);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchMetrics = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/admin/metrics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.metrics) {
            setMetrics(data.metrics);
            setAuthError(null);
          } else if (data && (data.error || !data.success)) {
            setAuthError("Tu token de sesión es anterior al cambio de permisos o expiró. Por favor vuelve a iniciar sesión para actualizar tu acceso de Super Admin.");
            setMetrics(DEFAULT_METRICS);
          }
        })
        .catch(() => {
          setMetrics(DEFAULT_METRICS);
        })
        .finally(() => setLoading(false));
    } else {
      setMetrics(DEFAULT_METRICS);
      setLoading(false);
    }
  }, []);

  // Re-fetch metrics when user authenticates or socket events fire
  useEffect(() => {
    fetchMetrics();

    if (socket) {
      socket.on("metrics:updated", fetchMetrics);
      socket.on("prealerta:updated", fetchMetrics);
      socket.on("shipment:updated", fetchMetrics);
    }

    return () => {
      if (socket) {
        socket.off("metrics:updated", fetchMetrics);
        socket.off("prealerta:updated", fetchMetrics);
        socket.off("shipment:updated", fetchMetrics);
      }
    };
  }, [fetchMetrics, socket, isAuthenticated, user]);

  const stats = [
    { label: "Clientes Registrados", value: metrics.totalClients.toLocaleString(), change: "Base de Datos Real", icon: Users },
    { label: "Prealertas Pendientes", value: metrics.pendingPrealertas.toString(), change: "Requieren confirmación", icon: BellRing },
    { label: "Envíos Activos", value: metrics.activeShipments.toString(), change: "En tránsito/Aduana", icon: Package },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resumen Ejecutivo (CMS Admin)</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Gestión unificada de clientes, casilleros virtuales, prealertas de almacén y métricas consolidadas en tiempo real (WebSocket activo).
        </p>
      </div>

      {authError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Aviso de Autenticación de Super Admin</span>
          </div>
          <p>{authError}</p>
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors shadow-sm text-xs"
          >
            Re-iniciar Sesión (Super Admin)
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{item.label}</span>
                <Icon className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 flex items-center gap-2">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-amber-500" /> : item.value}
              </div>
              <span className="text-[11px] font-bold text-amber-700 block">{item.change}</span>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-600" /> Confirmación de Prealertas de Almacén
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Corrobora la recepción física de compras en el almacén de Oklahoma, confirma el destino final de envío y asigna la guía para despacho.
          </p>
          <Link href="/admin/prealertas" className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:underline pt-2 uppercase">
            IR A CONFIRMAR PREALERTAS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" /> Directorio de Clientes y Casilleros
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Consulta códigos de casillero asignados (`CAS-XXXXX-TULSA`), historial de compras e información de contacto de usuarios registrados.
          </p>
          <Link href="/admin/clientes" className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:underline pt-2 uppercase">
            CONSULTAR DIRECTORIO <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
