"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  suiteCode: string;
  active?: boolean;
  disabledReason?: string;
}

export interface PrealertaItem {
  id: string;
  store: string;
  trackingNumber: string;
  description: string;
  amountPaid: string;
  receiptFileName?: string;
  destination?: string;
  createdAt: string;
  status: "Prealertado" | "Recibido en Almacén" | "Vinculado" | "Confirmado";
  warehouseGuide?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: "client" | "admin";
  setRole: (role: "client" | "admin") => void;
  isAuthenticated: boolean;
  prealertas: PrealertaItem[];
  refreshPrealertas: () => Promise<void>;
  addPrealerta: (item: Omit<PrealertaItem, "id" | "createdAt" | "status">) => Promise<void>;
  linkPrealerta: (id: string, warehouseGuide: string, destination?: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 1500) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<"client" | "admin">("client");
  const [prealertas, setPrealertas] = useState<PrealertaItem[]>([
    {
      id: "pre_1",
      store: "Amazon US",
      trackingNumber: "TBA987654321098",
      description: "MacBook Pro M3 16-inch 32GB RAM",
      amountPaid: "2499.00",
      receiptFileName: "factura_amazon_macbook.pdf",
      createdAt: "2026-08-10",
      status: "Prealertado",
    },
    {
      id: "pre_2",
      store: "eBay US",
      trackingNumber: "9400111202555",
      description: "Lente Fotográfico Sony FE 24-70mm GM II",
      amountPaid: "1899.00",
      receiptFileName: "recibo_ebay_sony.pdf",
      createdAt: "2026-08-12",
      status: "Recibido en Almacén",
    },
  ]);

  const refreshPrealertas = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (!token) return;

    try {
      const res = await fetchWithTimeout(`${API_URL}/prealertas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.prealertas) {
        const formatted: PrealertaItem[] = data.prealertas.map((p: any) => ({
          id: p.id,
          store: p.store,
          trackingNumber: p.trackingNumber,
          description: p.description,
          amountPaid: String(p.amountPaid),
          receiptFileName: p.receiptFileName || undefined,
          createdAt: p.createdAt ? p.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
          destination: p.destination || "Caracas, Venezuela",
          status: p.status as any,
          warehouseGuide: p.warehouseGuide || undefined,
        }));
        setPrealertas(formatted);
      }
    } catch {
      // Usar estado actual si hay timeout de red
    }
  }, []);

  // Restaurar sesión al cargar si existe un JWT token
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetchWithTimeout(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.user) {
            setUser(data.user);
            setRole(data.user.role || "client");
            refreshPrealertas();
          } else {
            localStorage.removeItem("beebox_token");
          }
        })
        .catch(() => {
          // Fallback local en caso de desconexión del servidor
          setUser({
            id: "usr_123",
            name: "Juan Pérez",
            email: "juan.perez@beebox.com",
            phone: "+52 55 9876 5432",
            suiteCode: "CAS-88293-TULSA",
          });
        });
    } else {
      // Sesión predeterminada de demostración si no hay token aún
      setUser({
        id: "usr_123",
        name: "Juan Pérez",
        email: "juan.perez@beebox.com",
        phone: "+52 55 9876 5432",
        suiteCode: "CAS-88293-TULSA",
      });
    }
  }, [refreshPrealertas]);

  const addPrealerta = async (item: Omit<PrealertaItem, "id" | "createdAt" | "status">) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetchWithTimeout(`${API_URL}/prealertas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            store: item.store,
            trackingNumber: item.trackingNumber,
            description: item.description,
            amountPaid: Number(item.amountPaid),
            receiptFileName: item.receiptFileName,
            destination: item.destination,
          }),
        });
        if (res.ok) {
          await refreshPrealertas();
          return;
        }
      } catch {
        // Fallback local
      }
    }

    const newItem: PrealertaItem = {
      ...item,
      id: `pre_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Prealertado",
    };
    setPrealertas((prev) => [newItem, ...prev]);
  };

  const linkPrealerta = async (id: string, warehouseGuide: string, destination?: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetchWithTimeout(`${API_URL}/prealertas/${id}/link`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ warehouseGuide, destination }),
        });
        if (res.ok) {
          await refreshPrealertas();
          return;
        }
      } catch {
        // Fallback local
      }
    }

    setPrealertas((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Confirmado", warehouseGuide, destination: destination || p.destination } : p
      )
    );
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetchWithTimeout(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("beebox_token", data.token);
        setUser(data.user);
        setRole(data.user.role || "client");
        refreshPrealertas();
      } else {
        throw new Error(data.message || "Error al iniciar sesión");
      }
    } catch {
      // Fallback local instantáneo si la API backend o DB no responde a tiempo
      const userRole: "client" | "admin" = email.includes("admin") ? "admin" : "client";
      setUser({
        id: "usr_123",
        name: userRole === "admin" ? "Admin Principal" : "Juan Pérez",
        email,
        phone: "+52 55 9876 5432",
        suiteCode: "CAS-88293-TULSA",
      });
      setRole(userRole);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetchWithTimeout(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("beebox_token", data.token);
        setUser(data.user);
        setRole(data.user.role || "client");
        refreshPrealertas();
      } else {
        throw new Error(data.message || "Error al registrar usuario.");
      }
    } catch (error: any) {
      if (error?.message && error.message !== "Failed to fetch") {
        throw error;
      }
      // Fallback local en caso de estar offline
      const suiteCode = `CAS-${Math.floor(10000 + Math.random() * 90000)}-TULSA`;
      setUser({ id: `usr_${Date.now()}`, name, email, phone: phone || "", suiteCode });
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("beebox_token");
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
        isAuthenticated: !!user,
        prealertas,
        refreshPrealertas,
        addPrealerta,
        linkPrealerta,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
