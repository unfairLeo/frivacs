import { MetricItem } from "@/types/api";
import { getIcon } from "@/lib/iconMap";

interface MetricsGridProps {
  metrics: MetricItem[];
}

const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      {metrics.map((metric, index) => {
        const IconComponent = getIcon(metric.icon);
        
        return (
          <div
            key={index}
            className="glass-card p-5 group hover:border-primary/40 transition-all duration-300 hover:scale-[1.02]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-1 truncate">
              {metric.label}
            </p>
            
            <p className="text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
