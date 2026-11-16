"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Info,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/config/api";

interface ApiCMSContent {
  id: string;
  type: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  active: boolean;
}

const CMS_TYPE_CONFIG: Record<
  string,
  { label: string; location: string; badgeClass: string }
> = {
  notice: {
    label: "Aviso / Notificación (notice)",
    location: "Visible en la parte superior del Portal del Cliente (/dashboard) y avisos en portada.",
    badgeClass: "bg-amber-100 text-amber-800",
  },
  banner: {
    label: "Banner Promocional (banner)",
    location: "Visible en el Portal del Cliente (/dashboard) y en la sección de Promociones de la web pública.",
    badgeClass: "bg-blue-100 text-blue-800",
  },
  promo: {
    label: "Tarjeta de Promoción (promo)",
    location: "Visible en la grilla de Promociones Activas de la página principal (/#promociones).",
    badgeClass: "bg-emerald-100 text-emerald-800",
  },
  hero_banner: {
    label: "Diapositiva Hero Principal (hero_banner)",
    location: "Visible como diapositiva principal en el carrusel superior de la portada pública (/).",
    badgeClass: "bg-purple-100 text-purple-800",
  },
};

export default function AdminCMSPage() {
  const [items, setItems] = useState<ApiCMSContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Create / Edit Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("banner");
  const [imageUrl, setImageUrl] = useState("");
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const fetchCMS = () => {
    fetch(`${API_URL}/cms?all=true`, { cache: "no-store" })
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
            description: "Aprovecha un 15% OFF en tus consolidaciones usando tu casillero virtual.",
            active: true,
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setType("banner");
    setImageUrl("");
    setPublishImmediately(true);
    setShowPreview(false);
  };

  const handleStartEdit = (item: ApiCMSContent) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setType((item.type || "banner").toLowerCase());
    setImageUrl(item.imageUrl || "");
    setPublishImmediately(item.active !== false);
  };

  const handleSubmitCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (!token) return;

    try {
      const url = editingId ? `${API_URL}/cms/${editingId}` : `${API_URL}/cms`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim() || undefined,
          active: publishImmediately,
        }),
      });

      if (res.ok) {
        setSavedNotice(
          editingId
            ? "¡Anuncio actualizado y sincronizado en el sitio!"
            : publishImmediately
            ? "¡Anuncio publicado exitosamente y visible en el sitio!"
            : "Anuncio guardado como borrador."
        );
        resetForm();
        fetchCMS();
        setTimeout(() => setSavedNotice(null), 4000);
      }
    } catch {
      setSavedNotice("Error de conexión al guardar contenido CMS.");
    }
  };

  const handleToggleActive = async (item: ApiCMSContent) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/cms/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !item.active }),
      });
      if (res.ok) {
        setSavedNotice(
          !item.active
            ? `Anuncio "${item.title}" publicado en el sitio.`
            : `Anuncio "${item.title}" pasado a borrador (despublicado).`
        );
        fetchCMS();
        setTimeout(() => setSavedNotice(null), 4000);
      }
    } catch {
      // ignore
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
          if (editingId === id) resetForm();
          setSavedNotice("Anuncio eliminado permanentemente.");
          fetchCMS();
          setTimeout(() => setSavedNotice(null), 4000);
        }
      } catch {
        // Fallback
      }
    }
  };

  const currentTypeInfo = CMS_TYPE_CONFIG[type] || CMS_TYPE_CONFIG.banner;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Gestor de Contenidos y Banners (CMS)
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Administra anuncios dinámicos, avisos operativos y promociones para la web pública y el portal del cliente.
          </p>
        </div>
      </div>

      {/* Guía de Mapeo entre Tipo de Anuncio y Ubicación en el Sitio (OBS-10) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
          <Info className="w-4 h-4 text-amber-500" /> Dónde se muestra cada tipo de anuncio en la plataforma
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {Object.entries(CMS_TYPE_CONFIG).map(([key, cfg]) => (
            <div key={key} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${cfg.badgeClass}`}>
                {key.toUpperCase()}
              </span>
              <p className="font-bold text-slate-900 text-[11px]">{cfg.label.split(" (")[0]}</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">{cfg.location}</p>
            </div>
          ))}
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {savedNotice}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase">
              {editingId ? "Editar Anuncio / Banner" : "Crear Nuevo Anuncio / Banner"}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Cancelar edición
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitCMS} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                TIPO Y UBICACIÓN EN EL SITIO
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value="notice">Aviso Notificación (Portal Cliente + Portada)</option>
                <option value="banner">Banner Promocional (Portal Cliente + Promociones)</option>
                <option value="promo">Promoción Destacada (Sección Promociones Web)</option>
                <option value="hero_banner">Hero Principal (Carrusel Superior Portada)</option>
              </select>
              <p className="text-[10px] text-amber-800 font-semibold mt-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                📍 {currentTypeInfo.location}
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                TÍTULO *
              </label>
              <input
                type="text"
                placeholder="Ej. Descuento del 20% en Envíos Aéreos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                DESCRIPCIÓN *
              </label>
              <textarea
                rows={3}
                placeholder="Detalles de la oferta o comunicado..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {(type === "promo" || type === "banner") && (
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  URL DE IMAGEN (OPCIONAL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={publishImmediately}
                  onChange={(e) => setPublishImmediately(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <span>{publishImmediately ? "Estado: Publicado (Visible)" : "Estado: Borrador (Oculto)"}</span>
              </label>

              <button
                type="button"
                onClick={() => setShowPreview((prev) => !prev)}
                className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> {showPreview ? "Ocultar vista previa" : "Previsualizar"}
              </button>
            </div>

            {/* Previsualización antes de publicar */}
            {showPreview && (title || description) && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5 border border-slate-800">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block">
                  VISTA PREVIA ({type.toUpperCase()})
                </span>
                <h4 className="text-xs font-black">{title || "Sin título"}</h4>
                <p className="text-[11px] text-slate-300">{description || "Sin descripción"}</p>
              </div>
            )}

            <Button type="submit" variant="amber" className="w-full py-3 font-bold text-xs uppercase shadow-md">
              {editingId ? (
                <>
                  <Save className="w-4 h-4 mr-1.5" /> GUARDAR CAMBIOS EN CMS
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />{" "}
                  {publishImmediately ? "PUBLICAR ANUNCIO EN CMS" : "GUARDAR BORRADOR"}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Banners List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase">
            Anuncios y Promociones Registradas ({items.length})
          </h3>

          {loading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              <span className="text-xs font-bold">Cargando publicaciones CMS...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const normType = (item.type || "banner").toLowerCase();
                const cfg = CMS_TYPE_CONFIG[normType] || CMS_TYPE_CONFIG.banner;
                const isPublished = item.active !== false;

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl p-6 border shadow-sm space-y-3 transition-all ${
                      isPublished ? "border-slate-200" : "border-dashed border-slate-300 opacity-75"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${cfg.badgeClass}`}>
                          {item.type}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            isPublished
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isPublished ? "● Publicado" : "○ Borrador"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 flex items-center gap-1 transition-colors"
                          title={isPublished ? "Despublicar (pasar a borrador)" : "Publicar en el sitio"}
                        >
                          {isPublished ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-slate-500" /> Despublicar
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" /> Publicar
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-2 rounded-xl text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                          title="Editar contenido"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCMS(item.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar contenido"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">{item.description}</p>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium">
                      Ubicación: {cfg.location}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
