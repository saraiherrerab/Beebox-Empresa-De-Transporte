"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Save, CheckCircle2, Loader2, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ApiCity {
  id: string;
  name: string;
}

interface ApiCountry {
  id: string;
  name: string;
  flagEmoji?: string;
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
        if (Array.isArray(data)) rateList = data;
        else if (data && data.rates) rateList = data.rates;

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
          const destName = selectedCityId
            ? "Ciudad Seleccionada"
            : selectedCountryId
            ? "País Seleccionado"
            : "Global";
          setNoticeMsg(`Tarifas para '${selectedService}' (${destName}) guardadas correctamente.`);
          fetchRates(selectedCountryId, selectedCityId);
          setTimeout(() => setNoticeMsg(null), 4000);
        }
      } catch {
        setNoticeMsg("Error al actualizar tarifas.");
      }
    }
  };

  const activeCountry = countries.find((c) => c.id === selectedCountryId);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configuración de Tarifas Dinámicas</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Administra precios por kilogramo, tarifa base, flete marítimo y seguro según el **Destino Geográfico**.
          </p>
        </div>
      </div>

      {/* Destination Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-500" /> Seleccionar Destino a Configurar
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">País de Destino</label>
            <select
              value={selectedCountryId}
              onChange={(e) => {
                setSelectedCountryId(e.target.value);
                setSelectedCityId("");
              }}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value="">🌐 Tarifas Globales por Defecto</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Ciudad / Agencia Especifica (Opcional)</label>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              disabled={!selectedCountryId || !activeCountry?.cities?.length}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 disabled:opacity-50"
            >
              <option value="">Todas las ciudades de {activeCountry?.name || "este país"}</option>
              {activeCountry?.cities?.map((city) => (
                <option key={city.id} value={city.id}>
                  📍 {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {noticeMsg}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Cargando tarifas del destino...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Rate Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase">Modalidades Configuradas</h3>
            {rates.map((r) => (
              <div
                key={r.serviceType}
                onClick={() => handleSelectService(r.serviceType)}
                className={`p-5 rounded-3xl bg-white border-2 shadow-sm space-y-2 cursor-pointer transition-all ${
                  selectedService === r.serviceType ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900">{r.serviceType}</h4>
                  <span className="text-xs font-mono font-black text-amber-600">${r.pricePerKg} USD/kg</span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-100">
                  <span>Base: <strong>${r.basePrice} USD</strong></span>
                  <span>Seguro: <strong>{(r.insuranceRate * 100).toFixed(1)}%</strong></span>
                  <span>Tránsito: <strong>{r.estimatedDaysMin || 3}-{r.estimatedDaysMax || 5} días</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Rate Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-600" /> Editar Tarifa: {selectedService}
            </h3>

            <form onSubmit={handleSaveRates} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tipo de Servicio / Modalidad
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => handleSelectService(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-bold text-slate-900"
                >
                  <option value="Aéreo Express">Aéreo Express</option>
                  <option value="Aéreo Estándar">Aéreo Estándar</option>
                  <option value="Marítimo">Marítimo</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Precio Base Fijo ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Precio por Kilogramo ($ USD/kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              {selectedService === "Marítimo" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Precio por Pie Cúbico ($ USD / ft³)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricePerCubicFeet}
                    onChange={(e) => setPricePerCubicFeet(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Seguro (Tasa Decimal 0.02 = 2%)
                  </label>
                  <input
                    type="number"
                    step="0.005"
                    value={insuranceRate}
                    onChange={(e) => setInsuranceRate(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Días Mín. Tránsito
                  </label>
                  <input
                    type="number"
                    value={estimatedDaysMin}
                    onChange={(e) => setEstimatedDaysMin(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Días Máx. Tránsito
                  </label>
                  <input
                    type="number"
                    value={estimatedDaysMax}
                    onChange={(e) => setEstimatedDaysMax(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="amber" className="w-full py-4 justify-center font-bold text-xs uppercase shadow-md">
                <Save className="w-4 h-4 mr-2" /> GUARDAR TARIFAS DE ESTE DESTINO
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
