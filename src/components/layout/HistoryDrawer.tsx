import { History, MessageSquare, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useConversation } from "@/contexts/ConversationContext";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Helper function for relative date formatting
function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) return "Agora";
      return `${minutes} min atrás`;
    }
    return `${hours}h atrás`;
  }
  if (days === 1) return "Ontem";
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} semana${weeks > 1 ? "s" : ""} atrás`;
  }
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

// Truncate long text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function HistoryDrawer() {
  const { history, selectedId, selectConversation, deleteConversation } = useConversation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-4 px-4 py-4 min-h-[52px] w-full rounded-xl",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            "transition-all duration-300 group"
          )}
        >
          <History className="w-6 h-6 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {!isCollapsed && (
            <>
              <span className="font-medium flex-1 text-left">Histórico</span>
              {history.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="bg-primary/20 text-primary border-primary/30 text-xs"
                >
                  {history.length}
                </Badge>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-96 bg-sidebar border-border/30 p-0">
        <SheetHeader className="p-6 border-b border-border/30">
          <SheetTitle className="flex items-center gap-3 text-foreground">
            <div className="p-2 rounded-lg bg-primary/20 neon-glow-emerald">
              <History className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display">Histórico de Conversas</span>
            {history.length > 0 && (
              <Badge variant="secondary" className="bg-muted text-muted-foreground ml-auto">
                {history.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-100px)]">
          <div className="p-4 space-y-2">
            {history.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => selectConversation(conversation.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl transition-all duration-300 group",
                  selectedId === conversation.id
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-colors flex-shrink-0",
                      selectedId === conversation.id
                        ? "bg-primary/30 text-primary"
                        : "bg-muted text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={cn(
                        "font-medium transition-colors text-sm leading-tight",
                        selectedId === conversation.id
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      {truncateText(conversation.query, 50)}
                    </h4>
                    {conversation.response.conversation && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {truncateText(conversation.response.conversation, 40)}
                      </p>
                    )}
                    <span className="text-xs text-muted-foreground/70 mt-2 block">
                      {formatRelativeDate(conversation.timestamp)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, conversation.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-all"
                    title="Deletar conversa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </button>
            ))}

            {history.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex p-4 rounded-2xl bg-muted/30 mb-4">
                  <MessageSquare className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  Nenhuma conversa ainda
                </p>
                <p className="text-muted-foreground/70 text-xs mt-1">
                  Faça uma pergunta para começar
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
