import { MessageCircle } from "lucide-react";

export default function Integration() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            One AI, connected to every channel
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamlessly integrate with the platforms your customers already use
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative h-96 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-foreground flex items-center justify-center shadow-lg">
                <span className="text-background font-bold text-2xl">CA</span>
              </div>
            </div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <div className="w-16 h-16 rounded-xl bg-card border-2 border-foreground flex items-center justify-center shadow-md">
                <MessageCircle className="w-8 h-8" />
              </div>
            </div>

            <div className="absolute bottom-0 left-1/4">
              <div className="w-16 h-16 rounded-xl bg-card border-2 border-foreground flex items-center justify-center shadow-md">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
            </div>

            <div className="absolute bottom-0 right-1/4">
              <div className="w-16 h-16 rounded-xl bg-card border-2 border-foreground flex items-center justify-center shadow-md">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </div>
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1="50%"
                y1="50%"
                x2="50%"
                y2="10%"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-30"
              />
              <line
                x1="50%"
                y1="50%"
                x2="25%"
                y2="90%"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-30"
              />
              <line
                x1="50%"
                y1="50%"
                x2="75%"
                y2="90%"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-30"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
