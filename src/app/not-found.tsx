import React from "react";
import Link from "next/link";
import { Box, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-beebox-navy-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-beebox-amber-500/10 border border-beebox-amber-500/30 flex items-center justify-center text-beebox-amber-400 mb-4">
        <Box className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 - Página No Encontrada</h1>
      <p className="text-slate-400 text-sm max-w-md my-4">
        La ruta a la que intentas acceder no existe en el sistema de Beebox Empresa de Transporte.
      </p>
      <Link href="/">
        <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
          Volver al Inicio
        </Button>
      </Link>
    </div>
  );
}
