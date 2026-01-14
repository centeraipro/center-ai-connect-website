import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CreditCard, Phone, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface PaymentRequiredProps {
  onPayNow: () => void;
  isLoading?: boolean;
}

export function PaymentRequired({ onPayNow, isLoading = false }: PaymentRequiredProps) {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto h-screen flex flex-col justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Icon */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-16 h-16 mx-auto bg-accent rounded-xl flex items-center justify-center mb-4"
          >
            <CreditCard className="w-8 h-8 text-accent-foreground" />
          </motion.div>
          <h2 className="text-2xl font-bold">Activa tu Suscripción</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Para configurar tu agente IA, primero necesitas activar tu plan
          </p>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent/5 border border-accent/20 rounded-lg p-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Tu suscripción está inactiva</h3>
              <p className="text-xs text-muted-foreground">
                Para comenzar a usar tu agente de WhatsApp IA, necesitas completar el pago de tu plan seleccionado.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <Button
            onClick={onPayNow}
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Procesando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Continuar al Pago
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowContact(!showContact)}
            className="w-full"
            type="button"
          >
            <Phone className="w-4 h-4 mr-2" />
            Ya pagué / Necesito ayuda
          </Button>
        </motion.div>

        {/* Contact Info */}
        {showContact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-muted/30 border border-border rounded-lg p-4"
          >
            <h4 className="font-semibold text-sm mb-2">Soporte</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Si ya completaste el pago y tu cuenta no se activó automáticamente, contáctanos:
              </p>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="text-accent hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
              <p className="text-xs pt-2">
                Por favor ten a mano tu correo de registro y el comprobante de pago.
              </p>
            </div>
          </motion.div>
        )}

        {/* Benefits Reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4 border-t border-border"
        >
          <p className="text-xs text-center text-muted-foreground mb-3">
            Con tu suscripción obtendrás:
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Agente IA personalizado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Integración WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Automatizaciones N8N</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Soporte prioritario</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
