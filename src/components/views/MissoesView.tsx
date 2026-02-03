import { useState } from "react";
import { Flame } from "lucide-react";
import { MissionCard } from "@/components/missions/MissionCard";
import { DailyProgress } from "@/components/missions/DailyProgress";
import { EntrepreneurMission, defaultMissions } from "@/types/missions";
import { useGameMode } from "@/contexts/GameModeContext";

export function MissoesView() {
  const [missions, setMissions] = useState<EntrepreneurMission[]>(defaultMissions);
  const { isGameMode } = useGameMode();

  const handleToggleMission = (id: string) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id ? { ...mission, completed: !mission.completed } : mission
      )
    );
  };

  const completedMissions = missions.filter((m) => m.completed).length;
  const totalXP = missions
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.xpReward, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-orange-400/20 shadow-[0_0_20px_hsl(30_84%_50%/0.4)]">
            <Flame className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Treinamento Empreendedor
          </h1>
        </div>
        <p className="text-muted-foreground">
          Desenvolva sua mentalidade de riqueza com desafios diários
        </p>
      </header>

      {/* Daily Progress - only visible in Game Mode */}
      {isGameMode && (
        <DailyProgress
          completedMissions={completedMissions}
          totalMissions={missions.length}
          totalXP={totalXP}
        />
      )}

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onToggle={handleToggleMission}
          />
        ))}
      </div>
    </div>
  );
}
