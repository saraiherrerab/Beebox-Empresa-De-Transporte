"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  suiteCode: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  addresses: {
    id: string;
    label: string;
    address: string;
    isDefault?: boolean;
  }[];
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
  register: (name: string, email: string, phone: string) => void;
}

const DEFAULT_USER: UserProfile = {
  id: "usr-88293",
  name: "Juan Pérez",
  suiteCode: "CAS-88293-MX",
  email: "juan.perez@beebox.com",
  phone: "+52 55 9876 5432",
  addresses: [
    {
      id: "addr-1",
      label: "CASA (PREDETERMINADA)",
      address: "Av. Insurgentes Sur 1234, CDMX, 03210",
      isDefault: true,
    },
    {
      id: "addr-2",
      label: "OFICINA NORTE",
      address: "Reforma 500, Piso 12, CDMX, 06600",
    },
  ],
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  isAuthenticated: true,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);

  const login = (email: string, pass: string) => {
    setUser({
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const register = (name: string, email: string, phone: string) => {
    setUser({
      ...DEFAULT_USER,
      name,
      email,
      phone,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
