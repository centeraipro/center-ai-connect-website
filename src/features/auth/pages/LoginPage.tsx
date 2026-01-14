import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInPage, Testimonial } from '@/components/ui/sign-in';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "María González",
    handle: "@mariadigital",
    text: "¡Plataforma increíble! La experiencia de usuario es impecable y las funciones son exactamente lo que necesitaba."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Carlos Rodríguez",
    handle: "@carlostech",
    text: "Este servicio ha transformado mi forma de trabajar. Diseño limpio, funciones potentes y excelente soporte."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martínez",
    handle: "@davidcrea",
    text: "He probado muchas plataformas, pero esta destaca. Intuitiva, confiable y genuinamente útil para la productividad."
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useLogin();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      toast({
        title: '¡Bienvenido de nuevo!',
        description: 'Has iniciado sesión exitosamente.',
      });
      navigate('/app', { replace: true });
    } catch (error) {
      toast({
        title: 'Inicio de sesión fallido',
        description: error instanceof Error ? error.message : 'Credenciales inválidas',
        variant: 'destructive',
      });
    }
  };

  return (
    <SignInPage
      title={<span className="font-light text-foreground tracking-tighter">Bienvenido</span>}
      description="Accede a tu cuenta y continúa tu viaje con nosotros"
      onSignIn={handleSignIn}
      onCreateAccount={() => navigate('/register')}
      onResetPassword={() => navigate('/reset-password')}
      heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
      testimonials={testimonials}
    />
  );
}
