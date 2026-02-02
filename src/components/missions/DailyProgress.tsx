import { Zap, Trophy, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DailyProgressProps {
  completedMissions: number;
  totalMissions: number;
  totalXP: number;
}

export function DailyProgress({ completedMissions, totalMissions, totalXP }: DailyProgressProps) {
  const progressPercent = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;
  const isComplete = completedMissions === totalMissions && totalMissions > 0;

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Progress Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Progresso Diário
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress 
                value={progressPercent} 
                className={cn(
                  "h-3 bg-muted/50",
                  isComplete && "neon-glow-emerald"
                )}
              />
            </div>
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              {completedMissions}/{totalMissions} Missões
            </span>
          </div>
        </div>

        {/* XP Counter */}
        <div className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-xl",
          totalXP > 0 ? "bg-amber-400/20 neon-glow-emerald" : "bg-muted/30"
        )}>
          <div className="p-2 rounded-lg bg-amber-400/30">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-amber-400">
              {totalXP}
            </p>
            <p className="text-xs text-muted-foreground">XP Hoje</p>
          </div>
        </div>

        {/* Achievement Badge */}
        {isComplete && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 border border-primary/50 animate-scale-in">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Dia Completo!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
