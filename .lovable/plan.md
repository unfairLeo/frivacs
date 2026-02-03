

## Plano: Switch de "Modo Jogo" vs "Modo Foco"

### Visao Geral

Criar um toggle global que controla a visibilidade dos elementos gamificados em toda a aplicacao, permitindo ao usuario alternar entre uma interface profissional limpa e uma interface com elementos de gamificacao (XP, Streak, progresso).

---

### Arquitetura da Solucao

```text
+------------------------+
|     GameModeContext    |  <-- Estado global (React Context)
|  - isGameMode: boolean |
|  - toggleGameMode()    |
+------------------------+
            |
            v
+------------------------+        +------------------------+
|      AppLayout         |        |    Todas as Views      |
|   (Header com Toggle)  |        |  (Consomem o contexto) |
+------------------------+        +------------------------+
```

---

### Parte 1: Criar Contexto de Game Mode

**Novo arquivo:** `src/contexts/GameModeContext.tsx`

```typescript
interface GameModeContextType {
  isGameMode: boolean;
  toggleGameMode: () => void;
}
```

Funcionalidades:
- Estado `isGameMode` (default: `false` para modo foco)
- Funcao `toggleGameMode` para alternar
- Persistencia no `localStorage` para lembrar preferencia do usuario

---

### Parte 2: Adicionar Toggle no Header (AppLayout)

**Arquivo:** `src/components/layout/AppLayout.tsx`

Adicionar no header (canto direito, ao lado do SidebarTrigger):

```text
+-------------------------------------------------------+
| [≡]                                 🎮 Modo Jogo [○] |
+-------------------------------------------------------+
```

Componentes:
- Icone `Gamepad2` do lucide-react
- Texto "Modo Jogo" 
- Componente `Switch` do shadcn/ui
- Estilo neon quando ativo

---

### Parte 3: Barra de Status Gamificada Global

**Novo arquivo:** `src/components/layout/GamifiedStatusBar.tsx`

Componente que aparece abaixo do header quando Game Mode esta ativo:

```text
+-------------------------------------------------------+
| 🔥 7 dias    |    ⚡ 285 XP    |    🎯 Nivel 3        |
+-------------------------------------------------------+
```

Caracteristicas:
- Animacao de "slide-down" ao aparecer
- Dados mockados inicialmente (streak, XP total, nivel)
- Estilo glassmorphism consistente

---

### Parte 4: Animacao de Transicao

**Arquivo:** `tailwind.config.ts`

Adicionar keyframe para slide-down:

```typescript
keyframes: {
  "slide-down": {
    from: { opacity: "0", height: "0", transform: "translateY(-10px)" },
    to: { opacity: "1", height: "auto", transform: "translateY(0)" },
  },
  "slide-up-hide": {
    from: { opacity: "1", height: "auto", transform: "translateY(0)" },
    to: { opacity: "0", height: "0", transform: "translateY(-10px)" },
  },
}
```

---

### Parte 5: Condicionar Elementos Gamificados nas Views

Componentes que serao condicionais ao `isGameMode`:

| Componente | Arquivo | Comportamento |
|------------|---------|---------------|
| `DailyProgress` | MissoesView.tsx | Esconder quando Modo Foco |
| XP badges | MissionCard.tsx | Esconder/mostrar |
| GamifiedStatusBar | AppLayout.tsx | Slide down/up |

---

### Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/contexts/GameModeContext.tsx` | Contexto global para estado do modo |
| `src/components/layout/GamifiedStatusBar.tsx` | Barra de status com streak/XP/nivel |

---

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/layout/AppLayout.tsx` | Adicionar toggle + status bar |
| `src/components/views/MissoesView.tsx` | Condicionar DailyProgress |
| `src/components/missions/MissionCard.tsx` | Condicionar badge XP |
| `tailwind.config.ts` | Adicionar animacao slide-down |
| `src/index.css` | Adicionar classes de animacao |

---

### Detalhes de Implementacao

**GameModeContext:**

```tsx
export function GameModeProvider({ children }: { children: React.ReactNode }) {
  const [isGameMode, setIsGameMode] = useState(() => {
    const saved = localStorage.getItem("frivacs-game-mode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleGameMode = () => {
    setIsGameMode((prev) => {
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
```

**Toggle no Header:**

```tsx
<div className="flex items-center gap-3">
  <Gamepad2 className={cn(
    "w-5 h-5 transition-colors",
    isGameMode ? "text-primary" : "text-muted-foreground"
  )} />
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
```

**GamifiedStatusBar:**

```tsx
export function GamifiedStatusBar() {
  // Dados mockados - futuramente virao de um contexto de progresso
  const streak = 7;
  const totalXP = 285;
  const level = 3;

  return (
    <div className="h-12 border-b border-border/30 bg-card/60 backdrop-blur-sm flex items-center justify-center gap-8 animate-slide-down">
      {/* Streak */}
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-400 animate-pulse-glow" />
        <span className="text-sm font-medium">
          <span className="text-orange-400">{streak}</span>
          <span className="text-muted-foreground ml-1">dias</span>
        </span>
      </div>
      
      {/* XP */}
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-400" />
        <span className="text-sm font-medium">
          <span className="text-amber-400">{totalXP}</span>
          <span className="text-muted-foreground ml-1">XP</span>
        </span>
      </div>
      
      {/* Level */}
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium">
          <span className="text-primary">Nivel {level}</span>
        </span>
      </div>
    </div>
  );
}
```

---

### Fluxo Visual

**Modo Foco (Default):**

```text
+-------------------------------------------------------+
| [≡]                                 🎮 Modo Jogo [○] |
+-------------------------------------------------------+
|                                                       |
|                   Frivac$ Logo                        |
|              Dashboard Limpo e Profissional           |
|                                                       |
+-------------------------------------------------------+
```

**Modo Jogo (Ativado):**

```text
+-------------------------------------------------------+
| [≡]                                 🎮 Modo Jogo [●] |
+-------------------------------------------------------+
| 🔥 7 dias   |   ⚡ 285 XP   |   🎯 Nivel 3            |  <-- Slide down
+-------------------------------------------------------+
|                                                       |
|                   Frivac$ Logo                        |
|        + Barra de Progresso Diario visivel            |
|        + Badges de XP nas missoes                     |
|                                                       |
+-------------------------------------------------------+
```

---

### Comportamento por Tela

| Tela | Modo Foco | Modo Jogo |
|------|-----------|-----------|
| Chat | Apenas logo + chat | Logo + Status Bar |
| Metas | Cards de metas | Cards + progresso visual |
| Missoes | Cards simples | DailyProgress + XP badges |
| Personalidades | Cards visuais | Cards + indicadores |

---

### Estilo do Toggle

Quando ativado:
- Switch com `bg-primary` (verde neon)
- Glow sutil: `neon-glow-emerald`
- Icone `Gamepad2` muda para `text-primary`

Quando desativado:
- Switch com `bg-input` (cinza escuro)
- Sem glow
- Icone `Gamepad2` em `text-muted-foreground`

