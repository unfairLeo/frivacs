 const NEW_STORAGE_KEY = "moneyplan-game-mode";
 const OLD_STORAGE_KEY = "frivacs-game-mode";
 
 // Migration helper
 function migrateGameModeData(): boolean {
   const oldData = localStorage.getItem(OLD_STORAGE_KEY);
   if (oldData) {
     localStorage.setItem(NEW_STORAGE_KEY, oldData);
     localStorage.removeItem(OLD_STORAGE_KEY);
     return JSON.parse(oldData);
   }
   const newData = localStorage.getItem(NEW_STORAGE_KEY);
   return newData ? JSON.parse(newData) : false;
 }
 
import * as React from "react";
import { createContext, useContext, useState, ReactNode } from "react";

interface GameModeContextType {
  isGameMode: boolean;
  toggleGameMode: () => void;
}

const GameModeContext = createContext<GameModeContextType | undefined>(undefined);

export function GameModeProvider({ children }: { children: ReactNode }) {
   const [isGameMode, setIsGameMode] = useState(() => migrateGameModeData());

  const toggleGameMode = () => {
    setIsGameMode((prev: boolean) => {
      const newValue = !prev;
       localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <GameModeContext.Provider value={{ isGameMode, toggleGameMode }}>
      {children}
    </GameModeContext.Provider>
  );
}

export function useGameMode() {
  const context = useContext(GameModeContext);
  if (context === undefined) {
    throw new Error("useGameMode must be used within a GameModeProvider");
  }
  return context;
}
