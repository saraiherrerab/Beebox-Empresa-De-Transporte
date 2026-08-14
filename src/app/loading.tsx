import React from "react";
import { Box } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-beebox-navy-950 flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-beebox-amber-500 flex items-center justify-center animate-bounce shadow-xl shadow-beebox-amber-500/20">
          <Box className="w-8 h-8 text-beebox-navy-950 stroke-[2.5]" />
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-400 animate-pulse tracking-wider uppercase">
        Cargando Beebox...
      </p>
    </div>
  );
}
