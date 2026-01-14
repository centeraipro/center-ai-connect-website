import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NumberFlow from '@number-flow/react';

export function PaymentCancel() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/register', { replace: true });
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
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-semibold mb-4">Pago Cancelado</h1>
          <p className="text-muted-foreground mb-8">
            Tu pago fue cancelado. No se realizó ningún cargo a tu cuenta.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/register')} className="w-full">
              Intentar Nuevamente
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Volver al Inicio
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Redirigiendo a registro en{' '}
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
