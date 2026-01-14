import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NumberFlow from '@number-flow/react';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 5000);

    // Update countdown every second
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md text-center">
        <div className="bg-card border border-border rounded-3xl p-12 shadow-lg">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold mb-4">¡Pago Exitoso!</h1>
          <p className="text-muted-foreground mb-8">
            Tu suscripción ha sido activada exitosamente. ¡Bienvenido!
          </p>
          <Button onClick={() => navigate('/', { replace: true })} className="w-full">
            Ir al Panel de Control
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Redirigiendo automáticamente en{' '}
            <NumberFlow
              value={countdown}
              className="inline-block font-semibold text-primary"
              transformTiming={{
                duration: 400,
                easing: 'ease-out',
              }}
            />{' '}
            segundo{countdown !== 1 ? 's' : ''}...
          </p>
        </div>
      </div>
    </div>
  );
}
