import { useState } from "react";
import { Check, Plus, Plane, Home, GraduationCap, Car, Target } from "lucide-react";
import { Meta, Mission } from "@/types/metas";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const iconMap = {
  plane: Plane,
  home: Home,
  graduation: GraduationCap,
  car: Car,
  target: Target,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface MetaCardProps {
  meta: Meta;
  onEdit: (meta: Meta) => void;
  onToggleMission: (metaId: string, missionId: string) => void;
  onAddMission: (metaId: string, missionTitle: string) => void;
}

export function MetaCard({ meta, onEdit, onToggleMission, onAddMission }: MetaCardProps) {
  const [isAddingMission, setIsAddingMission] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState("");

  const Icon = iconMap[meta.icon] || Target;
  const progress = Math.min(Math.round((meta.currentValue / meta.targetValue) * 100), 100);
  const isComplete = progress >= 100;
  const completedMissions = meta.missions.filter((m) => m.completed).length;

  const handleAddMission = () => {
    if (newMissionTitle.trim()) {
      onAddMission(meta.id, newMissionTitle.trim());
      setNewMissionTitle("");
      setIsAddingMission(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddMission();
    } else if (e.key === "Escape") {
      setIsAddingMission(false);
      setNewMissionTitle("");
    }
  };

  return (
    <div className="glass-card p-6 transition-all duration-300 hover:border-primary/50 group">
      {/* Header - Clickable for edit */}
      <div
        onClick={() => onEdit(meta)}
        className="cursor-pointer"
      >
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
            <Progress value={progress} className="h-3 bg-muted" />
            {isComplete && (
              <div className="absolute inset-0 h-3 rounded-full bg-primary/20 animate-pulse" />
            )}
          </div>
          <div className="flex justify-between text-xs mt-2 text-muted-foreground">
            <span>{formatCurrency(meta.currentValue)}</span>
            <span>{formatCurrency(meta.targetValue)}</span>
          </div>
        </div>
      </div>

      {/* Missions List - Not clickable for edit */}
      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
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
            <Checkbox
              checked={mission.completed}
              onCheckedChange={() => onToggleMission(meta.id, mission.id)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span
              className={`text-sm ${
                mission.completed
                  ? "text-foreground line-through opacity-70"
                  : "text-muted-foreground"
              }`}
            >
              {mission.title}
            </span>
          </div>
        ))}

        {/* Add Mission */}
        {isAddingMission ? (
          <div className="flex items-center gap-2 p-2">
            <Input
              value={newMissionTitle}
              onChange={(e) => setNewMissionTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nome da missão..."
              className="h-8 text-sm bg-muted/50 border-border/50"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleAddMission}
              className="h-8 px-3 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingMission(true)}
            className="flex items-center gap-2 p-2 w-full rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Adicionar missão</span>
          </button>
        )}
      </div>
    </div>
  );
}
