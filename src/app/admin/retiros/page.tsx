"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckCircle2, QrCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ApiRetiro {
  id: string;
  pinCode: string;
  branchName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  user?: {
    name: string;
    suiteCode: string;
  };
  shipment?: {
    trackingCode: string;
    recipientName: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminRetirosPage() {
  const [search, setSearch] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [retiros, setRetiros] = useState<ApiRetiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  const fetchRetiros = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/retiros`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.retiros) {
            setRetiros(data.retiros);
          }
        })
        .catch(() => {
          setRetiros([
            {
              id: "apt_1",
              pinCode: "894012",
              branchName: "Almacén Central (CDMX)",
              scheduledDate: "2026-10-18",
              scheduledTime: "09:00 AM",
              status: "PROGRAMADO",
              user: { name: "Juan Pérez Rodríguez", suiteCode: "CAS-88293-MIAMI" },
              shipment: { trackingCode: "MIA-449201", recipientName: "Juan Pérez" },
            },
          ]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetiros();
  }, []);

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetch(`${API_URL}/retiros/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pinCode: pinInput }),
        });
        const data = await res.json();
        if (res.ok) {
          setNoticeMsg(`¡PIN ${pinInput} verificado correctamente! El paquete fue entregado.`);
          setPinInput("");
          fetchRetiros();
          setTimeout(() => setNoticeMsg(null), 5000);
        } else {
          setNoticeMsg(`Error: ${data.message || "PIN inválido."}`);
          setTimeout(() => setNoticeMsg(null), 5000);
        }
      } catch {
        setNoticeMsg(`Error de conexión al verificar PIN.`);
        setTimeout(() => setNoticeMsg(null), 4000);
      }
    }
  };

  const filteredRetiros = retiros.filter(
    (r) =>
      r.pinCode.includes(search) ||
      (r.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.user?.suiteCode || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Citas y Entregas de Retiro en Sucursal</h1>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          VERIFICACIÓN DE PIN Y ESCÁNER EN MOSTRADOR
        </span>
      </div>

      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          {noticeMsg}
        </div>
      )}

      {/* Verification Card (ESCÁNER / PIN INPUT) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <h3 className="text-base font-black flex items-center gap-2 text-amber-400 uppercase tracking-wider">
          <QrCode className="w-5 h-5" /> Validación Directa de PIN de Entregas
        </h3>
        <p className="text-xs text-slate-300 font-medium">
          Introduce el PIN numérico de 6 dígitos que presenta el cliente en ventanilla para autorizar la entrega inmediata:
        </p>

        <form onSubmit={handleVerifyPin} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Ej. 894012"
            className="px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 font-mono font-black text-amber-400 text-lg tracking-widest focus:outline-none focus:border-amber-400 flex-1"
          />
          <Button type="submit" variant="amber" className="rounded-2xl px-8 py-3.5 font-extrabold text-xs uppercase shadow-lg">
            VERIFICAR PIN Y ENTREGAR
          </Button>
        </form>
      </div>

      {/* Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Lista de Retiros Programados</h3>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por PIN, cliente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Cargando retiros de sucursal...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4">CÓDIGO PIN</th>
                  <th className="py-4 px-4">FECHA / HORA</th>
                  <th className="py-4 px-4">CLIENTE / CASILLERO</th>
                  <th className="py-4 px-4">SUCURSAL</th>
                  <th className="py-4 px-4">GUÍA ASOCIADA</th>
                  <th className="py-4 px-4">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredRetiros.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-mono font-black text-amber-600 text-sm tracking-wider">{apt.pinCode}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{apt.scheduledDate}</span>
                      <span className="text-[10px] text-slate-400">{apt.scheduledTime}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{apt.user?.name || "Cliente"}</span>
                      <span className="text-[10px] font-mono font-bold text-amber-600">{apt.user?.suiteCode || "CAS-MIAMI"}</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">{apt.branchName}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-600">{apt.shipment?.trackingCode || "MIA-449201"}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          apt.status === "ENTREGADO" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
