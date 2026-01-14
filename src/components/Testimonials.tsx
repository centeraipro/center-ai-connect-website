import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion } from "framer-motion";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

const testimonials = [
  {
    quote:
      "Center AI Pro triplicó nuestra velocidad de respuesta en WhatsApp y nos ayudó a cerrar más tratos que nunca. Es como tener un equipo de ventas 24/7.",
    author: "Michael Chen",
    role: "CEO, TechStart Solutions",
    avatar: testimonial1,
  },
  {
    quote:
      "Hemos visto un aumento del 30% en ventas desde que implementamos Center AI Pro. A nuestros clientes les encantan las respuestas instantáneas, y a nosotros el tiempo ahorrado.",
    author: "Sarah Martinez",
    role: "Directora de Marketing, GrowthCo",
    avatar: testimonial2,
  },
  {
    quote:
      "Solo la función de reserva de citas nos ha ahorrado innumerables horas. Center AI Pro gestiona todo sin problemas en todos nuestros canales.",
    author: "David Park",
    role: "Fundador, ServiceHub",
    avatar: testimonial3,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Amado por empresas en todo el mundo
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mira cómo Center AI está transformando las interacciones con clientes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow h-full">
                <CardContent className="p-8">
                  <motion.p
                    className="text-lg mb-6 italic"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  >
                    "{testimonial.quote}"
                  </motion.p>
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.5 }}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>
                        {testimonial.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
