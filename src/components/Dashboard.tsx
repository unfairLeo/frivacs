import { useState } from "react";
import { Wallet, AlertCircle } from "lucide-react";
import QueryInput from "./QueryInput";
import ResponseCard from "./ResponseCard";
import TotalDisplay from "./TotalDisplay";
import ChartDisplay from "./ChartDisplay";
import { ApiResponse } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

// Replace with your n8n webhook URL
const API_URL = "[COLE_SUA_URL_DO_WEBHOOK_AQUI]";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`Erro na API: ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao consultar a API";
      setError(message);
      toast({
        title: "Erro na consulta",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(hsl(220 20% 18%) 1px, transparent 1px), linear-gradient(90deg, hsl(220 20% 18%) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/20 neon-glow-emerald">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              <span className="text-primary text-glow-emerald">Frivac</span>
              <span className="text-secondary text-glow-purple">$</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Dashboard Financeiro Inteligente
          </p>
        </header>

        {/* Query Input */}
        <div className="glass-card p-6 mb-8">
          <QueryInput onSubmit={handleQuery} isLoading={isLoading} />
        </div>

        {/* Response Area */}
        <div className="space-y-6">
          {/* Error State */}
          {error && (
            <div className="glass-card p-6 border-destructive/50 animate-slide-up">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="glass-card p-12 animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-muted animate-spin border-t-primary" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent animate-ping border-t-primary/30" />
                </div>
                <p className="text-muted-foreground">Analisando seus dados...</p>
              </div>
            </div>
          )}

          {/* Response Content */}
          {response && !isLoading && (
            <>
              {/* Total Display */}
              {response.total !== undefined && (
                <TotalDisplay total={response.total} titulo={response.titulo} />
              )}

              {/* Chart or Text Response */}
              {response.tipo && response.dados ? (
                <ChartDisplay
                  tipo={response.tipo}
                  titulo={response.titulo}
                  dados={response.dados}
                />
              ) : response.texto ? (
                <ResponseCard texto={response.texto} titulo={response.titulo} />
              ) : null}
            </>
          )}

          {/* Empty State */}
          {!response && !isLoading && !error && (
            <div className="glass-card p-12 text-center animate-fade-in">
              <div className="inline-flex p-4 rounded-2xl bg-muted/50 mb-4">
                <Wallet className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                Pronto para começar
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Digite uma pergunta sobre suas finanças acima para receber análises detalhadas e visualizações interativas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
