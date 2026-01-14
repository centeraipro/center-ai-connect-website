import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Sparkles, Target, MessageCircle, Zap, Check } from 'lucide-react';
import type { AIAgentConfig, AgentGoal, AgentTone } from '../types/onboarding.types';

const formSchema = z.object({
  agentName: z.string().min(2, {
    message: 'El nombre del agente debe tener al menos 2 caracteres.',
  }),
  goal: z.union([
    z.literal('MAKE_APPOINTMENTS'),
    z.literal('SELL_PRODUCTS'),
    z.literal('PROVIDE_INFORMATION')
  ]).refine((val) => val, {
    message: 'Por favor selecciona un objetivo.'
  }),
  welcomeMessage: z.string().min(10, {
    message: 'El mensaje de bienvenida debe tener al menos 10 caracteres.',
  }),
  tone: z.union([
    z.literal('friendly'),
    z.literal('professional'),
    z.literal('casual'),
    z.literal('formal')
  ]).refine((val) => val, {
    message: 'Por favor selecciona un tono.'
  }),
  language: z.string().default('es-ES'),
});

interface OnboardingFormProps {
  onSubmit: (data: AIAgentConfig) => void;
  isLoading?: boolean;
}

const goals = [
  {
    id: 'SELL_PRODUCTS' as AgentGoal,
    title: 'Vender Productos',
    description: 'Convertir visitantes en clientes',
    icon: Target,
  },
  {
    id: 'MAKE_APPOINTMENTS' as AgentGoal,
    title: 'Agendar Citas',
    description: 'Gestionar agenda y reservas',
    icon: MessageCircle,
  },
  {
    id: 'PROVIDE_INFORMATION' as AgentGoal,
    title: 'Proporcionar Información',
    description: 'Responder preguntas frecuentes',
    icon: Zap,
  },
];

const tones = [
  { id: 'friendly' as AgentTone, title: 'Amigable', emoji: '😊' },
  { id: 'professional' as AgentTone, title: 'Profesional', emoji: '💼' },
  { id: 'casual' as AgentTone, title: 'Casual', emoji: '👋' },
  { id: 'formal' as AgentTone, title: 'Formal', emoji: '🎩' },
];

export function OnboardingForm({ onSubmit, isLoading = false }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    agentName: '',
    goal: '' as AgentGoal | '',
    tone: '' as AgentTone | '',
    welcomeMessage: '',
    language: 'es-ES',
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.goal && formData.tone) {
      onSubmit(formData as AIAgentConfig);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.agentName.length >= 2;
      case 2:
        return !!formData.goal;
      case 3:
        return !!formData.tone;
      case 4:
        return formData.welcomeMessage.length >= 10;
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-screen flex flex-col justify-center py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <motion.div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all',
                  step >= s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
                animate={{
                  scale: step === s ? 1.05 : 1,
                }}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </motion.div>
              {s < 4 && (
                <div className="flex-1 h-0.5 mx-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: step > s ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>Nombre</span>
          <span>Objetivo</span>
          <span>Tono</span>
          <span>Mensaje</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Step 1: Agent Name */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="w-16 h-16 mx-auto bg-primary rounded-xl flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Dale un nombre a tu Asistente IA
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Este será el nombre que tus clientes verán al interactuar con tu agente
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <Label htmlFor="agentName" className="text-sm font-medium mb-2 block">
                  Nombre del Agente
                </Label>
                <input
                  id="agentName"
                  type="text"
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                  placeholder="ej. Asistente de Ventas"
                  className="w-full h-12 bg-background border border-input text-base px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Mínimo 2 caracteres
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Goal Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  ¿Cuál es el objetivo principal?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Define qué debe lograr tu agente en cada conversación
                </p>
              </div>

              <div className="grid gap-3">
                {goals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setFormData({ ...formData, goal: goal.id })}
                    className={cn(
                      'relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary group',
                      formData.goal === goal.id
                        ? 'border-primary bg-accent/5'
                        : 'border-border bg-card'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg bg-accent flex items-center justify-center transition-all',
                        formData.goal === goal.id && 'scale-105'
                      )}>
                        <goal.icon className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{goal.title}</h3>
                        <p className="text-xs text-muted-foreground">{goal.description}</p>
                      </div>
                      {formData.goal === goal.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                        >
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Tone Selection */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Elige el tono de voz
                </h2>
                <p className="text-sm text-muted-foreground">
                  El estilo de conversación que usará tu agente
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {tones.map((tone, index) => (
                  <motion.div
                    key={tone.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setFormData({ ...formData, tone: tone.id })}
                    className={cn(
                      'relative cursor-pointer rounded-lg border-2 p-5 transition-all hover:border-primary text-center',
                      formData.tone === tone.id
                        ? 'border-primary bg-accent/5'
                        : 'border-border bg-card'
                    )}
                  >
                    <div className="text-3xl mb-2">{tone.emoji}</div>
                    <h3 className="font-semibold text-sm">{tone.title}</h3>
                    {formData.tone === tone.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Welcome Message */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Crea el mensaje de bienvenida
                </h2>
                <p className="text-sm text-muted-foreground">
                  El primer mensaje que recibirán tus clientes
                </p>
              </div>

              <div>
                <Label htmlFor="welcomeMessage" className="text-sm font-medium mb-2 block">
                  Mensaje de Bienvenida
                </Label>
                <Textarea
                  id="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  placeholder="¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?"
                  className="min-h-[100px] text-sm p-3 rounded-lg border focus:ring-2 focus:ring-primary resize-none"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {formData.welcomeMessage.length} / 10 caracteres mínimos
                </p>

                {formData.welcomeMessage.length >= 10 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <p className="text-xs font-medium mb-1.5">Vista previa:</p>
                    <div className="bg-card p-3 rounded-md border">
                      <p className="text-xs">{formData.welcomeMessage}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            size="sm"
          >
            Atrás
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              size="sm"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isStepValid() || isLoading}
              size="sm"
            >
              {isLoading ? 'Configurando...' : 'Crear Agente'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
