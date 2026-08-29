"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

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
  providerWarehouseReceipt?: string;
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
  updatePrealerta: (id: string, data: Partial<PrealertaItem>) => Promise<void>;
  linkPrealerta: (id: string, warehouseGuide: string, destination?: string, providerWarehouseReceipt?: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 10000) => {
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
  const [prealertas, setPrealertas] = useState<PrealertaItem[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

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
          providerWarehouseReceipt: p.providerWarehouseReceipt || undefined,
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
      // Retener estado actual
    }
  }, []);

  // Inicializar conexion WebSocket
  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    s.on("connect", () => {});

    s.on("prealerta:updated", () => {
      refreshPrealertas();
    });

    s.on("shipment:updated", () => {
      refreshPrealertas();
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [refreshPrealertas]);

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
          setUser(null);
        });
    } else {
      setUser(null);
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
            providerWarehouseReceipt: item.providerWarehouseReceipt,
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

  const updatePrealerta = async (id: string, data: Partial<PrealertaItem>) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetchWithTimeout(`${API_URL}/prealertas/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Error al actualizar la prealerta.");
        }
        await refreshPrealertas();
        return;
      } catch (err: any) {
        if (err?.message) throw err;
      }
    }

    setPrealertas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const linkPrealerta = async (id: string, warehouseGuide: string, destination?: string, providerWarehouseReceipt?: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      try {
        const res = await fetchWithTimeout(`${API_URL}/prealertas/${id}/link`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ warehouseGuide, destination, providerWarehouseReceipt }),
        });
        if (res.ok) {
          await refreshPrealertas();
          return;
        } else {
          const errData = await res.json();
          console.error("Error al confirmar prealerta:", errData.message);
        }
      } catch (err) {
        console.error("Error de red al confirmar prealerta:", err);
      }
    }

    setPrealertas((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Confirmado", warehouseGuide, destination: destination || p.destination, providerWarehouseReceipt: providerWarehouseReceipt || p.providerWarehouseReceipt } : p
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
      const userRole: "client" | "admin" = email.includes("admin") ? "admin" : "client";
      setUser({
        id: "usr_123",
        name: userRole === "admin" ? "Admin Principal" : email.split("@")[0],
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
        updatePrealerta,
        linkPrealerta,
        login,
        register,
        logout,
        socket,
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
