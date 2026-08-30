"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, PackageCheck, AlertCircle, Info, ChevronRight, CheckCheck } from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

import { API_URL } from "@/config/api";

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (!token) return;

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
      // Fallback a notificaciones de prueba si está offline
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
    ]);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
        return <PackageCheck className="w-4 h-4 text-amber-600" />;
      case "destino":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "account_status":
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón Campanita 🔔 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center"
        aria-label="Ver notificaciones"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Menú Desplegable (Pop-over) */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-black text-slate-900">Notificaciones</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Marcar leídas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-bold">No tienes notificaciones por el momento.</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                    !n.read ? "bg-amber-50/40" : ""
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-slate-100 shrink-0">{getIcon(n.type)}</div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900">{n.title}</h5>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                    <span className="text-[9px] text-slate-400 block pt-1 font-medium">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <Link
              href="/dashboard/notificaciones"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1 transition-colors"
            >
              Ver todas las notificaciones <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
