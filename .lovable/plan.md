

## Plano: Expansao da Aplicacao - Metas Cofres, Simulador de Juros e Conquistas

### Visao Geral

Este plano adiciona tres novas funcionalidades mantendo o estilo "Dark Mode Neon" do projeto:

1. **Redesign da pagina Metas** - Transformar cards em "Cofres Digitais" com barra de progresso circular e efeito glow pulsante para metas >80%
2. **Componente "Maquina do Tempo"** - Simulador de juros compostos interativo com sliders e grafico de area em tempo real
3. **Nova pagina "Conquistas"** - Galeria hexagonal de trofeus com estados bloqueado/desbloqueado

---

## Parte 1: Redesign da Pagina Metas (Cofres Digitais)

### Novo Componente: MetaVaultCard

Substituir o `MetaCard` atual por um design de "Cofre Digital":

```text
+----------------------------------------+
|         💰 COFRE DIGITAL               |
|                                        |
|      +------------------+              |
|      |       🚗        |              |
|      |   [====75%====] |  <-- Barra   |
|      +------------------+      Circular|
|                                        |
|   R$ 45.000 / R$ 60.000               |
|            75% Concluido               |
|                                        |
|   [+ Adicionar R$]                     |
+----------------------------------------+
```

### Caracteristicas

| Elemento | Descricao |
|----------|-----------|
| Icone Central | Icone grande (Plane, Car, Home, etc) com tamanho 4xl |
| Barra Circular | `react-circular-progressbar` ou SVG customizado |
| Valores | R$ Atual / R$ Alvo centralizado |
| Porcentagem | Badge colorido com % concluido |
| Botao Rapido | "Adicionar R$" abre modal para incrementar valor |
| Efeito Reta Final | Se > 80%: animacao `animate-glow-pulse` no card |

### Novo Componente: AddFundsModal

Modal simples para adicionar valor rapido:

```text
+------------------------+
| Adicionar ao Cofre     |
|                        |
| [R$ __________]        |
|                        |
| [Cancelar] [Adicionar] |
+------------------------+
```

---

## Parte 2: Componente "Maquina do Tempo" (Simulador de Juros)

### Estrutura

Adicionar no rodape da pagina de Metas:

```text
+----------------------------------------------------------+
|           ⏰ A MAQUINA DO TEMPO                          |
|                                                          |
|  Investimento Mensal                                     |
|  [==========|=====] R$ 500                              |
|                                                          |
|  Tempo (Anos)                                            |
|  [====|================] 10 anos                        |
|                                                          |
|  Rentabilidade Anual                                     |
|  [=========|==========] 10% a.a.                        |
|                                                          |
|  +------------------------------------------------+     |
|  |                                                |     |
|  |    /\                                         |     |
|  |   /  \  AREA CHART                           |     |
|  |  /    \_____                                  |     |
|  +------------------------------------------------+     |
|                                                          |
|  No futuro, voce tera:                                   |
|  R$ 102.422,07    <-- Grande e com glow                 |
+----------------------------------------------------------+
```

### Logica de Juros Compostos

```typescript
// Formula: M = P * ((1 + r)^n - 1) / r * (1 + r)
// P = aporte mensal
// r = taxa mensal (anual / 12)
// n = meses totais

function calculateCompoundInterest(
  monthlyInvestment: number,
  years: number,
  annualRate: number
): { year: number; value: number }[] {
  const monthlyRate = annualRate / 100 / 12;
  const data = [];
  
  for (let year = 0; year <= years; year++) {
    const months = year * 12;
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    data.push({ year, value: futureValue || 0 });
  }
  
  return data;
}
```

### Inputs (Sliders)

| Slider | Min | Max | Default | Step |
|--------|-----|-----|---------|------|
| Investimento Mensal | R$ 100 | R$ 10.000 | R$ 500 | R$ 50 |
| Tempo (Anos) | 1 | 40 | 10 | 1 |
| Rentabilidade | 1% | 20% | 10% | 0.5% |

### Grafico

Usar o componente `AreaChart` do Recharts (ja instalado) com estilo neon consistente:
- Gradiente roxo/emerald para a area
- Grid escuro
- Tooltip estilizado como nos outros graficos

---

## Parte 3: Nova Pagina "Conquistas" (Sala de Trofeus)

### Tipos e Interfaces

```typescript
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "medal" | "star" | "flame" | "target" | "crown";
  tier: "bronze" | "silver" | "gold";
  isUnlocked: boolean;
  unlockCondition: string;
  unlockedAt?: Date;
}
```

### Layout da Pagina

