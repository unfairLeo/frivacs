import * as React from "react";
import { Flame, Zap, Target } from "lucide-react";

export function GamifiedStatusBar() {
  // Dados mockados - futuramente virão de um contexto de progresso
  const streak = 7;
  const totalXP = 285;
  const level = 3;

  return (
    <div className="h-12 border-b border-border/30 bg-card/60 backdrop-blur-sm flex items-center justify-center gap-8 animate-slide-down overflow-hidden">
      {/* Streak */}
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-400 animate-pulse-glow" />
        <span className="text-sm font-medium">
          <span className="text-orange-400">{streak}</span>
          <span className="text-muted-foreground ml-1">dias</span>
        </span>
      </div>

      {/* Separator */}
      <div className="h-4 w-px bg-border/50" />

      {/* XP */}
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-400" />
        <span className="text-sm font-medium">
          <span className="text-amber-400">{totalXP}</span>
          <span className="text-muted-foreground ml-1">XP</span>
        </span>
      </div>

      {/* Separator */}
      <div className="h-4 w-px bg-border/50" />

      {/* Level */}
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium">
          <span className="text-primary">Nível {level}</span>
        </span>
      </div>
    </div>
  );
}
