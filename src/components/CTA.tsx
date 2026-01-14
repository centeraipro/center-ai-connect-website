import { Button } from "./ui/button";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8 bg-foreground text-background rounded-3xl p-12 md:p-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ¿Listo para transformar tus conversaciones con clientes?
          </motion.h2>
          <motion.p
            className="text-xl opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Únete a miles de empresas que ya usan Center AI Pro para automatizar
            y escalar sus operaciones.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                Prueba Gratis
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-transparent border-2 border-background text-background hover:bg-background hover:text-foreground"
              >
                Agendar Demo
              </Button>
            </motion.div>
          </motion.div>
          <motion.p
            className="text-sm opacity-75 pt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.75 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Sin tarjeta de crédito • Prueba gratis de 14 días • Cancela cuando quieras
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
