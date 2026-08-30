"use client";

import React, { useState, useEffect } from "react";
import { Globe, Plus, CheckCircle2, Loader2, MapPin, Building2, ChevronRight, Edit3, Trash2, AlertTriangle, X, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

interface ApiCity {
  id: string;
  name: string;
  active: boolean;
}

interface ApiCountry {
  id: string;
  name: string;
  code?: string;
  flagEmoji?: string;
  active: boolean;
  cities: ApiCity[];
}

interface ApiRoute {
  id: string;
  name: string;
  originCity: string;
  destCity: string;
  status: string;
}

interface DeleteConfirmationState {
  type: "country" | "city";
  id: string;
  name: string;
  step: 1 | 2; // Step 1: ¿Seguro?, Step 2: ¿Seguro seguro?
}

import { API_URL } from "@/config/api";

const MOCK_COUNTRIES: ApiCountry[] = [
  {
    id: "c_1",
    name: "Venezuela",
    code: "VE",
    flagEmoji: "🇻🇪",
    active: true,
    cities: [
      { id: "ct_1", name: "Caracas", active: true },
      { id: "ct_2", name: "Maracaibo", active: true },
      { id: "ct_3", name: "Valencia", active: true },
      { id: "ct_4", name: "Barquisimeto", active: true },
    ],
  },
  {
    id: "c_2",
    name: "Colombia",
    code: "CO",
    flagEmoji: "🇨🇴",
    active: true,
    cities: [
      { id: "ct_5", name: "Bogotá", active: true },
      { id: "ct_6", name: "Medellín", active: true },
      { id: "ct_7", name: "Cali", active: true },
    ],
  },
];

const MOCK_ROUTES: ApiRoute[] = [
  { id: "r_1", name: "Ruta Caracas, VE", originCity: "Broken Arrow, OK", destCity: "Caracas, Venezuela", status: "ACTIVA" },
  { id: "r_2", name: "Ruta Bogotá, CO", originCity: "Broken Arrow, OK", destCity: "Bogotá, Colombia", status: "ACTIVA" },
  { id: "r_3", name: "Ruta Maracaibo, VE", originCity: "Broken Arrow, OK", destCity: "Maracaibo, Venezuela", status: "ACTIVA" },
  { id: "r_4", name: "Ruta Valencia, VE", originCity: "Broken Arrow, OK", destCity: "Valencia, Venezuela", status: "ACTIVA" },
];

export default function AdminRutasPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin" || user?.email?.includes("super");

  const [countries, setCountries] = useState<ApiCountry[]>(MOCK_COUNTRIES);
  const [routes, setRoutes] = useState<ApiRoute[]>(MOCK_ROUTES);
  const [loading, setLoading] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  // Forms visibility
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  // Edit states
  const [editingCountry, setEditingCountry] = useState<ApiCountry | null>(null);
  const [editingCity, setEditingCity] = useState<{ id: string; name: string } | null>(null);

  // Double Delete Confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmationState | null>(null);

  // Country form state
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [flagEmoji, setFlagEmoji] = useState("🌐");

  // City form state
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [cityName, setCityName] = useState("");

  const fetchData = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      fetch(`${API_URL}/destinations/countries`, { headers }).then((res) => res.json()).catch(() => null),
      fetch(`${API_URL}/routes`, { headers }).then((res) => res.json()).catch(() => null),
    ])
      .then(([countriesData, routesData]) => {
        if (Array.isArray(countriesData) && countriesData.length > 0) setCountries(countriesData);
        if (Array.isArray(routesData) && routesData.length > 0) setRoutes(routesData);
        else if (routesData && routesData.routes && Array.isArray(routesData.routes) && routesData.routes.length > 0) setRoutes(routesData.routes);
      })
      .catch((err) => {
        console.error("Error cargando destinos:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateCountry = () => {
    setEditingCountry(null);
    setCountryName("");
    setCountryCode("");
    setFlagEmoji("🌐");
    setShowCountryModal(true);
  };

  const openEditCountry = (c: ApiCountry) => {
    setEditingCountry(c);
    setCountryName(c.name);
    setCountryCode(c.code || "");
    setFlagEmoji(c.flagEmoji || "🌐");
    setShowCountryModal(true);
  };

  const handleSaveCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryName) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const isEdit = !!editingCountry;
        const url = isEdit
          ? `${API_URL}/destinations/countries/${editingCountry.id}`
          : `${API_URL}/destinations/countries`;
        const method = isEdit ? "PATCH" : "POST";

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: countryName,
            code: countryCode,
            flagEmoji,
          }),
        });

        if (res.ok) {
          setNoticeMsg(`País '${countryName}' ${isEdit ? "actualizado" : "registrado"} exitosamente.`);
          setCountryName("");
          setCountryCode("");
          setShowCountryModal(false);
          setEditingCountry(null);
          fetchData();
          setTimeout(() => setNoticeMsg(null), 4000);
        }
      } catch {
        setNoticeMsg("Error al guardar país.");
      }
    }
  };

  const openEditCity = (city: ApiCity) => {
    setEditingCity({ id: city.id, name: city.name });
  };

  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCity || !editingCity.name) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetch(`${API_URL}/destinations/cities/${editingCity.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingCity.name,
          }),
        });

        if (res.ok) {
          setNoticeMsg(`Ciudad actualizada correctamente.`);
          setEditingCity(null);
          fetchData();
          setTimeout(() => setNoticeMsg(null), 4000);
        }
      } catch {
        setNoticeMsg("Error al actualizar ciudad.");
      }
    }
  };

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountryId || !cityName) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetch(`${API_URL}/destinations/cities`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            countryId: selectedCountryId,
            name: cityName,
          }),
        });
        if (res.ok) {
          setNoticeMsg(`Ciudad '${cityName}' añadida al destino.`);
          setCityName("");
          setShowCityModal(false);
          fetchData();
          setTimeout(() => setNoticeMsg(null), 4000);
        }
      } catch {
        setNoticeMsg("Error al registrar ciudad.");
      }
    }
  };

  // Double Delete Handlers
  const requestDeleteCountry = (c: ApiCountry) => {
    setDeleteConfirm({
      type: "country",
      id: c.id,
      name: c.name,
      step: 1,
    });
  };

  const requestDeleteCity = (city: ApiCity, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({
      type: "city",
      id: city.id,
      name: city.name,
      step: 1,
    });
  };

  const handleProceedDeleteStep2 = () => {
    if (deleteConfirm) {
      setDeleteConfirm({
        ...deleteConfirm,
        step: 2,
      });
    }
  };

  const handleFinalDelete = async () => {
    if (!deleteConfirm) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (!token) return;

    const endpoint = deleteConfirm.type === "country"
      ? `${API_URL}/destinations/countries/${deleteConfirm.id}`
      : `${API_URL}/destinations/cities/${deleteConfirm.id}`;

    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setNoticeMsg(`${deleteConfirm.type === "country" ? "País" : "Ciudad"} '${deleteConfirm.name}' eliminado permanentemente.`);
        setDeleteConfirm(null);
        fetchData();
        setTimeout(() => setNoticeMsg(null), 4000);
      }
    } catch {
      setNoticeMsg("Error al eliminar el elemento.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestión de Países y Destinos</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            CONFIGURACIÓN Y EDICIÓN DE RED LOGÍSTICA INTERNACIONAL
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isSuperAdmin ? (
            <>
              <Button
                onClick={openCreateCountry}
                variant="outline"
                className="rounded-2xl font-bold text-xs bg-white border-slate-200"
              >
                <Globe className="w-4 h-4 mr-1 text-amber-500" /> REGISTRAR PAÍS
              </Button>

              <Button
                onClick={() => setShowCityModal(true)}
                variant="amber"
                className="rounded-2xl font-bold text-xs"
              >
                <Plus className="w-4 h-4 mr-1" /> AÑADIR CIUDAD / AGENCIA
              </Button>
            </>
          ) : (
            <div className="px-3.5 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Eye className="w-4 h-4 text-amber-400" /> Modo Consulta (Solo Lectura)
            </div>
          )}
        </div>
      </div>

      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {noticeMsg}
        </div>
      )}

      {/* Double Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              {deleteConfirm.step === 1 ? (
                <>
                  <h3 className="text-lg font-black text-slate-900">¿Seguro que deseas eliminar?</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Estás a punto de borrar <strong className="text-slate-900">{deleteConfirm.name}</strong>. Esta acción afectará las rutas configuradas.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-black text-rose-600 uppercase tracking-tight">¿Seguro seguro? ⚠️</h3>
                  <p className="text-xs text-slate-700 font-bold leading-relaxed bg-rose-50 p-3 rounded-2xl border border-rose-200">
                    ¡Esta es la confirmación definitiva! Se eliminarán permanentemente las tarifas y rutas logísticas vinculadas a <strong className="text-rose-900">{deleteConfirm.name}</strong>.
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                CANCELAR
              </button>

              {deleteConfirm.step === 1 ? (
                <button
                  type="button"
                  onClick={handleProceedDeleteStep2}
                  className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors shadow-md"
                >
                  SÍ, CONTINUAR
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalDelete}
                  className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-black text-xs hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/30"
                >
                  SÍ, ELIMINAR AHORA
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal / Form: Crear/Editar País */}
      {showCountryModal && (
        <form onSubmit={handleSaveCountry} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 animate-in slide-in-from-top-4">
          <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-500" /> {editingCountry ? `Editar País: ${editingCountry.name}` : "Registrar Nuevo País de Destino"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Nombre del País</label>
              <input
                type="text"
                placeholder="Ej. Venezuela"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Código ISO (2 letras)</label>
              <input
                type="text"
                placeholder="Ej. VE"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowCountryModal(false);
                setEditingCountry(null);
              }}
              className="text-xs font-bold text-slate-400"
            >
              CANCELAR
            </button>
            <Button type="submit" variant="amber" className="rounded-xl px-6 py-2 text-xs font-bold">
              {editingCountry ? "GUARDAR CAMBIOS" : "GUARDAR PAÍS"}
            </Button>
          </div>
        </form>
      )}

      {/* Modal / Form: Editar Ciudad Inline Popup */}
      {editingCity && (
        <form onSubmit={handleSaveCity} className="bg-amber-50/80 p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-amber-900 uppercase flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-600" /> Editar Nombre de Ciudad / Agencia
            </h3>
            <button type="button" onClick={() => setEditingCity(null)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              value={editingCity.name}
              onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
              className="flex-1 p-3 rounded-xl border border-amber-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
              required
            />
            <Button type="submit" variant="amber" className="rounded-xl px-5 py-2.5 text-xs font-bold">
              <Save className="w-3.5 h-3.5 mr-1" /> GUARDAR
            </Button>
          </div>
        </form>
      )}

      {/* Modal / Form: Crear Ciudad */}
      {showCityModal && (
        <form onSubmit={handleCreateCity} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 animate-in slide-in-from-top-4">
          <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-500" /> Añadir Ciudad / Agencia a País
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Seleccionar País</label>
              <select
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 bg-white"
                required
              >
                <option value="">-- Elige un País --</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code || "INT"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Nombre de la Ciudad</label>
              <input
                type="text"
                placeholder="Ej. Caracas"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCityModal(false)} className="text-xs font-bold text-slate-400">
              CANCELAR
            </button>
            <Button type="submit" variant="amber" className="rounded-xl px-6 py-2 text-xs font-bold">
              GUARDAR CIUDAD
            </Button>
          </div>
        </form>
      )}

      {/* Main Countries & Cities Display */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Cargando catálogo de países y destinos...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-500" /> Países y Destinos Habilitados ({countries.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {countries.map((c) => (
              <div key={c.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">{c.name}</h3>
                      <span className="text-[10px] font-mono font-bold text-slate-400">CÓDIGO: {c.code || "N/A"}</span>
                    </div>
                  </div>

                  {/* Compact Pencil & Trash Action Buttons Together in Top Right Corner */}
                  {isSuperAdmin && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditCountry(c)}
                        title="Editar país"
                        className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => requestDeleteCountry(c)}
                        title="Eliminar país"
                        className="p-2 rounded-xl bg-slate-100 text-rose-600 hover:bg-rose-100 hover:text-rose-800 border border-slate-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Ciudades / Agencias ({c.cities?.length || 0})
                    </span>
                    {isSuperAdmin && (
                      <button
                        onClick={() => {
                          setSelectedCountryId(c.id);
                          setShowCityModal(true);
                        }}
                        className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 text-[10px] font-extrabold hover:bg-amber-100 transition-colors flex items-center gap-1 border border-amber-200"
                      >
                        <Plus className="w-3 h-3" /> Agregar Ciudad
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.cities && c.cities.length > 0 ? (
                      c.cities.map((city) => (
                        <div
                          key={city.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-amber-50/50 transition-all group"
                        >
                          <button
                            onClick={() => openEditCity(city)}
                            title="Haz clic para renombrar ciudad"
                            className="inline-flex items-center gap-1.5 hover:text-amber-900"
                          >
                            <MapPin className="w-3 h-3 text-amber-500 group-hover:scale-110 transition-transform" />
                            <span>{city.name}</span>
                          </button>

                          <button
                            onClick={(e) => requestDeleteCity(city, e)}
                            title="Eliminar ciudad"
                            className="p-0.5 text-slate-400 hover:text-rose-600 transition-colors border-l border-slate-200/80 pl-1.5 ml-0.5"
                          >
                            <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-600" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">No hay ciudades registradas.</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Logistics Routes Section */}
          <div className="pt-6 border-t border-slate-200/80 space-y-4">
            <h3 className="text-base font-black text-slate-900 uppercase">Rutas de Transporte Activas ({routes.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{r.name}</h4>
                      <span className="text-[11px] font-bold text-slate-500 block mt-0.5">
                        {r.originCity} <ChevronRight className="w-3 h-3 inline text-amber-500" /> <strong className="text-amber-800">{r.destCity}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
