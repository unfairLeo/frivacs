import { LucideIcon } from "lucide-react";

export type MissionCategory = "roi" | "mindset" | "negotiation" | "saving";

export interface EntrepreneurMission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  xpReward: number;
  completed: boolean;
}

export interface DailyProgress {
  totalXP: number;
  completedMissions: number;
  totalMissions: number;
}

export const categoryConfig: Record<MissionCategory, { label: string; color: string; bgColor: string }> = {
  roi: {
    label: "ROI",
    color: "text-amber-400",
    bgColor: "bg-amber-400/20",
  },
  mindset: {
    label: "MINDSET",
    color: "text-secondary",
    bgColor: "bg-secondary/20",
  },
  negotiation: {
    label: "NEGOCIAÇÃO",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/20",
  },
  saving: {
    label: "ECONOMIA",
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
};

export const defaultMissions: EntrepreneurMission[] = [
  {
    id: "1",
    title: "O Dilema do Café",
    description: "Calcule quanto seu café diário custaria em 1 ano investido a 10% a.a.",
    category: "roi",
    xpReward: 50,
    completed: false,
  },
  {
    id: "2",
    title: "Caça aos Passivos",
    description: "Identifique 3 gastos de hoje que não colocam dinheiro no seu bolso.",
    category: "saving",
    xpReward: 75,
    completed: false,
  },
  {
    id: "3",
    title: "Negociação Simulada",
    description: "Peça um desconto em qualquer compra hoje, mesmo que seja R$ 1,00.",
    category: "negotiation",
    xpReward: 100,
    completed: false,
  },
  {
    id: "4",
    title: "Regra dos 10%",
    description: "Separe 10% de qualquer dinheiro que receber hoje para investir.",
    category: "mindset",
    xpReward: 60,
    completed: false,
  },
  {
    id: "5",
    title: "Auditoria de Assinaturas",
    description: "Liste todas suas assinaturas e cancele 1 que não usa.",
    category: "saving",
    xpReward: 80,
    completed: false,
  },
  {
    id: "6",
    title: "Pitch de 30 Segundos",
    description: "Explique seu objetivo financeiro em 30 segundos para alguém.",
    category: "mindset",
    xpReward: 40,
    completed: false,
  },
];
