export type TrackingStatusStep = 
  | "recoleccion"
  | "centro_distribucion"
  | "en_transito"
  | "en_reparto"
  | "entregado"
  | "incidencia";

export interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: TrackingStatusStep;
  title: string;
  description: string;
}

export interface Shipment {
  trackingCode: string;
  sender: {
    name: string;
    city: string;
  };
  recipient: {
    name: string;
    city: string;
    address: string;
  };
  serviceType: "Express" | "Carga Pesada" | "Consolidado" | "Última Milla";
  weightKg: number;
  dimensions: string; // e.g. "40 x 30 x 25 cm"
  estimatedDelivery: string;
  currentStatus: TrackingStatusStep;
  events: TrackingEvent[];
}

export interface ServiceOption {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  badge?: string;
  features: string[];
}

export interface FleetVehicle {
  id: string;
  name: string;
  category: "Vans Express" | "Camiones Medianos" | "Trailers de Gran Carga" | "Refrigerados";
  capacity: string;
  volume: string;
  features: string[];
  imageUrl?: string;
}

export interface RateQuoteQuery {
  originCity: string;
  destinationCity: string;
  weightKg: number;
  serviceType: string;
}

export interface RateQuoteResult {
  estimatedCostCLP: number;
  deliveryHoursMin: number;
  deliveryHoursMax: number;
}
