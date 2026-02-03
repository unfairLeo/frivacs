import { Coffee, Search, Handshake, Brain, PiggyBank, MessageSquare, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { EntrepreneurMission, categoryConfig } from "@/types/missions";
import { useGameMode } from "@/contexts/GameModeContext";

const categoryIcons = {
  roi: Coffee,
  mindset: Brain,
  negotiation: Handshake,
  saving: PiggyBank,
};

interface MissionCardProps {
  mission: EntrepreneurMission;
  onToggle: (id: string) => void;
}

export function MissionCard({ mission, onToggle }: MissionCardProps) {
  const config = categoryConfig[mission.category];
  const Icon = categoryIcons[mission.category];
  const { isGameMode } = useGameMode();

  return (
    <div
      className={cn(
        "glass-card p-5 transition-all duration-300 group",
        mission.completed && "border-primary/50 neon-glow-emerald"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg", config.bgColor)}>
            <Icon className={cn("w-4 h-4", config.color)} />
          </div>
          <Badge variant="outline" className={cn("text-xs", config.color, "border-current")}>
            {config.label}
          </Badge>
        </div>
        
        {isGameMode && (
          <div className="flex items-center gap-1 text-amber-400">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">+{mission.xpReward} XP</span>
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className={cn(
        "font-display font-semibold text-foreground mb-2 transition-colors",
        mission.completed && "text-primary"
      )}>
        {mission.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {mission.description}
      </p>

      {/* Action */}
      <button
        onClick={() => onToggle(mission.id)}
        className={cn(
          "flex items-center gap-3 w-full p-3 rounded-lg border transition-all duration-300",
          mission.completed
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
        )}
      >
        <Checkbox
          checked={mission.completed}
          className={cn(
            "h-5 w-5 rounded-md",
            mission.completed && "border-primary bg-primary"
          )}
        />
        <span className="text-sm font-medium">
          {mission.completed ? "Completada!" : "Marcar como concluída"}
        </span>
      </button>
    </div>
  );
}
