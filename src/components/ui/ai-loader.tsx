import { cn } from "@/lib/utils";

interface AILoaderProps {
  className?: string;
  text?: string;
}

export function AILoader({ className, text = "Generando" }: AILoaderProps) {
  const letters = text.split("");

  return (
    <div className={cn("loader-wrapper", className)}>
      {letters.map((letter, index) => (
        <span key={index} className="loader-letter">
          {letter}
        </span>
      ))}
      <div className="loader"></div>
    </div>
  );
}
