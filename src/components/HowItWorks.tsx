import { Link2, Settings, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Link2,
    title: "Conectar Cuentas",
    description: "Vincula tu WhatsApp, Instagram y Facebook en minutos.",
  },
  {
    icon: Settings,
    title: "Configurar IA",
    description: "Configura tus preguntas frecuentes, flujos de ventas y reglas de citas.",
  },
  {
    icon: Rocket,
    title: "¡En Marcha!",
    description: "Comienza a automatizar tus conversaciones con clientes al instante.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Comienza en 3 simples pasos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No se requiere experiencia técnica. Configúralo en minutos, no días.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-border" style={{ left: '8%', right: '8%' }} />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xl shadow-lg mb-6 relative z-10"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.2, type: "spring", stiffness: 200 }}
                  >
                    {index + 1}
                  </motion.div>

                  <motion.div
                    className="bg-card border border-border rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all hover:scale-105 w-full"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="w-10 h-10 mb-4 mx-auto" />
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
