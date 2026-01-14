import { Bot, Calendar, TrendingUp, BarChart3, FileAudio, Zap, MessageSquare } from "lucide-react";
import CardSwap, { Card } from './CardSwap';
import { motion } from "framer-motion";

const features = [
  {
    icon: Bot,
    title: "Servicio al Cliente",
    description: "Soporte 24/7 con respuestas naturales e inteligentes. Reduce tiempos de respuesta de horas a segundos.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calendar,
    title: "Citas",
    description: "Agenda automática con recordatorios. Los clientes eligen horarios y reprograman sin esfuerzo.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Ventas",
    description: "Recomendaciones personalizadas y pagos seguros. Convierte conversaciones en ingresos.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Análisis",
    description: "Rastrea satisfacción, conversiones y tendencias. Optimiza tu estrategia con datos reales.",
    color: "from-orange-500 to-yellow-500",
  },
];

const capabilities = [
  {
    title: "Entiende Audio, Imágenes y PDFs",
    desc: "El agente procesa archivos multimedia para respuestas completas.",
    icon: FileAudio,
  },
  {
    title: "Configuración Ultrarrápida",
    desc: "Ponte en marcha en minutos. Sin experiencia técnica.",
    icon: Zap,
  },
  {
    title: "Soporte Multicanal",
    desc: "Web, móvil y redes sociales en una plataforma.",
    icon: MessageSquare,
  },
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Info card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-3xl" />
            <div className="relative bg-card rounded-2xl shadow-xl p-8 border border-border">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Características
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Todo lo que necesitas para{" "}
                  <span className="gradient-text">automatizar</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Nuestra plataforma impulsada por IA combina tecnología de vanguardia con diseño intuitivo para automatizar las interacciones con los clientes.
                </p>
              </motion.div>

              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                {capabilities.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex gap-4 items-start p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Card Swap */}
          <motion.div
            className="relative h-[450px]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <CardSwap
              cardDistance={45}
              verticalDistance={55}
              delay={5000}
              pauseOnHover={false}
              width={420}
              height={320}
            >
              {features.map((feature, index) => (
                <Card key={index}>
                  <div className="w-full h-full p-8 flex flex-col">
                    <motion.div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
