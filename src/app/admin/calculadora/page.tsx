"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Save, CheckCircle2, Loader2, Globe, MapPin, AlertCircle, RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ApiCity {
  id: string;
  name: string;
}

interface ApiCountry {
  id: string;
  name: string;
  cities: ApiCity[];
}

interface ApiRateConfig {
  id?: string;
  serviceType: string;
  countryId?: string | null;
  cityId?: string | null;
  basePrice: number;
  pricePerKg: number;
  pricePerCubicFeet?: number;
  insuranceRate: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminCalculadoraPage() {
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  const [rates, setRates] = useState<ApiRateConfig[]>([]);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  // Form for editing rates
  const [selectedService, setSelectedService] = useState("Aéreo Express");
  const [basePrice, setBasePrice] = useState(25.0);
  const [pricePerKg, setPricePerKg] = useState(8.5);
  const [pricePerCubicFeet, setPricePerCubicFeet] = useState(3.5);
  const [insuranceRate, setInsuranceRate] = useState(0.02);
  const [estimatedDaysMin, setEstimatedDaysMin] = useState(3);
  const [estimatedDaysMax, setEstimatedDaysMax] = useState(5);

  const activeCountry = countries.find((c) => c.id === selectedCountryId);
  const activeCity = activeCountry?.cities?.find((ct) => ct.id === selectedCityId);

  const fetchCountries = async () => {
    try {
      const res = await fetch(`${API_URL}/destinations/countries`);
      if (res.ok) {
        const data = await res.json();
        setCountries(data);
      }
    } catch {
      console.error("Error cargando países");
    }
  };

  const fetchRates = (countryId?: string, cityId?: string) => {
    setLoading(true);
    let url = `${API_URL}/rates`;
    const params = new URLSearchParams();
    if (cityId) params.append("cityId", cityId);
    else if (countryId) params.append("countryId", countryId);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let rateList: ApiRateConfig[] = [];
        if (data && data.rates) rateList = data.rates;
        else if (Array.isArray(data)) rateList = data;

        setIsCustom(!!data.isCustom);
        setRates(rateList);

        if (rateList.length > 0) {
          const first = rateList.find((r) => r.serviceType === selectedService) || rateList[0];
          setSelectedService(first.serviceType);
          setBasePrice(first.basePrice);
          setPricePerKg(first.pricePerKg);
          setPricePerCubicFeet(first.pricePerCubicFeet || 3.5);
          setInsuranceRate(first.insuranceRate || 0.02);
          setEstimatedDaysMin(first.estimatedDaysMin || 3);
          setEstimatedDaysMax(first.estimatedDaysMax || 5);
        }
      })
      .catch(() => {
        setIsCustom(false);
        setRates([
          { serviceType: "Aéreo Express", basePrice: 25.0, pricePerKg: 8.5, pricePerCubicFeet: 0.0, insuranceRate: 0.02, estimatedDaysMin: 2, estimatedDaysMax: 4 },
          { serviceType: "Aéreo Estándar", basePrice: 15.0, pricePerKg: 5.5, pricePerCubicFeet: 0.0, insuranceRate: 0.02, estimatedDaysMin: 5, estimatedDaysMax: 7 },
          { serviceType: "Marítimo", basePrice: 10.0, pricePerKg: 3.0, pricePerCubicFeet: 4.5, insuranceRate: 0.02, estimatedDaysMin: 15, estimatedDaysMax: 25 },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchRates(selectedCountryId, selectedCityId);
  }, [selectedCountryId, selectedCityId]);

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    const found = rates.find((r) => r.serviceType === serviceName);
    if (found) {
      setBasePrice(found.basePrice);
      setPricePerKg(found.pricePerKg);
      setPricePerCubicFeet(found.pricePerCubicFeet || (serviceName === "Marítimo" ? 4.5 : 0.0));
      setInsuranceRate(found.insuranceRate || 0.02);
      setEstimatedDaysMin(found.estimatedDaysMin || (serviceName.includes("Express") ? 2 : serviceName.includes("Marítimo") ? 15 : 5));
      setEstimatedDaysMax(found.estimatedDaysMax || (serviceName.includes("Express") ? 4 : serviceName.includes("Marítimo") ? 25 : 7));
    }
  };

  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;

    if (token) {
      try {
        const res = await fetch(`${API_URL}/rates`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceType: selectedService,
            countryId: selectedCountryId || null,
            cityId: selectedCityId || null,
            basePrice: Number(basePrice),
            pricePerKg: Number(pricePerKg),
            pricePerCubicFeet: Number(pricePerCubicFeet),
            insuranceRate: Number(insuranceRate),
            estimatedDaysMin: Number(estimatedDaysMin),
            estimatedDaysMax: Number(estimatedDaysMax),
          }),
        });
        if (res.ok) {
          const destName = activeCity
            ? `${activeCity.name}, ${activeCountry?.name}`
            : activeCountry
            ? activeCountry.name
            : "Tarifas Globales";
          setNoticeMsg(`Tarifa '${selectedService}' guardada correctamente para ${destName}.`);
          fetchRates(selectedCountryId, selectedCityId);
          setTimeout(() => setNoticeMsg(null), 4000);
        }
      } catch {
        setNoticeMsg("Error al actualizar tarifas.");
      }
    }
  };

  const handleResetToGlobal = async () => {
    if (!selectedCountryId && !selectedCityId) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;

    if (token) {
      const params = new URLSearchParams();
      if (selectedCityId) params.append("cityId", selectedCityId);
      else if (selectedCountryId) params.append("countryId", selectedCountryId);

      try {
        const res = await fetch(`${API_URL}/rates?${params.toString()}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          setNoticeMsg("Tarifas personalizadas eliminadas. El destino ahora usa las Tarifas Globales.");
          fetchRates(selectedCountryId, selectedCityId);
          setTimeout(() => setNoticeMsg(null), 4000);
        }
      } catch {
        setNoticeMsg("Error al restablecer tarifas.");
      }
    }
  };

  // Label construction for location
  const locationLabel = activeCity
    ? `${activeCountry?.name} ➔ ${activeCity.name}`
    : activeCountry
    ? activeCountry.name
    : "TARIFA GENERAL ESTÁNDAR (GLOBAL POR DEFECTO)";

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Configuración de Tarifas Logísticas</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            MATRIZ DE PRECIOS DINÁMICOS POR PAÍS Y CIUDAD DE DESTINO
          </span>
        </div>
      </div>

      {/* 1. Selector Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-500" /> Seleccionar Destino para Configurar Tarifas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
              País de Destino
            </label>
            <select
              value={selectedCountryId}
              onChange={(e) => {
                setSelectedCountryId(e.target.value);
                setSelectedCityId("");
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value="">🌐 Tarifa General Estándar (Global por Defecto)</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  📍 {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
              Ciudad / Agencia Específica (Opcional)
            </label>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              disabled={!selectedCountryId || !activeCountry?.cities?.length}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 disabled:opacity-40"
            >
              <option value="">-- Todas las ciudades de {activeCountry?.name || "este país"} --</option>
              {activeCountry?.cities?.map((city) => (
                <option key={city.id} value={city.id}>
                  🏙️ {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {noticeMsg}
        </div>
      )}

      {/* 2. Prominent Destination Context & Status Banner */}
      <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
        !selectedCountryId
          ? "bg-amber-500/10 border-amber-300 text-amber-950"
          : isCustom
          ? "bg-emerald-500/10 border-emerald-300 text-emerald-950"
          : "bg-slate-200/60 border-slate-300 text-slate-900"
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest opacity-60">DESTINO ACTUALMENTE SELECCIONADO</span>
            {selectedCountryId && (
              isCustom ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 border border-emerald-300">
                  🟢 Tarifa Personalizada Activa
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-300 text-slate-800 border border-slate-400">
                  ℹ️ Usando Tarifa Global por Defecto
                </span>
              )
            )}
          </div>

          <h2 className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
            {!selectedCountryId ? <Globe className="w-6 h-6 text-amber-600" /> : <MapPin className="w-6 h-6 text-emerald-600" />}
            {locationLabel}
          </h2>

          <p className="text-xs font-medium opacity-80">
            {!selectedCountryId
              ? "Esta tarifa global aplica a cualquier nuevo país o destino que no tenga precios personalizados guardados."
              : isCustom
              ? `Este destino tiene precios personalizados configurados exclusivamente para ${locationLabel}.`
              : `Este destino no tiene precios personalizados guardados. Actualmente utiliza los precios globales por defecto.`}
          </p>
        </div>

        {/* Status Action Buttons */}
        {selectedCountryId && (
          <div>
            {isCustom ? (
              <button
                type="button"
                onClick={handleResetToGlobal}
                className="px-4 py-2.5 rounded-2xl bg-white border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RESTABLECER Y VOLVER A TARIFA GLOBAL
              </button>
            ) : (
              <span className="px-4 py-2 rounded-2xl bg-white/80 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-amber-600" /> Edita abajo para personalizar este destino
              </span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Cargando tarifas de {locationLabel}...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Rate Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                Modalidades para {activeCountry ? activeCountry.name : "Tarifa Global"}
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {rates.length} SERVICIOS
              </span>
            </div>

            {rates.map((r) => (
              <div
                key={r.serviceType}
                onClick={() => handleSelectService(r.serviceType)}
                className={`p-5 rounded-3xl bg-white border-2 shadow-sm space-y-2 cursor-pointer transition-all ${
                  selectedService === r.serviceType ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{r.serviceType}</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {selectedCountryId ? locationLabel : "Global General"}
                    </span>
                  </div>
                  <span className="text-sm font-mono font-black text-amber-600">${r.pricePerKg} USD/kg</span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between pt-2 border-t border-slate-100 font-bold">
                  <span>Base: <strong>${r.basePrice} USD</strong></span>
                  <span>Seguro: <strong>{((r.insuranceRate || 0.02) * 100).toFixed(1)}%</strong></span>
                  <span>Tránsito: <strong>{r.estimatedDaysMin || 3}-{r.estimatedDaysMax || 5} días</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Rate Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600" /> Editar Tarifas: {selectedService}
              </h3>
              <span className="text-[11px] font-bold text-slate-400 block mt-0.5">
                Destino asignado: <strong className="text-amber-800">{locationLabel}</strong>
              </span>
            </div>

            <form onSubmit={handleSaveRates} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                  Tipo de Servicio / Modalidad
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => handleSelectService(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-bold text-slate-900"
                >
                  <option value="Aéreo Express">Aéreo Express</option>
                  <option value="Aéreo Estándar">Aéreo Estándar</option>
                  <option value="Marítimo">Marítimo</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Precio Base Fijo ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Precio por Kilogramo ($ USD/kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              {selectedService === "Marítimo" && (
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Precio por Pie Cúbico ($ USD / ft³)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricePerCubicFeet}
                    onChange={(e) => setPricePerCubicFeet(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Seguro (Tasa 0.02 = 2%)
                  </label>
                  <input
                    type="number"
                    step="0.005"
                    value={insuranceRate}
                    onChange={(e) => setInsuranceRate(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Días Mín. Tránsito
                  </label>
                  <input
                    type="number"
                    value={estimatedDaysMin}
                    onChange={(e) => setEstimatedDaysMin(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Días Máx. Tránsito
                  </label>
                  <input
                    type="number"
                    value={estimatedDaysMax}
                    onChange={(e) => setEstimatedDaysMax(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="amber" className="w-full py-4 justify-center font-bold text-xs uppercase shadow-md">
                <Save className="w-4 h-4 mr-2" />
                {selectedCountryId
                  ? `GUARDAR TARIFAS PARA ${activeCountry?.name || "ESTE PAÍS"}`
                  : "GUARDAR TARIFAS GLOBALES GENERALES"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
