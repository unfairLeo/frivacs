import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { SavedConversation, ApiResponse } from "@/types/api";

 const NEW_STORAGE_KEY = "moneyplan_conversation_history";
 const OLD_STORAGE_KEY = "frivacs_conversation_history";
 // Migration helper
 function migrateConversationData(): SavedConversation[] {
   try {
     const oldData = localStorage.getItem(OLD_STORAGE_KEY);
     if (oldData) {
       localStorage.setItem(NEW_STORAGE_KEY, oldData);
       localStorage.removeItem(OLD_STORAGE_KEY);
       const parsed = JSON.parse(oldData);
       return Array.isArray(parsed) ? parsed : [];
     }
     const newData = localStorage.getItem(NEW_STORAGE_KEY);
     if (newData) {
       const parsed = JSON.parse(newData);
       return Array.isArray(parsed) ? parsed : [];
     }
   } catch (error) {
     console.error("Erro ao migrar histórico:", error);
   }
   return [];
 }
 
const MAX_HISTORY_ITEMS = 50;

interface ConversationContextType {
  history: SavedConversation[];
  selectedId: string | null;
  response: ApiResponse | null;
  isLoading: boolean;
  error: string | null;
  saveConversation: (query: string, response: ApiResponse) => string;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearSelection: () => void;
  setResponse: (response: ApiResponse | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<SavedConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
     setHistory(migrateConversationData());
  }, []);

  const saveConversation = useCallback((query: string, apiResponse: ApiResponse): string => {
    const newConversation: SavedConversation = {
      id: crypto.randomUUID(),
      query,
      response: apiResponse,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const updated = [newConversation, ...prev].slice(0, MAX_HISTORY_ITEMS);
      try {
       localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Erro ao salvar histórico:", error);
      }
      return updated;
    });

    setSelectedId(newConversation.id);
    return newConversation.id;
  }, []);

  const selectConversation = useCallback((id: string) => {
    const conversation = history.find((conv) => conv.id === id);
    if (conversation) {
      setSelectedId(id);
      setResponse(conversation.response);
      setError(null);
    }
  }, [history]);

  const deleteConversation = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((conv) => conv.id !== id);
      try {
       localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Erro ao deletar conversa:", error);
      }
      return updated;
    });

    // If deleted conversation was selected, clear the screen
    if (selectedId === id) {
      setSelectedId(null);
      setResponse(null);
    }
  }, [selectedId]);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    setResponse(null);
    setError(null);
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        history,
        selectedId,
        response,
        isLoading,
        error,
        saveConversation,
        selectConversation,
        deleteConversation,
        clearSelection,
        setResponse,
        setIsLoading,
        setError,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return context;
}
