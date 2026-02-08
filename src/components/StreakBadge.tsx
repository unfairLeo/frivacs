import { useState } from "react";
import { Flame } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConversation } from "@/contexts/ConversationContext";
import { useStreakStats } from "@/hooks/useStreakStats";
import { StreakCalendarDialog } from "@/components/streak/StreakCalendarDialog";
import { cn } from "@/lib/utils";

const StreakBadge = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { history } = useConversation();
  const stats = useStreakStats(history);

  const streakText =
    stats.currentStreak > 0
      ? `${stats.currentStreak} Dia${stats.currentStreak > 1 ? "s" : ""}`
      : "Comece!";

  const tooltipMessage = stats.isActiveToday
    ? `${stats.currentStreak} dia${stats.currentStreak > 1 ? "s" : ""} seguido${stats.currentStreak > 1 ? "s" : ""}! Continue assim. 🔥`
    : "Registre algo hoje para manter sua ofensiva! 🔥";

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setDialogOpen(true)}
            className="glass-card border border-border/50 inline-flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_hsl(30_90%_50%/0.4)] active:scale-95"
          >
            <Flame
              className={cn(
                "w-5 h-5 text-orange-400 drop-shadow-[0_0_6px_hsl(30_90%_50%/0.8)]",
                stats.isActiveToday ? "animate-pulse-glow" : "animate-pulse"
              )}
            />
            <span className="text-sm font-semibold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
              {streakText}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[240px] text-center">
          <p>{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>

      <StreakCalendarDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        stats={stats}
      />
    </>
  );
};

export default StreakBadge;
