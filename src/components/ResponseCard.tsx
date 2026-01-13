import { MessageSquare } from "lucide-react";

interface ResponseCardProps {
  texto: string;
  titulo?: string;
}

const ResponseCard = ({ texto, titulo }: ResponseCardProps) => {
  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/20 neon-glow-emerald">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          {titulo && (
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">
              {titulo}
            </h3>
          )}
          <p className="text-muted-foreground leading-relaxed">{texto}</p>
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;
