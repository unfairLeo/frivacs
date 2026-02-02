import { LucideIcon } from "lucide-react";

export type PersonaColor = "emerald" | "purple" | "cyan" | "orange";

export interface Persona {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  iconName: "bot" | "drama" | "cookie" | "dumbbell";
  color: PersonaColor;
  isLocked: boolean;
  unlockRequirement?: string;
}

export const colorConfig: Record<PersonaColor, { border: string; glow: string; bg: string; text: string }> = {
  emerald: {
    border: "border-primary",
    glow: "neon-glow-emerald",
    bg: "bg-primary/20",
    text: "text-primary",
  },
  purple: {
    border: "border-secondary",
    glow: "neon-glow-purple",
    bg: "bg-secondary/20",
    text: "text-secondary",
  },
  cyan: {
    border: "border-cyan-400",
    glow: "shadow-[0_0_20px_hsl(185_84%_50%/0.4)]",
    bg: "bg-cyan-400/20",
    text: "text-cyan-400",
  },
  orange: {
    border: "border-orange-400",
    glow: "shadow-[0_0_20px_hsl(30_84%_50%/0.4)]",
    bg: "bg-orange-400/20",
    text: "text-orange-400",
  },
};

export const defaultPersonas: Persona[] = [
  {
    id: "padrao",
    name: "O Padrão",
    subtitle: "Equilibrado & Profissional",
    description: "Sua IA financeira clássica. Profissional, direta e sempre pronta para ajudar com seus objetivos.",
    iconName: "bot",
    color: "emerald",
    isLocked: false,
  },
  {
    id: "sarcastico",
    name: "O Sarcástico",
    subtitle: "Te julga gastando",
    description: "Vai te fazer pensar duas vezes antes de gastar. Com humor ácido e verdades inconvenientes.",
    iconName: "drama",
    color: "purple",
    isLocked: true,
    unlockRequirement: "7 dias de streak",
  },
  {
    id: "vovo",
    name: "A Vovó Econômica",
    subtitle: "Cuida do seu dinheiro",
    description: "Conselhos de quem já viu de tudo. Economiza, guarda e faz render cada centavo com carinho.",
    iconName: "cookie",
    color: "cyan",
    isLocked: true,
    unlockRequirement: "14 dias de streak",
  },
  {
    id: "coach",
    name: "O Coach",
    subtitle: "Te motiva no grito",
    description: "VOCÊ VAI FICAR RICO! Motivação intensa para quem precisa de um empurrão (ou vários).",
    iconName: "dumbbell",
    color: "orange",
    isLocked: true,
    unlockRequirement: "21 dias de streak",
  },
];
