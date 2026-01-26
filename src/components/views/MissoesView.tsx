import { Rocket } from "lucide-react";

export function MissoesView() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-secondary/20 neon-glow-purple">
            <Rocket className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Missões
          </h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie suas missões e objetivos diários
        </p>
      </header>

      {/* Placeholder Content */}
      <div className="glass-card p-12 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-muted/50 mb-4">
          <Rocket className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          Em breve
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          O módulo de Missões está em desenvolvimento. Aqui você poderá criar e acompanhar
          tarefas diárias para alcançar suas metas financeiras.
        </p>
      </div>
    </div>
  );
}
