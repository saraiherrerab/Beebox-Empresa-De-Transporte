"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  suiteCode: string;
}

export interface PrealertaItem {
  id: string;
  store: string;
  trackingNumber: string;
  description: string;
  amountPaid: string;
  receiptFileName?: string;
  createdAt: string;
  status: "Prealertado" | "Recibido en Almacén" | "Vinculado";
}

interface AuthContextType {
  user: UserProfile | null;
  role: "client" | "admin";
  setRole: (role: "client" | "admin") => void;
  isAuthenticated: boolean;
  prealertas: PrealertaItem[];
  addPrealerta: (item: Omit<PrealertaItem, "id" | "createdAt" | "status">) => void;
  login: (email: string, pass: string) => void;
  register: (name: string, email: string, phone: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>({
    id: "usr_123",
    name: "Juan Pérez",
    email: "juan.perez@beebox.com",
    phone: "+52 55 9876 5432",
    suiteCode: "CAS-88293-MIAMI",
  });

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

  const addPrealerta = (item: Omit<PrealertaItem, "id" | "createdAt" | "status">) => {
    const newItem: PrealertaItem = {
      ...item,
      id: `pre_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Prealertado",
    };
    setPrealertas((prev) => [newItem, ...prev]);
  };

  const login = (email: string, pass: string) => {
    setUser({
      id: "usr_123",
      name: "Juan Pérez",
      email,
      phone: "+52 55 9876 5432",
      suiteCode: "CAS-88293-MIAMI",
    });
  };

  const register = (name: string, email: string, phone: string) => {
    const suiteCode = `CAS-${Math.floor(10000 + Math.random() * 90000)}-MIAMI`;
    setUser({
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      suiteCode,
    });
  };

  const logout = () => {
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
        addPrealerta,
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
