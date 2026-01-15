import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

import { useRef } from "react";

const QueryInput = ({ onSubmit, isLoading }: QueryInputProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery(""); // Clear input after submit
      // Refocus the input after a small delay
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const suggestions = [
    "Meus gastos de hotel",
    "Despesas do mês",
    "Resumo de viagens",
    "Gastos por categoria",
  ];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite sua pergunta financeira..."
            className="pl-12 bg-muted/50"
            disabled={isLoading}
            autoFocus
          />
        </div>
        <Button
          type="submit"
          variant="neon"
          size="lg"
          disabled={!query.trim() || isLoading}
          className="min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analisando</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Perguntar</span>
            </>
          )}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Sugestões:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setQuery(suggestion)}
            disabled={isLoading}
            className="text-sm px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300 disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QueryInput;
