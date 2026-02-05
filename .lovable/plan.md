

## Plano: Rebranding e Dashboard de Alta Performance (MoneyPlan)

### Visao Geral

Este plano transforma a aplicacao de "Frivac$" para "MoneyPlan" com estetica de Fintech de alta renda, incluindo um novo widget de patrimonio, microfone visual no chat, e linguagem premium em toda a interface.

---

## Parte 1: Rebranding Global para "MoneyPlan"

### Arquivos a Atualizar

| Arquivo | Alteracao |
|---------|-----------|
| `index.html` | Titulo da pagina para "MoneyPlan" |
| `src/components/views/ChatView.tsx` | Logo e header para MoneyPlan |
| `src/components/Dashboard.tsx` | Logo e header para MoneyPlan |
| `src/components/layout/NavSidebar.tsx` | Logo no menu lateral |
| `src/components/views/ConquistasView.tsx` | Texto de referencia |
| `src/contexts/GameModeContext.tsx` | Chave localStorage |
| `src/contexts/ConversationContext.tsx` | Chave localStorage |
| `src/hooks/useConversationHistory.ts` | Chave localStorage |

### Novo Icone: Cifrao Estilizado

Substituir o icone `Wallet` por um componente SVG customizado com gradiente neon:

```tsx
// Novo componente: src/components/brand/MoneyPlanLogo.tsx
export function MoneyPlanLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 20, container: 32 },
    md: { icon: 24, container: 40 },
    lg: { icon: 32, container: 56 },
  };

  return (
    <div 
      className="rounded-xl bg-gradient-to-br from-primary/30 to-neon-emerald/20 neon-glow-emerald flex items-center justify-center"
      style={{ width: sizes[size].container, height: sizes[size].container }}
    >
      {/* SVG do Cifrao com gradiente */}
      <svg width={sizes[size].icon} height={sizes[size].icon} viewBox="0 0 24 24">
        <defs>
          <linearGradient id="dollarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(160 84% 50%)" />
            <stop offset="100%" stopColor="hsl(160 84% 35%)" />
          </linearGradient>
        </defs>
        <path
          d="M12 2v2M12 20v2M8 8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2-.9 2-2"
          fill="none"
          stroke="url(#dollarGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
```

### Novo Logo Header

```tsx
<h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight">
  <span className="text-primary text-glow-emerald">Money</span>
  <span className="text-foreground">Plan</span>
</h1>
```

Tipografia:
- Fonte: Inter (ja importada)
- Weight: 700 (font-bold)
- Tracking: tight (mais compacto e moderno)
- "Money" em verde neon com glow
- "Plan" em branco/foreground

---

## Parte 2: Hero Section - Widget de Patrimonio

### Novo Componente: WealthWidget

Criar `src/components/wealth/WealthWidget.tsx`:

```text
+------------------------------------------------------------------+
|                                                                  |
|  Patrimonio Estimado              [Mini Sparkline Verde]  +0%   |
|  R$ 0,00                          ~~~~~~~~~~~~~/\~~~      este  |
|  (Grande, brilhante)                                      mes   |
|                                                                  |
+------------------------------------------------------------------+
```

### Estrutura do Componente

```tsx
export function WealthWidget() {
  // Dados mockados - futuramente virao do banco
  const patrimony = 0;
  const monthlyChange = 0;

  // Dados do sparkline (mockados)
  const sparklineData = [
    { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 },
    { value: 0 }, { value: 0 }, { value: 0 }
  ];

  return (
    <div className="glass-card p-6 mb-6 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="relative flex items-center justify-between">
        {/* Lado Esquerdo */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            Patrimonio Estimado
          </p>
          <p className="text-4xl md:text-5xl font-sans font-bold text-foreground">
            <span className="text-primary text-glow-emerald">R$</span>
            {' '}
            <span>{formatCurrency(patrimony)}</span>
          </p>
        </div>

        {/* Lado Direito */}
        <div className="flex items-center gap-4">
          {/* Mini Sparkline */}
          <div className="w-24 h-12">
            <ResponsiveContainer>
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(160 84% 45%)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Badge de mudanca */}
          <div className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium",
            monthlyChange >= 0 
              ? "bg-primary/20 text-primary" 
              : "bg-destructive/20 text-destructive"
          )}>
            {monthlyChange >= 0 ? '+' : ''}{monthlyChange}%
            <span className="text-xs text-muted-foreground ml-1">este mes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Integracao no ChatView

```tsx
// src/components/views/ChatView.tsx
import { WealthWidget } from "@/components/wealth/WealthWidget";

// Adicionar acima do QueryInput
<WealthWidget />
<div className="glass-card p-6 mb-8">
  <QueryInput onSubmit={handleQuery} isLoading={isLoading} />
