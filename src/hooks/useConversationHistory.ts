import { useState, useEffect, useCallback } from "react";
import { SavedConversation, ApiResponse } from "@/types/api";

const STORAGE_KEY = "frivacs_conversation_history";
const MAX_HISTORY_ITEMS = 50;

export function useConversationHistory() {
  const [history, setHistory] = useState<SavedConversation[]>([]);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setHistory([]);
    }
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
      localStorage.removeItem(STORAGE_KEY);
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
