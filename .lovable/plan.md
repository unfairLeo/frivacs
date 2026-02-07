

## Limpeza de UI - Remover Redundancias e Consolidar Gamificacao

### Resumo

A gamificacao passa a ser o modo padrao (sempre ativo). O toggle "Modo Jogo", a barra de status flutuante (XP/Nivel/Dias) e todo o sistema de condicional `isGameMode` serao removidos. O Streak Badge permanece consolidado dentro do Patrimony Card, e o Grid de Acoes Rapidas continua fixo acima do chat.

---

### 1. Simplificar o Header (AppLayout.tsx)

**Remover:**
- Import do `GamifiedStatusBar`
- Import do `GameModeProvider` e `useGameMode`
- Import do `Switch`, `Gamepad2` e `cn`
- Todo o bloco do toggle "Modo Jogo" (icone Gamepad2 + texto + Switch)
- A renderizacao condicional `{isGameMode && <GamifiedStatusBar />}`
- O wrapper `<GameModeProvider>` no componente `AppLayout`

**Resultado do header:**
- Mobile: Hamburguer + Logo (como esta)
- Desktop: Header limpo, sem toggle
- O componente `AppLayoutContent` nao precisa mais do hook `useGameMode`

Layout resultante do header:

```text
Desktop:
+------------------------------------------+
|                                          |
+------------------------------------------+

Mobile:
+------------------------------------------+
| [=]   MoneyPlan                          |
+------------------------------------------+
```

---

### 2. Tornar Gamificacao Sempre Ativa (MissionCard.tsx)

**Remover:**
- Import do `useGameMode`
- A chamada `const { isGameMode } = useGameMode()`
- O condicional `{isGameMode && (...)}` ao redor do bloco de XP

**Resultado:** O badge "+XX XP" sera sempre visivel nos cards de missao.

---

### 3. Tornar Gamificacao Sempre Ativa (MissoesView.tsx)

**Remover:**
- Import do `useGameMode`
- A chamada `const { isGameMode } = useGameMode()`
- O condicional `{isGameMode && (...)}` ao redor do `DailyProgress`

**Resultado:** O componente `DailyProgress` sera sempre visivel na pagina de missoes.

---

### 4. Excluir Arquivos Obsoletos

| Arquivo | Acao |
|---------|------|
| `src/contexts/GameModeContext.tsx` | **Excluir** - Nao mais utilizado |
| `src/components/layout/GamifiedStatusBar.tsx` | **Excluir** - Barra de status removida do header |

---

### 5. Manter Intactos (Sem Alteracoes)

- **ChatView.tsx**: O StreakBadge continua ao lado do WealthWidget. O SmartActions Grid continua acima do chat. Nenhuma mudanca necessaria.
- **StreakBadge.tsx**: Sem alteracoes.
- **SmartActions.tsx**: Sem alteracoes.

---

### Resumo das Alteracoes

| Arquivo | Acao |
|---------|------|
| `src/components/layout/AppLayout.tsx` | **Modificar** - Remover toggle, status bar, e GameModeProvider |
| `src/components/missions/MissionCard.tsx` | **Modificar** - Remover condicional isGameMode, XP sempre visivel |
| `src/components/views/MissoesView.tsx` | **Modificar** - Remover condicional isGameMode, DailyProgress sempre visivel |
| `src/contexts/GameModeContext.tsx` | **Excluir** |
| `src/components/layout/GamifiedStatusBar.tsx` | **Excluir** |

### Detalhes Tecnicos

#### AppLayout.tsx - Versao Simplificada

O componente `AppLayoutContent` deixa de usar qualquer hook de game mode. O header fica limpo:

```tsx
// Imports removidos: GamifiedStatusBar, GameModeProvider, useGameMode, Switch, Gamepad2, cn

function AppLayoutContent() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <NavSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border/30 flex items-center px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            {/* Hamburger + Logo - Mobile Only */}
            <div className="flex items-center gap-3 md:hidden">
              <SidebarTrigger className="h-10 w-10" />
              <MoneyPlanLogo size="sm" />
              <span className="text-lg font-bold">...</span>
            </div>
          </header>
          {/* Sem GamifiedStatusBar */}
          <main>...</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function AppLayout() {
  return (
    <ConversationProvider>
      {/* Sem GameModeProvider */}
      <AppLayoutContent />
    </ConversationProvider>
  );
}
```

#### MissionCard.tsx - XP Sempre Visivel

```tsx
// Remover: import { useGameMode } from "@/contexts/GameModeContext";
// Remover: const { isGameMode } = useGameMode();
// Alterar: remover o condicional {isGameMode && (...)} ao redor do bloco de XP

// O bloco de XP passa a ser renderizado sempre:
<div className="flex items-center gap-1 text-amber-400">
  <Zap className="w-4 h-4" />
  <span className="text-sm font-semibold">+{mission.xpReward} XP</span>
</div>
```

#### MissoesView.tsx - DailyProgress Sempre Visivel

```tsx
// Remover: import { useGameMode } from "@/contexts/GameModeContext";
// Remover: const { isGameMode } = useGameMode();
// Alterar: remover o condicional {isGameMode && (...)} ao redor do DailyProgress

// O DailyProgress passa a ser renderizado sempre:
<DailyProgress
  completedMissions={completedMissions}
  totalMissions={missions.length}
  totalXP={totalXP}
/>
```
