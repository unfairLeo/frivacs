import { cn } from "@/lib/utils";

interface MoneyPlanLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MoneyPlanLogo({ size = "md", className }: MoneyPlanLogoProps) {
  const sizes = {
    sm: { icon: 20, container: 32 },
    md: { icon: 24, container: 40 },
    lg: { icon: 32, container: 56 },
  };

  return (
    <div
      className={cn(
        // Mantive todas as suas classes originais para preservar o estilo do "box" brilhante
        "rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 neon-glow-emerald flex items-center justify-center flex-shrink-0",
        className
      )}
      style={{ width: sizes[size].container, height: sizes[size].container }}
    >
      {/* --- INÍCIO DA ALTERAÇÃO --- */}
      {/* Removi o <svg> e adicionei a <img> aqui dentro */}
      <img 
        src="/logo-renew.png"  // Certifique-se de que a imagem está na pasta 'public' com este nome
        alt="MoneyPlan Logo"
        className="w-full h-full object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity"
      />
      {/* --- FIM DA ALTERAÇÃO --- */}
    </div>
  );
}
