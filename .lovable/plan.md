

## Patrimony Card Interativo + Streak Gamification Engine

### Visao Geral

O WealthWidget sera transformado de um card estatico em um centro de dados interativo com grafico Recharts completo, tooltip customizado e filtros temporais. O StreakBadge deixara de ser apenas um badge decorativo para se tornar a porta de entrada de um Calendario de Habitos com feedback visual em tempo real.

---

### Arquitetura das Mudancas

```text
+------------------------------------------------------------+
|                    WealthWidget (REFATORADO)                |
|                                                            |
|  [7D] [30D] [Total]     <-- Filtros Pilula                |
|  +--------------------------------------------------+      |
|  | Grafico de Area (Recharts)                        |      |
|  | - AreaChart com gradiente dinamico                |      |
|  | - Tooltip customizado (valor + variacao %)        |      |
|  | - Cor dinamica: verde (alta) / vermelho (queda)   |      |
|  +--------------------------------------------------+      |
|  R$ 12.450,00                       +3.2% este mes         |
+------------------------------------------------------------+

+------------------------------------------------------------+
|                  StreakBadge (REFATORADO)                    |
|                                                            |
|  [Fogo] 3 Dias  <-- Clicavel, abre Dialog                 |
|                                                            |
|  +--------------------------------------------------+      |
|  |        Streak Dialog (NOVO)                       |      |
|  |  Calendario do mes atual:                         |      |
|  |  - Dias ativos = circulo verde neon               |      |
|  |  - Dias inativos = circulo cinza                  |      |
|  |  - Hoje sem registro = pulse no icone de fogo     |      |
|  +--------------------------------------------------+      |
+------------------------------------------------------------+
```

---

### 1. WealthWidget - Grafico Interativo com Recharts

**Arquivo:** `src/components/wealth/WealthWidget.tsx`

O Recharts ja esta instalado e importado no componente atual (apenas `LineChart` e `Line`). A refatoracao troca por um `AreaChart` completo com tooltip e filtros.

**A) Dados mockados por periodo:**

Tres conjuntos de dados simulados:
- `7D`: 7 pontos (ultimos 7 dias) -- patrimonio crescente de ~R$ 11.800 a ~R$ 12.450
- `30D`: 30 pontos (ultimo mes) -- oscilacao realista com tendencia de alta
- `Total`: 12 pontos (ultimos 12 meses) -- crescimento gradual de ~R$ 5.000 a ~R$ 12.450

Cada ponto contem: `{ date: string, value: number }`

**B) Filtros temporais (Pill Buttons):**

Tres botoes pilula no topo direito do card: `7D`, `30D`, `Total`
- Estilo: `rounded-full px-3 py-1 text-xs font-medium`
- Ativo: fundo `primary/20`, texto `primary`, borda neon
- Inativo: fundo `muted/50`, texto `muted-foreground`
- Ao clicar, muda o estado `activeRange` e o grafico anima com transicao suave (Recharts ja faz isso nativamente via `animationDuration`)

**C) AreaChart com gradiente dinamico:**

Substituir o `LineChart` simples por:
- `AreaChart` com `Area` preenchida por gradiente
- Gradiente definido via `<defs><linearGradient>`: verde neon (se tendencia positiva) ou vermelho (se negativa)
- Tendencia calculada: compara primeiro ponto vs ultimo ponto do periodo selecionado
- Cor da linha (`stroke`) tambem muda: `hsl(160 84% 45%)` (verde) ou `hsl(0 84% 60%)` (vermelho)

**D) Tooltip customizado:**

Componente inline `CustomTooltip` renderizado dentro do Recharts `<Tooltip content={<CustomTooltip />} />`:
- Fundo glassmorphism (`glass-card`)
- Mostra: data formatada, valor em R$, variacao % em relacao ao ponto anterior
- Variacao positiva em verde, negativa em vermelho

**E) Layout reestruturado:**

