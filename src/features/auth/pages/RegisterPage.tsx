import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { generateSlug } from '../utils/slugGenerator';
import NumberFlow from '@number-flow/react';

interface PricingPlan {
  id: 'starter' | 'professional' | 'enterprise';
  name: string;
  price: string;
  yearlyPrice: string;
  features: string[];
  isPopular: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Inicial',
    price: '$49',
    yearlyPrice: '$39',
    features: ['1,000 conversaciones/mes', 'Integración WhatsApp', 'IA básica', 'Soporte email'],
    isPopular: false,
  },
  {
    id: 'professional',
    name: 'Profesional',
    price: '$149',
    yearlyPrice: '$119',
    features: ['10,000 conversaciones/mes', 'Todas las integraciones', 'IA avanzada', 'Soporte prioritario'],
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: '$299',
    yearlyPrice: '$239',
    features: ['Conversaciones ilimitadas', 'IA personalizada', 'Gerente dedicado', 'SLA garantizado'],
    isPopular: false,
  },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useRegister();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const [formData, setFormData] = useState<{
    business_slug: string;
    business_name: string;
    email: string;
    password: string;
    plan: 'starter' | 'professional' | 'enterprise';
  }>({
    business_slug: '',
    business_name: '',
    email: '',
    password: '',
    plan: 'professional',
  });

  // Only redirect if already authenticated AND not currently registering
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleBusinessNameChange = (name: string) => {
    setFormData({
      ...formData,
      business_name: name,
      business_slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success_url = `${window.location.origin}/payment-success`;
    const cancel_url = `${window.location.origin}/payment-cancel`;

    try {
      const response = await register({
        ...formData,
        success_url,
        cancel_url,
      }, false); // Don't set auth state during registration

      if (response.checkout_url) {
        // Redirect immediately to checkout
        window.location.href = response.checkout_url;
      } else {
        toast({
          title: '¡Registro exitoso!',
          description: 'Bienvenido a nuestra plataforma.',
        });
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Registro fallido',
        description: error instanceof Error ? error.message : 'Por favor intenta nuevamente',
        variant: 'destructive',
      });
    }
  };

  const isFormValid = formData.business_name && formData.email && formData.password.length >= 8;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8 items-start">
          {/* Left: Plan Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Selecciona tu plan</h2>
              <div className="flex items-center gap-3">
                <span className={cn('text-sm font-medium', isYearly && 'text-muted-foreground')}>
                  Mensual
                </span>
                <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                <span className={cn('text-sm font-medium', !isYearly && 'text-muted-foreground')}>
                  Anual <span className="text-primary">(20%)</span>
                </span>
              </div>
            </div>
            <div className="grid gap-4">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setFormData({ ...formData, plan: plan.id })}
                  className={cn(
                    'relative cursor-pointer rounded-xl border-2 p-5 transition-all hover:shadow-md',
                    formData.plan === plan.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/30'
                  )}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-2.5 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-0.5 rounded-full">
                      Más Popular
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-1',
                      formData.plan === plan.id ? 'border-primary bg-primary' : 'border-border'
                    )}>
                      {formData.plan === plan.id && (
                        <div className="w-2.5 h-2.5 bg-primary-foreground rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-3">
                        <h3 className="text-lg font-bold">{plan.name}</h3>
                        <span className="text-2xl font-bold text-primary">
                          <NumberFlow
                            value={isYearly ? Number(plan.yearlyPrice.replace('$', '')) : Number(plan.price.replace('$', ''))}
                            format={{
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }}
                            transformTiming={{
                              duration: 400,
                              easing: 'ease-out',
                            }}
                          />
                        </span>
                        <span className="text-sm text-muted-foreground">/mes</span>
                      </div>

                      <ul className="grid grid-cols-2 gap-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-sm">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Información de la cuenta</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="business_name" className="text-sm font-medium mb-2 block">
                    Nombre del Negocio
                  </Label>
                  <input
                    id="business_name"
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => handleBusinessNameChange(e.target.value)}
                    placeholder="Mi Empresa S.A."
                    className="w-full bg-background border border-input text-sm p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required
                  />
                  {formData.business_slug && (
                    <p className="text-xs text-muted-foreground mt-2">
                      URL: <span className="font-mono text-primary">{formData.business_slug}.centerai.pro</span>
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                    Correo Electrónico
                  </Label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@empresa.com"
                    className="w-full bg-background border border-input text-sm p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium mb-2 block">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full bg-background border border-input text-sm p-3.5 pr-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={isLoading || !isFormValid}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="w-4 h-4" />
                        <span>Procesando {formData.plan === 'starter' ? 'Plan Inicial' : formData.plan === 'professional' ? 'Plan Profesional' : 'Plan Empresarial'}...</span>
                      </div>
                    ) : (
                      'Completar Registro'
                    )}
                  </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground pt-2">
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-primary hover:underline font-medium"
                  >
                    Iniciar sesión
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
