"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, PackageCheck, AlertCircle, Info, CheckCheck, Loader2, Filter } from "lucide-react";
import { NotificationItem } from "@/components/client/NotificationBell";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function ClientNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetch(`${API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.notifications) {
          setNotifications(data.notifications);
          return;
        }
      } catch {
        // Fallback local
      }
    }

    setNotifications([
      {
        id: "notif_1",
        title: "Recibido en Origen",
        message: "Tu paquete MIA-88293 ha sido registrado exitosamente en el almacén de Miami.",
        type: "origen",
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "notif_2",
        title: "Prealerta Vinculada",
        message: "Tu prealerta de Amazon US fue vinculada con la guía MIA-88293.",
        type: "prealerta",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "notif_3",
        title: "Llegó a su Destino",
        message: "¡Tu paquete MIA-77120 ha llegado al centro de distribución destino y está listo!",
        type: "destino",
        read: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]);
  };

  useEffect(() => {
    fetchNotifications().finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        await fetch(`${API_URL}/notifications/${id}/read`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Fallback local
      }
    }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        await fetch(`${API_URL}/notifications/read-all`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Fallback local
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "origen":
        return <PackageCheck className="w-5 h-5 text-amber-600" />;
      case "destino":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "account_status":
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const filtered = notifications.filter((n) => (filter === "unread" ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Centro de Notificaciones</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            HISTORIAL DE AVISOS Y ESTADOS DE ENVÍO
          </span>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm w-fit"
          >
            <CheckCheck className="w-4 h-4" /> Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            filter === "all" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            filter === "unread" ? "bg-amber-500 text-slate-950 shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          No Leídas ({unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Cargando notificaciones...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Bell className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No hay notificaciones {filter === "unread" ? "no leídas" : ""}</h3>
          <p className="text-xs text-slate-500">Los avisos de tus envíos y prealertas aparecerán aquí en tiempo real.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id)}
              className={`p-5 sm:p-6 transition-colors flex items-start gap-4 cursor-pointer ${
                !n.read ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-slate-50"
              }`}
            >
              <div className="p-3 rounded-2xl bg-slate-100 shrink-0 mt-0.5">{getIcon(n.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{n.message}</p>
              </div>
              {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