</div>
```

---

## Parte 3: Atualizacao da UX do Chat

### Botao de Microfone

Adicionar botao visual de microfone dentro do input:

```tsx
// src/components/QueryInput.tsx
import { Mic } from "lucide-react";

// Dentro do form, no input container
<div className="relative flex-1">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
  <Input
    ref={inputRef}
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Comande suas financas ou registre um investimento..."
    className="pl-12 pr-12 bg-muted/50"
    disabled={isLoading}
    autoFocus
  />
  {/* Botao de Microfone (visual apenas) */}
  <button
    type="button"
    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-primary/20 transition-colors group"
    onClick={() => {
      // TODO: Implementar speech recognition futuramente
      toast({ title: "Em breve", description: "Comando por voz em desenvolvimento" });
    }}
  >
    <Mic className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
  </button>
</div>
```

### Novo Placeholder

Alterar de:
```
"Digite sua pergunta financeira..."
```

Para:
```
"Comande suas financas ou registre um investimento..."
```

### Novas Sugestoes Premium

```tsx
const suggestions = [
  "Quanto rende meu patrimonio",
  "Melhores investimentos do mes",
  "Projecao para aposentadoria",
  "Resumo executivo semanal",
];
```

---

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/components/brand/MoneyPlanLogo.tsx` | Componente do logo com SVG de cifrao |
| `src/components/wealth/WealthWidget.tsx` | Widget de patrimonio glassmorphism |

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `index.html` | Title e meta tags para "MoneyPlan" |
| `src/components/views/ChatView.tsx` | Logo, WealthWidget, header |
| `src/components/Dashboard.tsx` | Logo e header (consistencia) |
| `src/components/layout/NavSidebar.tsx` | Logo no menu lateral |
| `src/components/QueryInput.tsx` | Microfone + placeholder + sugestoes |
| `src/components/views/ConquistasView.tsx` | Texto de incentivo |
| `src/contexts/GameModeContext.tsx` | localStorage key |
| `src/contexts/ConversationContext.tsx` | localStorage key |
| `src/hooks/useConversationHistory.ts` | localStorage key |

---

## Detalhes Visuais

### Paleta de Cores (Mantida)

- **Primary**: Verde Esmeralda Neon (160 84% 39%)
- **Secondary**: Roxo Neon (270 91% 65%)
- **Background**: Deep Navy (#0a0f1c)

### Tipografia Atualizada

| Elemento | Fonte | Weight | Estilo |
|----------|-------|--------|--------|
| Logo "MoneyPlan" | Inter | 700 | tracking-tight |
| Valor Patrimonio | Inter | 700 | text-4xl/5xl |
| Textos gerais | Inter | 400-600 | Mantido |
| Titulos | Space Grotesk | 600-700 | Mantido |

### Efeitos Visuais do WealthWidget

- Glassmorphism: `bg-card/80 backdrop-blur-xl`
- Gradiente sutil no fundo
- Sparkline com cor neon
- Badge com efeito de glow quando positivo

---

## Fluxo Visual Atualizado

### Tela Inicial (Chat)

```text
+------------------------------------------------------------------+
|  [$]  MoneyPlan                     🎮 Modo Jogo [○]             |
+------------------------------------------------------------------+
| [Status Bar quando Game Mode ativo]                               |
+------------------------------------------------------------------+
|                                                                   |
|                    [$] MoneyPlan                                  |
|              Gestao de Patrimonio Inteligente                     |
|                                                                   |
|  +--------------------------------------------------------------+ |
|  |  Patrimonio Estimado           [~~~~~/\~~~]   +0% este mes  | |
|  |  R$ 0,00                                                     | |
|  +--------------------------------------------------------------+ |
|                                                                   |
|  +--------------------------------------------------------------+ |
|  | 🔍 Comande suas financas...                            🎤   | |
|  +--------------------------------------------------------------+ |
|  | Quanto rende | Melhores invest. | Projecao | Resumo          | |
|  +--------------------------------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Consideracoes Tecnicas

### localStorage Keys

Atualizar chaves para manter consistencia:
- `frivacs-game-mode` -> `moneyplan-game-mode`
- `frivacs_conversation_history` -> `moneyplan_conversation_history`

### Migracao de Dados

Adicionar logica de migracao para usuarios existentes:
```typescript
// Migrar dados antigos se existirem
const oldData = localStorage.getItem("frivacs_conversation_history");
if (oldData) {
  localStorage.setItem("moneyplan_conversation_history", oldData);
  localStorage.removeItem("frivacs_conversation_history");
}
```

### Responsividade

- Widget de patrimonio: Stack vertical em mobile
- Sparkline oculto em telas muito pequenas
- Logo adaptavel com icone apenas em collapsed state

