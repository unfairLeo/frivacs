import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Flame, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { StreakStats } from "@/hooks/useStreakStats";

interface StreakCalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: StreakStats;
}

export function StreakCalendarDialog({ open, onOpenChange, stats }: StreakCalendarDialogProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart); // 0 = Sunday
  const monthLabel = format(today, "MMMM", { locale: ptBR });

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-xl font-bold">
            <Flame className="w-6 h-6 text-orange-400 drop-shadow-[0_0_8px_hsl(30_90%_50%/0.8)]" />
            Sua Ofensiva
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {stats.currentStreak > 0
              ? `${stats.currentStreak} dia${stats.currentStreak > 1 ? "s" : ""} consecutivo${stats.currentStreak > 1 ? "s" : ""}`
              : "Comece sua ofensiva hoje!"}
          </DialogDescription>
        </DialogHeader>

        {/* Calendar grid */}
        <div className="mt-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {daysInMonth.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const isActive = stats.activeDatesSet.has(dateStr);
              const isTodayDate = isToday(day);
              const isFutureDate = isFuture(day) && !isTodayDate;

              return (
                <div
                  key={dateStr}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200",
                    isFutureDate && "opacity-30",
                    isActive && "bg-primary/20 border-2 border-primary shadow-[0_0_10px_hsl(160_84%_39%/0.3)] text-primary",
                    !isActive && !isFutureDate && "border border-border/40 text-muted-foreground",
                    isTodayDate && isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    isTodayDate && !isActive && "ring-2 ring-orange-400/60 ring-offset-2 ring-offset-background border-orange-400/40"
                  )}
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats footer */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="glass-card p-3 text-center rounded-lg">
            <Flame className="w-4 h-4 mx-auto mb-1 text-orange-400" />
            <p className="text-lg font-bold text-foreground">{stats.currentStreak}</p>
            <p className="text-[10px] text-muted-foreground">Atual</p>
          </div>
          <div className="glass-card p-3 text-center rounded-lg">
            <Trophy className="w-4 h-4 mx-auto mb-1 text-amber-400" />
            <p className="text-lg font-bold text-foreground">{stats.bestStreak}</p>
            <p className="text-[10px] text-muted-foreground">Melhor</p>
          </div>
          <div className="glass-card p-3 text-center rounded-lg">
            <Target className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold text-foreground">
              {stats.activeDaysThisMonth}/{stats.totalDaysThisMonth}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">{monthLabel}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
