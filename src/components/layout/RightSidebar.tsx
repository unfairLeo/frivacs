import { History, MessageSquare, Trash2, PanelRightClose, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversation } from "@/contexts/ConversationContext";
import { useState } from "react";
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

export function RightSidebar() {
  const { history, selectedId, selectConversation, deleteConversation } = useConversation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
  };

  return (
    <div
      className={cn(
        "h-full border-l border-border/30 bg-sidebar transition-all duration-300 flex flex-col",
        isCollapsed ? "w-12" : "w-80"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 neon-glow-emerald">
              <History className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground">Histórico</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-muted/50"
        >
          {isCollapsed ? (
            <PanelRight className="w-5 h-5" />
          ) : (
            <PanelRightClose className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {history.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => selectConversation(conversation.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all duration-300 group",
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
                      {truncateText(conversation.query, 40)}
                    </h4>
                    {conversation.response.conversation && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {truncateText(conversation.response.conversation, 30)}
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
              <div className="text-center py-12">
                <div className="inline-flex p-4 rounded-2xl bg-muted/30 mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Nenhuma conversa ainda
                </p>
                <p className="text-muted-foreground/70 text-xs mt-1">
                  Faça uma pergunta para começar
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {/* Collapsed state */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <History className="w-5 h-5 text-primary" />
          </div>
          {history.length > 0 && (
            <span className="mt-2 text-xs text-muted-foreground">{history.length}</span>
          )}
        </div>
      )}
    </div>
  );
}
