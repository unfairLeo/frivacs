import * as React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NavSidebar } from "./NavSidebar";
import { GamifiedStatusBar } from "./GamifiedStatusBar";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { GameModeProvider, useGameMode } from "@/contexts/GameModeContext";
import { Switch } from "@/components/ui/switch";
import { Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

function AppLayoutContent() {
  const { isGameMode, toggleGameMode } = useGameMode();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Left Navigation Sidebar */}
        <NavSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-14 border-b border-border/30 flex items-center justify-end px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-40">

            {/* Game Mode Toggle */}
            <div className="flex items-center gap-3">
              <Gamepad2
                className={cn(
                  "w-5 h-5 transition-colors",
                  isGameMode ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="text-sm text-muted-foreground hidden md:inline">
                Modo Jogo
              </span>
              <Switch
                checked={isGameMode}
                onCheckedChange={toggleGameMode}
                className={cn(
                  isGameMode && "data-[state=checked]:bg-primary neon-glow-emerald"
                )}
              />
            </div>
          </header>

          {/* Gamified Status Bar - only visible in Game Mode */}
          {isGameMode && <GamifiedStatusBar />}

          {/* Content */}
          <main className="flex-1 overflow-auto">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
              <div
                className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float"
                style={{ animationDelay: "-3s" }}
              />
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(220 20% 18%) 1px, transparent 1px), linear-gradient(90deg, hsl(220 20% 18%) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />
            </div>

            {/* Page Content */}
            <div className="relative z-10">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Right History Sidebar */}
        <RightSidebar />
      </div>
    </SidebarProvider>
  );
}

export function AppLayout() {
  return (
    <ConversationProvider>
      <GameModeProvider>
        <AppLayoutContent />
      </GameModeProvider>
    </ConversationProvider>
  );
}
