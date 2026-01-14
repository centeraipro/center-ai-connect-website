import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "Características", href: "#features" },
  { label: "Cómo Funciona", href: "#how-it-works" },
  { label: "Precios", href: "#pricing" },
  { label: "Testimonios", href: "#testimonials" },
];

export default function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", window.location.pathname);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className={`transition-all duration-500 ease-in-out ${
        isScrolled ? "container mx-auto px-4 md:max-w-fit md:px-0" : "container mx-auto px-4"
      }`}>
        <nav
          className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
            isScrolled
              ? "bg-background md:rounded-xl rounded-lg border border-border shadow-lg px-4 md:px-10 py-2 md:py-1 md:gap-10"
              : "bg-transparent border-transparent px-0 py-2"
          }`}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src="/CenterIcon.svg"
              alt="Center AI"
              className={`transition-all duration-500 ease-in-out ${
                isScrolled ? "w-8 h-8" : "w-10 h-10"
              }`}
            />
            <span className={`font-bold text-lg transition-all duration-500 ease-in-out ${
              isScrolled ? "opacity-0 w-0 overflow-hidden md:opacity-100 md:w-auto" : "opacity-100"
            }`}>Center AI</span>
          </a>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center transition-all duration-500 ease-in-out ${
            isScrolled ? "gap-4" : "gap-8"
          }`}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`font-medium hover:text-accent transition-all duration-500 ease-in-out cursor-pointer ${
                  isScrolled ? "text-sm" : "text-base"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <Button 
                onClick={() => navigate('/app')}
                className={`rounded px-4 transition-all duration-500 ease-in-out ${
                  isScrolled ? "h-7 text-sm" : "h-9 text-base"
                }`}
              >
                Ir a la App
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-b border-border shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block py-2 font-medium hover:text-accent transition-colors cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
              <Button onClick={() => navigate('/app')} className="w-full rounded px-4 h-10">
                Ir a la App
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
