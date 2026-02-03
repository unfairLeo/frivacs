import * as React from "react";
import { createContext, useContext, useState, ReactNode } from "react";

interface GameModeContextType {
  isGameMode: boolean;
  toggleGameMode: () => void;
}

const GameModeContext = createContext<GameModeContextType | undefined>(undefined);

export function GameModeProvider({ children }: { children: ReactNode }) {
  const [isGameMode, setIsGameMode] = useState(() => {
    const saved = localStorage.getItem("frivacs-game-mode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleGameMode = () => {
    setIsGameMode((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem("frivacs-game-mode", JSON.stringify(newValue));
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
