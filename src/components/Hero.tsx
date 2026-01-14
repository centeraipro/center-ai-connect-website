import { Button } from "./ui/button";
import Aurora from "./Aurora";
import BlurText from "./BlurText";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Aurora
          colorStops={["#2563EB", "#DBEAFE", "#FFFFFF"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <BlurText
            text="De la Conversión a la Conversación"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-7xl font-bold leading-tight justify-center"
          />

          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto">
            El agente de IA que cotiza, vende, agenda y da soporte. Automatiza tu ciclo de cliente completo con Center AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="text-lg px-8 py-6">
              Prueba Gratis
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              Ver Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
