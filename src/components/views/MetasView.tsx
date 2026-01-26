import { Target, Check, Plane, Home, GraduationCap, Car } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Mission {
  id: string;
  title: string;
  completed: boolean;
}

interface Meta {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  icon: keyof typeof iconMap;
  missions: Mission[];
}

const iconMap = {
  plane: Plane,
  home: Home,
  graduation: GraduationCap,
  car: Car,
  target: Target,
};

// Mock data
const mockMetas: Meta[] = [
  {
    id: "1",
    title: "Viagem Japão",
    targetValue: 25000,
    currentValue: 15750,
    icon: "plane",
    missions: [
      { id: "1a", title: "Economizar R$500/mês", completed: true },
      { id: "1b", title: "Vender itens usados", completed: true },
      { id: "1c", title: "Reservar passagem", completed: false },
      { id: "1d", title: "Definir roteiro", completed: false },
    ],
  },
  {
    id: "2",
    title: "Entrada Apartamento",
    targetValue: 80000,
    currentValue: 32000,
    icon: "home",
    missions: [
      { id: "2a", title: "Abrir conta poupança", completed: true },
      { id: "2b", title: "Investir em CDB", completed: true },
      { id: "2c", title: "Cortar gastos supérfluos", completed: false },
    ],
  },
  {
    id: "3",
    title: "Curso de MBA",
    targetValue: 45000,
    currentValue: 45000,
    icon: "graduation",
    missions: [
      { id: "3a", title: "Pesquisar instituições", completed: true },
      { id: "3b", title: "Fazer inscrição", completed: true },
      { id: "3c", title: "Pagar matrícula", completed: true },
    ],
  },
  {
    id: "4",
    title: "Trocar de Carro",
    targetValue: 60000,
    currentValue: 18000,
    icon: "car",
    missions: [
      { id: "4a", title: "Vender carro atual", completed: false },
      { id: "4b", title: "Pesquisar financiamento", completed: true },
      { id: "4c", title: "Juntar entrada", completed: false },
    ],
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function MetasView() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-primary/20 neon-glow-emerald">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Minhas Metas
          </h1>
        </div>
        <p className="text-muted-foreground">
          Acompanhe o progresso das suas metas financeiras
        </p>
      </header>

      {/* Metas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockMetas.map((meta) => {
          const Icon = iconMap[meta.icon] || Target;
          const progress = Math.round((meta.currentValue / meta.targetValue) * 100);
          const isComplete = progress >= 100;
          const completedMissions = meta.missions.filter((m) => m.completed).length;

          return (
            <div
              key={meta.id}
              className="glass-card p-6 transition-all duration-300 hover:border-primary/50 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isComplete
                        ? "bg-primary/30 neon-glow-emerald"
                        : "bg-muted group-hover:bg-primary/20"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isComplete ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground">
                      {meta.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {completedMissions}/{meta.missions.length} missões
                    </p>
                  </div>
                </div>
                {isComplete && (
                  <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    Concluída
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className={isComplete ? "text-primary font-semibold" : "text-foreground"}>
                    {progress}%
                  </span>
                </div>
                <div className="relative">
                  <Progress
                    value={progress}
                    className="h-3 bg-muted"
                  />
                  {isComplete && (
                    <div className="absolute inset-0 h-3 rounded-full bg-primary/20 animate-pulse" />
                  )}
                </div>
                <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                  <span>{formatCurrency(meta.currentValue)}</span>
                  <span>{formatCurrency(meta.targetValue)}</span>
                </div>
              </div>

              {/* Missions List */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Missões
                </p>
                {meta.missions.map((mission) => (
                  <div
                    key={mission.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      mission.completed ? "bg-primary/10" : "bg-muted/30"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        mission.completed
                          ? "bg-primary text-primary-foreground"
                          : "border-2 border-muted-foreground/30"
                      }`}
                    >
                      {mission.completed && <Check className="w-3 h-3" />}
                    </div>
                    <span
                      className={`text-sm ${
                        mission.completed
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {mission.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