```text
+---------------------------------------------+
| Patrimonio Estimado  [TrendingUp]           |
| R$ 12.450,00              [7D] [30D] [Total]|
+---------------------------------------------+
| [========= AreaChart com Tooltip =========] |
| [         Gradiente verde/vermelho         ] |
+---------------------------------------------+
|                    +3.2% este mes           |
+---------------------------------------------+
```

O grafico ocupa uma area maior (~160px de altura) comparado ao sparkline atual (~48px).

---

### 2. StreakBadge Clicavel + Dialog de Calendario

**Arquivo:** `src/components/StreakBadge.tsx`

**A) Badge clicavel:**

- Manter o visual atual (Flame + "3 Dias" + Tooltip)
- Adicionar `cursor-pointer` e `onClick` que abre um Dialog
- Se o usuario NAO registrou atividade hoje, adicionar classe `animate-pulse` no icone de fogo (chamada para acao)
- Determinar "registrou hoje" verificando se existe alguma conversa no `ConversationContext` com timestamp de hoje

**B) Streak Dialog (Novo componente inline ou separado):**

**Novo arquivo:** `src/components/streak/StreakCalendarDialog.tsx`

Um Dialog elegante que mostra o calendario de habitos do mes atual.

**Visual do Dialog:**
- Titulo: "Sua Ofensiva" com icone de fogo
- Subtitulo: "3 dias consecutivos" (dinamico baseado no historico)
- Grade de calendario: 7 colunas (Dom-Sab), linhas para o mes atual
- Cada dia e um circulo:
  - **Dia ativo** (teve conversa): circulo com borda verde neon + fundo `primary/20` + glow suave
  - **Dia inativo** (sem conversa): circulo com borda cinza + fundo transparente
  - **Hoje**: borda mais grossa, destaque especial
  - **Dias futuros**: opacidade reduzida

**Dados do calendario:**
- Lidos do `ConversationContext.history`
- Agrupar timestamps por dia usando `startOfDay` do `date-fns`
- Criar um `Set<string>` com as datas formatadas (YYYY-MM-DD) que tiveram atividade
- Para cada dia do mes, verificar se esta no Set

**Estatisticas no Dialog:**
- Ofensiva atual: X dias
- Melhor ofensiva: Y dias (calculado do historico)
- Dias ativos este mes: Z/total

**Layout do Dialog:**

```text
+---------------------------------------------+
|  [X]              Sua Ofensiva              |
+---------------------------------------------+
|  [Fogo] 3 dias consecutivos                |
+---------------------------------------------+
|  Dom  Seg  Ter  Qua  Qui  Sex  Sab         |
|  [.]  [.]  [*]  [*]  [*]  [.]  [.]         |
|  [.]  [*]  [*]  [.]  [.]  [*]  [.]         |
|  [*]  [*]  [*]  [*]  [.]  [.]  [.]         |
|  [*]  [*]  [HOJE]                           |
+---------------------------------------------+
|  Melhor ofensiva: 5 dias                    |
|  Dias ativos em Fev: 8/8                    |
+---------------------------------------------+
```

`[*]` = circulo verde neon (dia ativo)
`[.]` = circulo cinza (dia inativo)

---

### 3. Hook useStreakStats (Novo)

**Arquivo:** `src/hooks/useStreakStats.ts`

Centraliza toda a logica de calculo do streak para reutilizacao entre o StreakBadge e o Dialog.

**Input:** `history: SavedConversation[]` do ConversationContext

**Output:**
```text
{
  currentStreak: number       // dias consecutivos ate hoje/ontem
  bestStreak: number          // melhor sequencia historica
  isActiveToday: boolean      // teve atividade hoje?
  activeDaysThisMonth: number // quantos dias ativos no mes
  totalDaysThisMonth: number  // dias passados no mes
  activeDatesSet: Set<string> // Set com datas ativas (YYYY-MM-DD)
}
```

**Algoritmo do streak:**
1. Extrair datas unicas dos timestamps (usando `format(date, 'yyyy-MM-dd')` do date-fns)
2. Criar Set de datas unicas
3. Comecar de hoje e ir retrocedendo dia a dia
4. Se hoje nao tem registro, comecar de ontem
5. Contar dias consecutivos que estao no Set
6. Para bestStreak: iterar todas as datas ordenadas e encontrar a maior sequencia

