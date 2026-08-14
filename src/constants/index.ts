import { FleetVehicle, ServiceOption, Shipment } from "@/types";

export const COMPANY_INFO = {
  name: "Beebox Empresa de Transporte",
  shortName: "Beebox",
  tagline: "Logística Inteligente y Transporte Seguro",
  phone: "+56 9 8765 4321",
  email: "contacto@beebox.cl",
  address: "Av. Del Parque 4120, Huechuraba, Santiago, Chile",
  hours: "Lun - Vie: 08:00 - 20:00 | Sáb: 09:00 - 14:00",
  socials: {
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
};

export const NAV_LINKS = [
  { name: "Inicio", href: "/" },
  { name: "Seguimiento", href: "/#rastreo" },
  { name: "Servicios", href: "/#servicios" },
  { name: "Cotizador", href: "/#cotizador" },
  { name: "Flota", href: "/#flota" },
  { name: "Nosotros", href: "/#nosotros" },
  { name: "Contacto", href: "/#contacto" },
];

export const MOCK_SHIPMENTS: Record<string, Shipment> = {
  "BEE-98234-CL": {
    trackingCode: "BEE-98234-CL",
    sender: {
      name: "Distribuidora del Pacífico Ltda.",
      city: "Valparaíso",
    },
    recipient: {
      name: "Logística Central SpA",
      city: "Santiago",
      address: "Av. Providencia 1234, Of. 502",
    },
    serviceType: "Express",
    weightKg: 14.5,
    dimensions: "45 x 35 x 30 cm",
    estimatedDelivery: "14 de Agosto, 2026 - 15:30 hrs",
    currentStatus: "en_reparto",
    events: [
      {
        id: "evt-1",
        timestamp: "13 Ago 2026 - 08:30",
        location: "Bodega Valparaíso",
        status: "recoleccion",
        title: "Paquete Recogido",
        description: "El paquete fue retirado exitosamente en las instalaciones del remitente.",
      },
      {
        id: "evt-2",
        timestamp: "13 Ago 2026 - 13:15",
        location: "Centro de Distribución Santiago Norte",
        status: "centro_distribucion",
        title: "Procesado en Hub Central",
        description: "Clasificación automatizada en banda transportadora Beebox.",
      },
      {
        id: "evt-3",
        timestamp: "13 Ago 2026 - 21:00",
        location: "Autopista Central - En Ruta",
        status: "en_transito",
        title: "En Tránsito a Sucursal Providencia",
        description: "Unidad Beebox N° 402 transportando el paquete.",
      },
      {
        id: "evt-4",
        timestamp: "14 Ago 2026 - 08:45",
        location: "Base Operativa Santiago Oriente",
        status: "en_reparto",
        title: "Salida a Reparto Final",
        description: "Asignado a chofer Juan Pérez (Van BEE-104). En camino a la dirección del destinatario.",
      },
    ],
  },
  "BEE-45102-CL": {
    trackingCode: "BEE-45102-CL",
    sender: {
      name: "Tech Import Chile",
      city: "Santiago",
    },
    recipient: {
      name: "Comercial San Pedro",
      city: "Concepción",
      address: "Calle Barros Arana 890",
    },
    serviceType: "Carga Pesada",
    weightKg: 340.0,
    dimensions: "120 x 100 x 140 cm (Pallet)",
    estimatedDelivery: "15 de Agosto, 2026 - 12:00 hrs",
    currentStatus: "en_transito",
    events: [
      {
        id: "evt-101",
        timestamp: "12 Ago 2026 - 16:00",
        location: "CD Quilicura",
        status: "recoleccion",
        title: "Carga Consolidada",
        description: "Pallet verificado con pesaje oficial de 340 kg.",
      },
      {
        id: "evt-102",
        timestamp: "13 Ago 2026 - 10:30",
        location: "Terminal Interurbano Santiago",
        status: "en_transito",
        title: "En Tránsito Ruta 5 Sur",
        description: "Camión Freightliner de alta capacidad rumbo a Concepción.",
      },
    ],
  },
};

export const SERVICES_LIST: ServiceOption[] = [
  {
    id: "express",
    title: "Transporte Express 24h",
    shortDesc: "Envíos prioritarios puerta a puerta dentro de la región y conectividad interregional en 24 horas.",
    fullDesc: "Servicio pensado para urgencias corporativas y e-commerce con garantización de tiempos de entrega en menos de 24 horas hábiles.",
    iconName: "Zap",
    badge: "Más Rápido",
    features: [
      "Prioridad alta en clasificación",
      "Seguimiento GPS en tiempo real",
      "Confirmación por firma digital",
      "Seguro básico incluido",
    ],
  },
  {
    id: "carga-pesada",
    title: "Carga Pesada & Palletizada",
    shortDesc: "Soluciones de volumen industrial, fletes dedicados y paletizado con equipos de estiba especializados.",
    fullDesc: "Transporte masivo de mercancías con vehículos de alto tonelaje para abastecimiento de centros de distribución y faenas.",
    iconName: "Truck",
    badge: "Industrial",
    features: [
      "Capacidad hasta 28 toneladas por unidad",
      "Unidades rampla abierta y cortina lateral",
      "Carga y descarga asistida con grúa horquilla",
      "Gestión de guías de despacho y aduanas",
    ],
  },
  {
    id: "ultima-milla",
    title: "Distribución Última Milla",
    shortDesc: "Logística urbana eficiente para e-commerce y retail con entregas el mismo día (Same-Day).",
    fullDesc: "Optimización de rutas urbanas mediante nuestra flota de vans y vehículos eléctricos para asegurar la satisfacción del cliente final.",
    iconName: "PackageCheck",
    badge: "E-Commerce",
    features: [
      "Rutas optimizadas por Inteligencia Artificial",
      "Notificaciones SMS/WhatsApp al comprador",
      "Gestión simplificada de devoluciones (Reverse Logistics)",
      "Entregas en ventanas horarias específicas",
    ],
  },
  {
    id: "refrigerado",
    title: "Cadena de Frío & Fármacos",
    shortDesc: "Unidades con control termométrico activo para productos perecibles, alimentos y farmacéutica.",
    fullDesc: "Vehículos dotados de sensores de temperatura en tiempo real y certificado de calibración térmico continuo.",
    iconName: "ThermometerSnowflake",
    badge: "Especializado",
    features: [
      "Monitoreo continuo de -20°C a +15°C",
      "Alertas de desviación térmica automáticas",
      "Cumplimiento norma ISP y SEREMI de Salud",
      "Limpieza y sanitización de cámara certificada",
    ],
  },
];

export const FLEET_LIST: FleetVehicle[] = [
  {
    id: "v-van",
    name: "Sprinter Cargo Express",
    category: "Vans Express",
    capacity: "1.5 Toneladas",
    volume: "12 m³",
    features: ["Ideal para reparto urbano", "Monitoreo GPS continuo", "Puerta lateral deslizante"],
  },
  {
    id: "v-medium",
    name: "Camión Rígido 8T",
    category: "Camiones Medianos",
    capacity: "8.0 Toneladas",
    volume: "35 m³",
    features: ["Elevador hidráulico incorporado", "Caja cerrada de alta seguridad", "Sistema antiasalto integrador"],
  },
  {
    id: "v-heavy",
    name: "Tractor Tráiler 28T",
    category: "Trailers de Gran Carga",
    capacity: "28.0 Toneladas",
    volume: "90 m³",
    features: ["Rampla cortina sider", "Apto para 26 pallets estándar", "Doble chofer para tramos largos"],
  },
  {
    id: "v-cold",
    name: "Thermo Truck 5T",
    category: "Refrigerados",
    capacity: "5.0 Toneladas",
    volume: "22 m³",
    features: ["Equipo Thermo King de última generación", "Registrador de temperatura USB/Nube", "Piso de aluminio acanalado"],
  },
];
