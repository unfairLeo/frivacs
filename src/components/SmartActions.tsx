import { useState } from "react";
import { UtensilsCrossed, Car, ShoppingCart, Gamepad2, LucideIcon } from "lucide-react";

interface SmartActionsProps {
  onAction: (text: string) => void;
}

interface ActionItem {
  icon: LucideIcon;
  label: string;
  template: string;
}

const actions: ActionItem[] = [
  { icon: UtensilsCrossed, label: "Alimentação", template: "Gastei R$  em Alimentação" },
  { icon: Car, label: "Transporte", template: "Gastei R$  em Transporte" },
  { icon: ShoppingCart, label: "Mercado", template: "Gastei R$  em Mercado" },
  { icon: Gamepad2, label: "Lazer", template: "Gastei R$  em Lazer" },
];

const SmartActions = ({ onAction }: SmartActionsProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (index: number, template: string) => {
    setActiveIndex(index);
    onAction(template);
    setTimeout(() => setActiveIndex(null), 400);
  };

  return (
    <div className="grid grid-cols-4 gap-4 justify-items-center">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isActive = activeIndex === index;

        return (
          <button
            key={action.label}
            onClick={() => handleClick(index, action.template)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`
                w-16 h-16 rounded-full glass-card border border-border/50
                flex items-center justify-center
                transition-all duration-300
                group-hover:scale-105 group-hover:neon-glow-emerald
                ${isActive ? "animate-bounce-click neon-glow-emerald" : ""}
              `}
            >
              <Icon className="w-6 h-6 text-primary transition-colors duration-300 group-hover:text-primary" />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SmartActions;
