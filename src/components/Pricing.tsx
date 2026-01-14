"use client";

import { Pricing as PricingBlock } from "@/components/blocks/pricing";

const demoPlans = [
  {
    name: "Inicial",
    price: "49",
    yearlyPrice: "39",
    period: "mes",
    features: [
      "Hasta 1,000 conversaciones/mes",
      "Integración con WhatsApp",
      "Respuestas básicas de IA",
      "Soporte por email",
      "Panel de análisis",
    ],
    description: "Perfecto para pequeñas empresas que comienzan",
    buttonText: "Comenzar",
    href: "#",
    isPopular: false,
  },
  {
    name: "Profesional",
    price: "149",
    yearlyPrice: "119",
    period: "mes",
    features: [
      "Hasta 10,000 conversaciones/mes",
      "Todas las integraciones de plataforma",
      "IA avanzada y flujos personalizados",
      "Soporte prioritario",
      "Análisis avanzados",
      "Colaboración en equipo",
      "Acceso a API",
    ],
    description: "Para negocios en crecimiento con mayor volumen",
    buttonText: "Comenzar",
    href: "#",
    isPopular: true,
  },
  {
    name: "Empresarial",
    price: "Personalizado",
    yearlyPrice: "Personalizado",
    period: "",
    features: [
      "Conversaciones ilimitadas",
      "Todas las integraciones de plataforma",
      "Entrenamiento personalizado de IA",
      "Gerente de cuenta dedicado",
      "Integraciones personalizadas",
      "Garantía de SLA",
      "Opción de marca blanca",
    ],
    description: "Soluciones a medida para grandes organizaciones",
    buttonText: "Contactar ventas",
    href: "#",
    isPopular: false,
  },
];

export default function Pricing() {
  return (
    <PricingBlock
      plans={demoPlans}
      title="Precios simples y transparentes"
      description="Elige el plan que se adapte a las necesidades de tu negocio"
    />
  );
}
