import * as React from "react";
import { Trophy } from "lucide-react";
import { AchievementBadge } from "@/components/achievements/AchievementBadge";
import { INITIAL_ACHIEVEMENTS } from "@/types/achievements";

export function ConquistasView() {
  const achievements = INITIAL_ACHIEVEMENTS;
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;

  // Group by tier for visual hierarchy
  const goldAchievements = achievements.filter((a) => a.tier === "gold");
  const silverAchievements = achievements.filter((a) => a.tier === "silver");
  const bronzeAchievements = achievements.filter((a) => a.tier === "bronze");

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-yellow-500/20 shadow-[0_0_20px_hsl(45_93%_55%/0.3)]">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Conquistas
          </h1>
        </div>
        <p className="text-muted-foreground mb-4">
          Sua coleção de troféus e medalhas
        </p>

        {/* Counter */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="font-medium">
            <span className="text-primary">{unlockedCount}</span>
            <span className="text-muted-foreground">/{totalCount}</span>
          </span>
          <span className="text-sm text-muted-foreground">Conquistas</span>
        </div>
      </header>

      {/* Gold Tier */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-500/50" />
          <h2 className="text-lg font-display font-semibold text-yellow-400 px-4">
            🏆 Lendárias
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-500/50" />
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {goldAchievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>

      {/* Silver Tier */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-400/50" />
          <h2 className="text-lg font-display font-semibold text-slate-300 px-4">
            🥈 Épicas
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-400/50" />
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {silverAchievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>

      {/* Bronze Tier */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-600/50" />
          <h2 className="text-lg font-display font-semibold text-amber-500 px-4">
            🥉 Comuns
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-600/50" />
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {bronzeAchievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>

      {/* Progress hint */}
      <div className="text-center mt-12 p-6 rounded-xl bg-muted/20 border border-border/30">
        <p className="text-muted-foreground text-sm">
          Continue usando o MoneyPlan para desbloquear mais conquistas!
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          Dica: Complete metas, mantenha seu streak e explore o simulador de juros.
        </p>
      </div>
    </div>
  );
}
