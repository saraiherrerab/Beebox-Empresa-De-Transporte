"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, Plus, Trash2, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ApiCMSContent {
  id: string;
  type: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  active: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminCMSPage() {
  const [items, setItems] = useState<ApiCMSContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("banner");
  const [imageUrl, setImageUrl] = useState("");

  const fetchCMS = () => {
    fetch(`${API_URL}/cms`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.items) {
          setItems(data.items);
        }
      })
      .catch(() => {
        setItems([
          {
            id: "cms_1",
            type: "banner",
            title: "¡Súper Descuento de Envíos en Temporada Alta!",
            description: "Aprovecha un 15% OFF en tus consolidaciones de Miami usando tu casillero virtual.",
            active: true,
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  const handleCreateCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetch(`${API_URL}/cms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type, title, description, imageUrl }),
        });
        if (res.ok) {
          setSavedNotice("¡Contenido promocional publicado exitosamente!");
          setTitle("");
          setDescription("");
          setImageUrl("");
          fetchCMS();
          setTimeout(() => setSavedNotice(null), 4000);
        }
      } catch {
        setSavedNotice("Error de conexión al crear contenido CMS.");
      }
    }
  };

  const handleDeleteCMS = async (id: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetch(`${API_URL}/cms/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          setSavedNotice("Contenido deshabilitado.");
          fetchCMS();
          setTimeout(() => setSavedNotice(null), 4000);
        }
      } catch {
        // Fallback
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestor de Contenidos y Banners (CMS)</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Administra anuncios dinámicos y publicaciones promocionales para el portal y la app de clientes.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {savedNotice}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase">Crear Nuevo Anuncio / Banner</h3>

          <form onSubmit={handleCreateCMS} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">TIPO</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs font-bold text-slate-900"
              >
                <option value="banner">Banner Promocional</option>
                <option value="notice">Aviso Notificación</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">TÍTULO</label>
              <input
                type="text"
                placeholder="Ej. Descuento del 20% en Envíos Aéreos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">DESCRIPCIÓN</label>
              <textarea
                rows={3}
                placeholder="Detalles de la oferta..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs font-medium text-slate-900"
                required
              />
            </div>

            <Button type="submit" variant="amber" className="w-full py-3 font-bold text-xs uppercase shadow-md">
              <Plus className="w-4 h-4 mr-1" /> PUBLICAR ANUNCIO EN CMS
            </Button>
          </form>
        </div>

        {/* Banners List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase">Anuncios y Promociones Activas</h3>

          {loading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              <span className="text-xs font-bold">Cargando publicaciones CMS...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                      {item.type}
                    </span>
                    <button
                      onClick={() => handleDeleteCMS(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Eliminar contenido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 font-medium">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
