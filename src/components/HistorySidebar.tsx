import { useState } from "react";
import { History, MessageSquare, Menu, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationHistory {
  id: string;
  title: string;
  preview: string;
  date: string;
}

// Mock data for conversation history
const mockHistory: ConversationHistory[] = [
  {
    id: "1",
    title: "Gastos de Hotel",
    preview: "Análise dos gastos com hospedagem...",
    date: "Hoje",
  },
  {
    id: "2",
    title: "Despesas do Mês",
    preview: "Resumo das despesas de dezembro...",
    date: "Ontem",
  },
  {
    id: "3",
    title: "Viagens Corporativas",
    preview: "Relatório de viagens Q4...",
    date: "3 dias atrás",
  },
  {
    id: "4",
    title: "Gastos por Categoria",
    preview: "Distribuição por categorias...",
    date: "1 semana atrás",
  },
  {
    id: "5",
    title: "Orçamento Anual",
    preview: "Planejamento financeiro 2024...",
    date: "2 semanas atrás",
  },
];

interface HistorySidebarProps {
  onSelectConversation?: (id: string) => void;
}

const HistorySidebar = ({ onSelectConversation }: HistorySidebarProps) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectConversation?.(id);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 glass-card hover:bg-primary/20 hover:text-primary transition-all duration-300"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-background/95 backdrop-blur-xl border-r border-border/50 p-0">
        <SheetHeader className="p-6 border-b border-border/50">
          <SheetTitle className="flex items-center gap-3 text-foreground">
            <div className="p-2 rounded-lg bg-primary/20 neon-glow-emerald">
              <History className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display">Histórico</span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="p-4 space-y-2">
            {mockHistory.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleSelect(conversation.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                  selectedId === conversation.id
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    selectedId === conversation.id
                      ? "bg-primary/30 text-primary"
                      : "bg-muted text-muted-foreground group-hover:text-foreground"
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium truncate transition-colors ${
                      selectedId === conversation.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}>
                      {conversation.title}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.preview}
                    </p>
                    <span className="text-xs text-muted-foreground/70 mt-2 block">
                      {conversation.date}
                    </span>
                  </div>
                </div>
              </button>
            ))}

            {mockHistory.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex p-4 rounded-2xl bg-muted/30 mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Nenhuma conversa ainda
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HistorySidebar;
