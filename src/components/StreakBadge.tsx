import { Flame } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StreakBadge = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="glass-card border border-border/50 inline-flex items-center gap-2 px-4 py-2.5 rounded-full cursor-default transition-all duration-300 hover:shadow-[0_0_20px_hsl(30_90%_50%/0.4)]">
          <Flame className="w-5 h-5 text-orange-400 animate-pulse-glow drop-shadow-[0_0_6px_hsl(30_90%_50%/0.8)]" />
          <span className="text-sm font-semibold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
            3 Dias
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[240px] text-center">
        <p>Mantenha o foco! Registre gastos diariamente para aumentar sua chama. 🔥</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default StreakBadge;
