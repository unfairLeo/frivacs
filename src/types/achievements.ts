export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "medal" | "star" | "flame" | "target" | "crown" | "rocket" | "zap" | "gem";
  tier: "bronze" | "silver" | "gold";
  isUnlocked: boolean;
  unlockCondition: string;
  unlockedAt?: Date;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    name: "Primeiro Passo",
    description: "Você criou sua primeira meta!",
    icon: "star",
    tier: "bronze",
    isUnlocked: true,
    unlockCondition: "Crie sua primeira meta",
    unlockedAt: new Date("2024-01-15"),
  },
  {
    id: "saver",
    name: "Economizador",
    description: "Você adicionou dinheiro a uma meta!",
    icon: "gem",
    tier: "bronze",
    isUnlocked: true,
    unlockCondition: "Adicione R$ a uma meta",
    unlockedAt: new Date("2024-01-20"),
  },
  {
    id: "focused",
    name: "Focado",
    description: "Complete 5 missões para desbloquear",
    icon: "target",
    tier: "bronze",
    isUnlocked: false,
    unlockCondition: "Complete 5 missões",
  },
  {
    id: "fire-streak",
    name: "Streak de Fogo",
    description: "Você manteve 7 dias de streak!",
    icon: "flame",
    tier: "silver",
    isUnlocked: true,
    unlockCondition: "Mantenha 7 dias de streak",
    unlockedAt: new Date("2024-02-01"),
  },
  {
    id: "goal-achieved",
    name: "Meta Atingida",
    description: "Complete uma meta 100% para desbloquear",
    icon: "trophy",
    tier: "silver",
    isUnlocked: false,
    unlockCondition: "Complete uma meta 100%",
  },
  {
    id: "investor",
    name: "Investidor",
    description: "Use o simulador de juros para desbloquear",
    icon: "rocket",
    tier: "silver",
    isUnlocked: false,
    unlockCondition: "Use o simulador de juros",
  },
  {
    id: "streak-king",
    name: "Rei do Streak",
    description: "Mantenha 30 dias de streak para desbloquear",
    icon: "crown",
    tier: "gold",
    isUnlocked: false,
    unlockCondition: "Mantenha 30 dias de streak",
  },
  {
    id: "goals-master",
    name: "Mestre das Metas",
    description: "Complete 5 metas para desbloquear",
    icon: "medal",
    tier: "gold",
    isUnlocked: false,
    unlockCondition: "Complete 5 metas",
  },
  {
    id: "virtual-millionaire",
    name: "Milionário Virtual",
    description: "Simule R$ 1M no simulador para desbloquear",
    icon: "zap",
    tier: "gold",
    isUnlocked: false,
    unlockCondition: "Simule R$ 1M no simulador",
  },
];
