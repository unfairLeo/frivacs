import { TrendingUp } from "lucide-react";

interface TotalDisplayProps {
  total: number;
  titulo?: string;
}

const TotalDisplay = ({ total, titulo }: TotalDisplayProps) => {
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(total);

  return (
    <div className="gradient-border rounded-xl p-6 bg-card animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            {titulo || 'Total'}
          </p>
          <p className="text-3xl font-display font-bold text-primary text-glow-emerald">
            {formattedTotal}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-primary/20 neon-glow-emerald animate-pulse-glow">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default TotalDisplay;
