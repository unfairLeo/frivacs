import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, subDays, isToday, isFuture, eachDayOfInterval } from "date-fns";
import { SavedConversation } from "@/types/api";

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  isActiveToday: boolean;
  activeDaysThisMonth: number;
  totalDaysThisMonth: number;
  activeDatesSet: Set<string>;
}

export function useStreakStats(history: SavedConversation[]): StreakStats {
  return useMemo(() => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");

    // Build set of unique active dates
    const activeDatesSet = new Set<string>();
    for (const conv of history) {
      activeDatesSet.add(format(new Date(conv.timestamp), "yyyy-MM-dd"));
    }

    const isActiveToday = activeDatesSet.has(todayStr);

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = isActiveToday ? today : subDays(today, 1);
    while (activeDatesSet.has(format(checkDate, "yyyy-MM-dd"))) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    }

    // Calculate best streak from sorted dates
    let bestStreak = currentStreak;
    if (activeDatesSet.size > 0) {
      const sortedDates = Array.from(activeDatesSet).sort();
      let streak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const diffDays = Math.round(
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          streak++;
        } else {
          bestStreak = Math.max(bestStreak, streak);
          streak = 1;
        }
      }
      bestStreak = Math.max(bestStreak, streak);
    }

    // Days this month
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const pastOrTodayDays = daysInMonth.filter((d) => !isFuture(d) || isToday(d));
    const totalDaysThisMonth = pastOrTodayDays.length;
    const activeDaysThisMonth = pastOrTodayDays.filter((d) =>
      activeDatesSet.has(format(d, "yyyy-MM-dd"))
    ).length;

    return {
      currentStreak,
      bestStreak,
      isActiveToday,
      activeDaysThisMonth,
      totalDaysThisMonth,
      activeDatesSet,
    };
  }, [history]);
}