---

### Resumo dos Arquivos

| Arquivo | Acao |
|---------|------|
| `src/components/wealth/WealthWidget.tsx` | **Modificar** - AreaChart interativo, filtros pilula, tooltip customizado, cor dinamica |
| `src/components/StreakBadge.tsx` | **Modificar** - Tornar clicavel, pulse condicional, abrir Dialog |
| `src/components/streak/StreakCalendarDialog.tsx` | **Criar** - Dialog com calendario de habitos |
| `src/hooks/useStreakStats.ts` | **Criar** - Hook com logica de streak e datas ativas |
| `src/index.css` | **Modificar** - Estilos para dias do calendario (ativo/inativo/hoje) |

---

### Detalhes Tecnicos

#### WealthWidget - Dados Mockados

```text
7D data (7 pontos):
  { date: "02 Fev", value: 11800 }
  { date: "03 Fev", value: 11950 }
  { date: "04 Fev", value: 11870 }
  { date: "05 Fev", value: 12100 }
  { date: "06 Fev", value: 12280 }
  { date: "07 Fev", value: 12150 }
  { date: "08 Fev", value: 12450 }

30D data (30 pontos):
  Gerar array de 30 dias com valores oscilando entre 10500 e 12450
  Tendencia geral de alta

Total data (12 pontos, meses):
  { date: "Mar", value: 5200 }
  { date: "Abr", value: 5800 }
  ... crescimento gradual ate
  { date: "Fev", value: 12450 }
```

#### WealthWidget - CustomTooltip

```text
Componente funcional que recebe { active, payload, label } do Recharts
Se active && payload:
  - Renderizar glass-card com:
    - Data: payload[0].payload.date
    - Valor: formatCurrency(payload[0].value)
    - Variacao: calcular vs ponto anterior (se disponivel)
```

#### WealthWidget - Filtros Pilula

```text
Estado: activeRange = '7d' | '30d' | 'total' (default: '7d')
Mapear cada range para seu dataset
Ao trocar, o Recharts anima automaticamente (animationDuration={800})
```

#### WealthWidget - Cor Dinamica

```text
const isPositiveTrend = data[data.length - 1].value >= data[0].value
const chartColor = isPositiveTrend ? "hsl(160 84% 45%)" : "hsl(0 84% 60%)"
const gradientId = "patrimonyGradient"

<defs>
  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
  </linearGradient>
</defs>
```

#### StreakCalendarDialog - Grid do Calendario

```text
1. Obter primeiro dia do mes: startOfMonth(new Date())
2. Obter ultimo dia: endOfMonth(new Date())
3. Obter dia da semana do primeiro dia: getDay(firstDay)
4. Preencher celulas vazias no inicio
5. Para cada dia do mes:
   - Formatar como 'yyyy-MM-dd'
   - Verificar se esta no activeDatesSet
   - Renderizar circulo com estilo adequado
6. Dias futuros: opacity-30
7. Hoje: ring-2 ring-primary
```

#### StreakBadge - Logica de Pulse

```text
Importar useConversation e useStreakStats
const { history } = useConversation()
const { isActiveToday, currentStreak } = useStreakStats(history)

Se !isActiveToday:
  Flame recebe classe "animate-pulse" (pulsa para chamar atencao)
Se isActiveToday:
  Flame recebe classe "animate-pulse-glow" (glow suave, ja registrou)

Texto do streak: currentStreak > 0 ? `${currentStreak} Dias` : "Comece!"
```

#### Dependencias Utilizadas

- `recharts` (ja instalado): AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
- `date-fns` (ja instalado): format, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay, isToday, isFuture, subDays
- `@radix-ui/react-dialog` (ja instalado): Dialog, DialogContent, DialogHeader, DialogTitle
- `lucide-react` (ja instalado): Flame, Calendar, Trophy, Target