```text
+----------------------------------------------------------+
|  🏆 CONQUISTAS                                            |
|  Sua Colecao: 3/15 Conquistas                            |
+----------------------------------------------------------+
|                                                          |
|     ⭐       🥈       🥉       🔒       🔒               |
|   Primeiro  7 Dias   Primeira  [lock]   [lock]           |
|   Deposito  Streak   Meta                                |
|                                                          |
|     🔒       🔒       🔒       🔒       🔒               |
|   [lock]   [lock]   [lock]   [lock]   [lock]            |
|                                                          |
|     🔒       🔒       🔒       🔒       🔒               |
|   [lock]   [lock]   [lock]   [lock]   [lock]            |
+----------------------------------------------------------+
```

### Componente: AchievementBadge

| Estado | Visual |
|--------|--------|
| Bloqueado | Fundo cinza, opacity-40, icone Lock sobreposto, border dashed |
| Desbloqueado Bronze | Fundo bronze/amber, glow sutil, animacao de entrada |
| Desbloqueado Silver | Fundo prata/slate, glow medio |
| Desbloqueado Gold | Fundo dourado/yellow, glow forte, animacao pulse |

### Lista de Conquistas Iniciais

| Conquista | Tier | Condicao |
|-----------|------|----------|
| Primeiro Passo | Bronze | Crie sua primeira meta |
| Economizador | Bronze | Adicione R$ a uma meta |
| Focado | Bronze | Complete 5 missoes |
| Streak de Fogo | Silver | Mantenha 7 dias de streak |
| Meta Atingida | Silver | Complete uma meta 100% |
| Investidor | Silver | Use o simulador de juros |
| Rei do Streak | Gold | Mantenha 30 dias de streak |
| Mestre das Metas | Gold | Complete 5 metas |
| Milionario Virtual | Gold | Simule R$ 1M no simulador |

---

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/types/achievements.ts` | Tipos para conquistas |
| `src/components/metas/MetaVaultCard.tsx` | Novo card estilo cofre |
| `src/components/metas/CircularProgress.tsx` | Barra de progresso circular SVG |
| `src/components/metas/AddFundsModal.tsx` | Modal para adicionar dinheiro |
| `src/components/metas/TimeMachineSimulator.tsx` | Simulador de juros compostos |
| `src/components/views/ConquistasView.tsx` | Nova pagina de conquistas |
| `src/components/achievements/AchievementBadge.tsx` | Badge hexagonal de conquista |
| `src/components/achievements/AchievementCounter.tsx` | Contador X/Y no topo |

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/views/MetasView.tsx` | Usar MetaVaultCard + adicionar TimeMachineSimulator |
| `src/components/layout/NavSidebar.tsx` | Adicionar link "Conquistas" com icone Trophy |
| `src/App.tsx` | Adicionar rota `/conquistas` |
| `tailwind.config.ts` | Adicionar cores bronze/silver/gold e animacao hexagon |
| `src/index.css` | Adicionar estilos para hexagonos e glow adicional |

---

## Detalhes de Implementacao

### CircularProgress Component (SVG)

```tsx
interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
}

export function CircularProgress({ 
  value, 
  size = 120, 
  strokeWidth = 8,
  showPercentage = true 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
        style={{
          filter: value > 80 ? 'drop-shadow(0 0 8px hsl(160 84% 50%))' : 'none'
        }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(270, 91%, 65%)" />
          <stop offset="100%" stopColor="hsl(160, 84%, 45%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
```

### MetaVaultCard Component

```tsx
export function MetaVaultCard({ meta, onAddFunds, onEdit }: MetaVaultCardProps) {
  const progress = (meta.currentValue / meta.targetValue) * 100;
  const isNearComplete = progress >= 80;

  return (
    <div className={cn(
      "glass-card p-6 flex flex-col items-center transition-all duration-500",
      isNearComplete && "animate-glow-pulse border-primary/50"
    )}>
      {/* Vault Icon */}
      <div className="relative mb-4">
        <CircularProgress value={progress} size={140} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-12 h-12 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-xl mb-2">{meta.title}</h3>

      {/* Values */}
      <div className="text-center mb-4">
        <p className="text-lg font-semibold">
          {formatCurrency(meta.currentValue)} / {formatCurrency(meta.targetValue)}
        </p>
        <Badge className={isNearComplete ? "bg-primary/20 text-primary" : ""}>
          {Math.round(progress)}% Concluido
        </Badge>
      </div>

      {/* Quick Add Button */}
      <Button onClick={() => onAddFunds(meta)} variant="outline" className="gap-2">
        <Plus className="w-4 h-4" />
        Adicionar R$
      </Button>
    </div>
  );
}
```

