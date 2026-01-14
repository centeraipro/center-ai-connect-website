import { Link2, Settings, Rocket, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Link2,
    title: "Conectar Cuentas",
    description: "Vincula tu WhatsApp, Instagram y Facebook en minutos.",
    details: ["Integración con un clic", "Sin código requerido", "Conexión segura"],
  },
  {
    icon: Settings,
    title: "Configurar IA",
    description: "Configura tus preguntas frecuentes, flujos de ventas y reglas de citas.",
    details: ["Personaliza respuestas", "Define flujos", "Entrena el modelo"],
  },
  {
    icon: Rocket,
    title: "¡En Marcha!",
    description: "Comienza a automatizar tus conversaciones con clientes al instante.",
    details: ["Disponible 24/7", "Escala infinita", "Resultados inmediatos"],
  },
];

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="how-it-works" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2 }}
          >
            Cómo Funciona
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Comienza en{" "}
            <span className="gradient-text">3 simples pasos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No se requiere experiencia técnica. Configúralo en minutos, no días.
          </p>
        </motion.div>

        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <motion.div
              className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={stepVariants}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Step number circle */}
                  <motion.div
                    className="relative mb-6"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.2 + 0.3, 
                      type: "spring", 
                      stiffness: 200 
                    }}
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center font-bold text-2xl text-primary-foreground shadow-lg relative z-10">
                      {index + 1}
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/30"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    />
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all w-full group"
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <step.icon className="w-7 h-7" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                    
                    {/* Details list */}
                    <div className="space-y-2">
                      {step.details.map((detail, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false }}
                          transition={{ delay: index * 0.1 + i * 0.1 + 0.5 }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
