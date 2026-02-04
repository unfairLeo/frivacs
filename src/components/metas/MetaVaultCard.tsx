import * as React from "react";
import { Plane, Home, GraduationCap, Car, Target, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Meta } from "@/types/metas";
import { CircularProgress } from "./CircularProgress";
import { cn } from "@/lib/utils";

const iconMap = {
  plane: Plane,
  home: Home,
  graduation: GraduationCap,
  car: Car,
  target: Target,
};

interface MetaVaultCardProps {
  meta: Meta;
  onEdit: (meta: Meta) => void;
  onAddFunds: (meta: Meta) => void;
}

export function MetaVaultCard({ meta, onEdit, onAddFunds }: MetaVaultCardProps) {
  const progress = Math.min((meta.currentValue / meta.targetValue) * 100, 100);
  const isNearComplete = progress >= 80;
  const isComplete = progress >= 100;

  const Icon = iconMap[meta.icon] || Target;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Intl.DateTimeFormat("pt-BR", {
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div
      className={cn(
        "glass-card p-6 flex flex-col items-center transition-all duration-500 relative overflow-hidden group",
        isNearComplete && !isComplete && "animate-glow-pulse border-primary/50",
        isComplete && "border-primary/70 neon-glow-emerald"
      )}
    >
      {/* Edit button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onEdit(meta)}
      >
        <Edit2 className="w-4 h-4" />
      </Button>

      {/* Near complete badge */}
      {isNearComplete && !isComplete && (
        <Badge className="absolute top-3 left-3 bg-primary/20 text-primary animate-pulse">
          🔥 Reta Final!
        </Badge>
      )}

      {/* Complete badge */}
      {isComplete && (
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          ✅ Concluída!
        </Badge>
      )}

      {/* Vault Icon with Circular Progress */}
      <div className="relative mb-4">
        <CircularProgress
          value={progress}
          size={140}
          strokeWidth={10}
          isNearComplete={isNearComplete}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "p-4 rounded-full transition-all",
              isComplete
                ? "bg-primary/30 text-primary"
                : "bg-muted/50 text-foreground"
            )}
          >
            <Icon className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-xl mb-1 text-center">
        {meta.title}
      </h3>

      {/* Deadline */}
      {meta.deadline && (
        <p className="text-xs text-muted-foreground mb-3">
          Meta: {formatDate(meta.deadline)}
        </p>
      )}

      {/* Values */}
      <div className="text-center mb-4">
        <p className="text-lg font-semibold">
          <span className="text-primary">{formatCurrency(meta.currentValue)}</span>
          <span className="text-muted-foreground mx-1">/</span>
          <span>{formatCurrency(meta.targetValue)}</span>
        </p>
        <Badge
          variant="secondary"
          className={cn(
            "mt-2",
            isComplete && "bg-primary/20 text-primary",
            isNearComplete && !isComplete && "bg-secondary/20 text-secondary"
          )}
        >
          {Math.round(progress)}% Concluído
        </Badge>
      </div>

      {/* Missions count */}
      <p className="text-xs text-muted-foreground mb-4">
        {meta.missions.filter((m) => m.completed).length}/{meta.missions.length}{" "}
        missões concluídas
      </p>

      {/* Quick Add Button */}
      {!isComplete && (
        <Button
          onClick={() => onAddFunds(meta)}
          variant="outline"
          className="gap-2 w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50"
        >
          <Plus className="w-4 h-4" />
          Adicionar R$
        </Button>
      )}
    </div>
  );
}
