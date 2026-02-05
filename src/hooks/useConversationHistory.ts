import { useState, useEffect, useCallback } from "react";
import { SavedConversation, ApiResponse } from "@/types/api";

 const NEW_STORAGE_KEY = "moneyplan_conversation_history";
 const OLD_STORAGE_KEY = "frivacs_conversation_history";
 // Migration helper
 function migrateData(): SavedConversation[] {
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

export function useConversationHistory() {
  const [history, setHistory] = useState<SavedConversation[]>([]);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
   setHistory(migrateData());
  }, []);

  // Salvar nova conversa
  const saveConversation = useCallback((query: string, response: ApiResponse): string => {
    const newConversation: SavedConversation = {
      id: crypto.randomUUID(),
      query,
      response,
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

    return newConversation.id;
  }, []);

  // Buscar conversa por ID
  const getConversation = useCallback((id: string): SavedConversation | undefined => {
    return history.find((conv) => conv.id === id);
  }, [history]);

  // Deletar conversa
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
  }, []);

  // Limpar todo histórico
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
     localStorage.removeItem(NEW_STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }
  }, []);

  return {
    history,
    saveConversation,
    getConversation,
    deleteConversation,
    clearHistory,
  };
}