### TimeMachineSimulator Component

```tsx
export function TimeMachineSimulator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [years, setYears] = useState(10);
  const [annualRate, setAnnualRate] = useState(10);

  const chartData = useMemo(() => 
    calculateCompoundInterest(monthlyInvestment, years, annualRate),
    [monthlyInvestment, years, annualRate]
  );

  const finalValue = chartData[chartData.length - 1]?.value || 0;

  return (
    <div className="glass-card p-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-8 h-8 text-secondary" />
        <h2 className="text-2xl font-display font-bold">A Maquina do Tempo</h2>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SliderInput
          label="Investimento Mensal"
          value={monthlyInvestment}
          onChange={setMonthlyInvestment}
          min={100}
          max={10000}
          step={50}
          format={(v) => formatCurrency(v)}
        />
        <SliderInput
          label="Tempo"
          value={years}
          onChange={setYears}
          min={1}
          max={40}
          step={1}
          format={(v) => `${v} anos`}
        />
        <SliderInput
          label="Rentabilidade"
          value={annualRate}
          onChange={setAnnualRate}
          min={1}
          max={20}
          step={0.5}
          format={(v) => `${v}% a.a.`}
        />
      </div>

      {/* Area Chart */}
      <div className="h-[300px] mb-6">
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            {/* ... configuracao do grafico ... */}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Final Value */}
      <div className="text-center">
        <p className="text-muted-foreground mb-2">No futuro, voce tera:</p>
        <p className="text-4xl font-display font-bold text-primary text-glow-emerald">
          {formatCurrency(finalValue)}
        </p>
      </div>
    </div>
  );
}
```

### AchievementBadge Component

```tsx
export function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const tierStyles = {
    bronze: "bg-amber-900/30 border-amber-600 text-amber-500",
    silver: "bg-slate-400/30 border-slate-400 text-slate-300",
    gold: "bg-yellow-500/30 border-yellow-400 text-yellow-400 neon-glow-gold",
  };

  if (!achievement.isUnlocked) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className="relative w-20 h-20 hexagon bg-muted/30 border-2 border-dashed border-muted-foreground/30 opacity-50 flex items-center justify-center cursor-not-allowed">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{achievement.name}</p>
          <p className="text-xs text-muted-foreground">{achievement.unlockCondition}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={cn(
          "w-20 h-20 hexagon flex items-center justify-center border-2 transition-transform hover:scale-110",
          tierStyles[achievement.tier]
        )}>
          <Icon className="w-8 h-8" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{achievement.name}</p>
        <p className="text-xs text-muted-foreground">{achievement.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
```

---

## Estilos Adicionais (CSS)

### Hexagono

```css
.hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
```

### Cores Tier (Tailwind Config)

```typescript
colors: {
  tier: {
    bronze: "hsl(30, 50%, 40%)",
    silver: "hsl(220, 10%, 70%)",
    gold: "hsl(45, 93%, 55%)",
  }
}
```

---

## Fluxo de Usuario

### Metas (Cofres)

```text
1. Usuario abre aba "Metas"
   |
   +-- Ve grid de Cofres Digitais
   |
   +-- Clica em "Adicionar R$" no cofre
       |
       +-- Modal abre
       |
       +-- Digita valor e confirma
       |
       +-- Barra circular atualiza com animacao
       |
       +-- Se > 80%: card comeca a pulsar (Reta Final!)
```

### Maquina do Tempo

```text
1. Usuario rola ate o fim da pagina Metas
   |
   +-- Ve o simulador "Maquina do Tempo"
   |
   +-- Arrasta sliders
       |
       +-- Grafico de area atualiza em tempo real
       |
       +-- Valor final atualiza instantaneamente
```

### Conquistas

```text
1. Usuario abre aba "Conquistas"
   |
   +-- Ve contador "3/15 Conquistas" no topo
   |
   +-- Ve galeria hexagonal
   |
   +-- Passa mouse em badge bloqueado
       |
       +-- Tooltip: "Complete uma meta para desbloquear"
   |
   +-- Ve badges desbloqueados com brilho (gold/silver/bronze)
```

---

## Navegacao Atualizada

```text
Menu Lateral:
+----------------+
| 💬 Chats       |
| 🎯 Metas       |  <-- Cofres + Simulador
| 🚀 Missoes     |
| 👥 Personas    |
| 🏆 Conquistas  |  <-- NOVO
+----------------+
```

