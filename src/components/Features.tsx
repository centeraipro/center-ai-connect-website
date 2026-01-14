import { Bot, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import CardSwap, { Card } from './CardSwap';
import { motion } from "framer-motion";

const features = [
  {
    icon: Bot,
    title: "Servicio al Cliente",
    description: "Soporte 24/7 con respuestas naturales e inteligentes. Reduce tiempos de respuesta de horas a segundos.",
  },
  {
    icon: Calendar,
    title: "Citas",
    description: "Agenda automática con recordatorios. Los clientes eligen horarios y reprograman sin esfuerzo.",
  },
  {
    icon: TrendingUp,
    title: "Ventas",
    description: "Recomendaciones personalizadas y pagos seguros. Convierte conversaciones en ingresos.",
  },
  {
    icon: BarChart3,
    title: "Análisis",
    description: "Rastrea satisfacción, conversiones y tendencias. Optimiza tu estrategia con datos reales.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-start">
            <motion.div
              className="bg-card rounded-2xl shadow-card p-8 max-w-lg border border-border"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                    Todo lo que necesitas para automatizar
                  </h2>
                  <p className="text-lg text-muted-foreground leading-snug">
                    Nuestra plataforma impulsada por IA combina tecnología de vanguardia con diseño intuitivo para automatizar las interacciones con los clientes.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      title: "Entiende Audio, Imágenes y PDFs",
                      desc: "El agente procesa archivos multimedia para respuestas completas.",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><path fill="currentColor" d="M2048 670v898q0 51-22 92t-59 70t-82 46t-93 16q-47 0-93-16t-82-45t-58-71t-23-92q0-51 22-92t59-71t82-45t93-16q66 0 128 31V834l-640 160v702q0 51-22 92t-59 70t-82 46t-93 16q-47 0-93-16t-82-45t-58-71t-23-92q0-51 22-92t59-71t82-45t93-16q66 0 128 31V894zM1024 1792q20 0 42-6t42-18t31-30t13-42q0-24-12-42t-32-30t-41-18t-43-6q-20 0-42 6t-42 18t-31 30t-13 42q0 24 12 42t32 30t41 18t43 6m768-128q20 0 42-6t42-18t31-30t13-42q0-24-12-42t-32-30t-41-18t-43-6q-20 0-42 6t-42 18t-31 30t-13 42q0 24 12 42t32 30t41 18t43 6M384 640H256V512h128zM256 768h128v128H256zm896-256h128v128h-128zm-128 768H0V128h1536v512l-128 32V256h-128v128h-128V256H384v128H256V256H128v896h128v-128h128v128h640z"/></svg>
                    },
                    {
                      title: "Configuración Ultrarrápida",
                      desc: "Ponte en marcha en minutos. Sin experiencia técnica.",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m18 13l8-11L8 13l6 6l-8 11l18-11Z"/></svg>
                    },
                    {
                      title: "Soporte Multicanal",
                      desc: "Web, móvil y redes sociales en una plataforma.",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path strokeDasharray="72" strokeDashoffset="72" d="M3 19.5v-15.5c0 -0.55 0.45 -1 1 -1h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-14.5Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"/></path><path strokeDasharray="10" strokeDashoffset="10" d="M8 7h8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="10;0"/></path><path strokeDasharray="10" strokeDashoffset="10" d="M8 10h8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="10;0"/></path><path strokeDasharray="6" strokeDashoffset="6" d="M8 13h4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.3s" dur="0.2s" values="6;0"/></path></g></svg>
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex gap-3 items-start"
                    >
                      <div className="mt-1 text-xl flex-shrink-0 text-accent">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-base text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div style={{ height: '420px', position: 'relative' }}>
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
                  <div className="w-full h-full p-6 md:p-8 flex flex-col">
                    <div className="w-14 h-14 md:w-12 md:h-12 rounded-lg bg-foreground text-background flex items-center justify-center mb-4">
                      <feature.icon className="w-7 h-7 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-3xl md:text-2xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-base md:text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
}
