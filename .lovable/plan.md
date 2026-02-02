

## Plano: Dashboard de Treinamento Empreendedor + Pagina Personalidades

### Visao Geral

1. **Refatorar pagina Missoes** - Transformar em dashboard de "Treinamento Empreendedor" com desafios de mentalidade de riqueza, XP e barra de progresso diario
2. **Criar pagina Personalidades** - Nova aba no menu lateral com 4 cards de personas da IA (1 ativo, 3 bloqueados)

---

## Parte 1: Dashboard de Treinamento Empreendedor (MissoesView)

### Tipos e Interfaces

```typescript
interface EntrepreneurMission {
  id: string;
  title: string;
  description: string;
  category: "roi" | "mindset" | "negotiation" | "saving";
  xpReward: number;
  completed: boolean;
  icon: LucideIcon;
}

interface DailyProgress {
  totalXP: number;
  completedMissions: number;
  totalMissions: number;
}
```

### Missoes Pre-definidas

| Missao | Categoria | XP |
|--------|-----------|-----|
| O Dilema do Cafe (Lógica de ROI): Calcule quanto seu cafe diario custaria em 1 ano investido a 10% a.a. | roi | 50 |
| Caca aos Passivos: Identifique 3 gastos de hoje que nao colocam dinheiro no seu bolso | saving | 75 |
| Negociacao Simulada: Peca um desconto em qualquer compra hoje, mesmo que seja R$ 1,00 | negotiation | 100 |
| Regra dos 10%: Separe 10% de qualquer dinheiro que receber hoje para investir | mindset | 60 |
| Auditoria de Assinaturas: Liste todas suas assinaturas e cancele 1 que nao usa | saving | 80 |
| Pitch de 30 Segundos: Explique seu objetivo financeiro em 30 segundos para alguem | mindset | 40 |

### Componentes do Dashboard

1. **Header com Estatisticas**
   - Titulo "Treinamento Empreendedor" com icone Flame/Trophy
   - Barra de progresso diario (missoes completadas / total)
   - XP total do dia com animacao neon

2. **Grid de Cards de Missao**
   - Cada card com icone da categoria, titulo, descricao
   - Badge mostrando XP reward
   - Checkbox/botao para marcar como concluida
   - Efeito visual de "completado" com glow verde

3. **Secao de XP Visual**
   - Barra de nivel estilo RPG
   - Contador de XP animado
   - Badges de conquistas (opcional)

### Layout Visual

```text
+--------------------------------------------------+
| 🔥 TREINAMENTO EMPREENDEDOR                      |
|                                                  |
| [====== 4/6 Missões Hoje ======] 285 XP ⚡       |
+--------------------------------------------------+
|                                                  |
| +-------------------+  +-------------------+     |
| | ☕ ROI            |  | 🎯 MINDSET        |     |
| | O Dilema do Cafe  |  | Regra dos 10%     |     |
| | Calcule quanto... |  | Separe 10% de...  |     |
| |            +50 XP |  |            +60 XP |     |
| | [✓] Completar     |  | [ ] Completar     |     |
| +-------------------+  +-------------------+     |
|                                                  |
| +-------------------+  +-------------------+     |
| | 🔍 SAVING         |  | 🤝 NEGOTIATION    |     |
| | Caca aos Passivos |  | Negociacao Simul. |     |
| | Identifique 3...  |  | Peca desconto...  |     |
| |            +75 XP |  |           +100 XP |     |
| | [ ] Completar     |  | [ ] Completar     |     |
| +-------------------+  +-------------------+     |
+--------------------------------------------------+
```

---

## Parte 2: Pagina Personalidades

### Adicionar Rota e Menu

**Arquivo:** `src/App.tsx`
- Adicionar rota `/personalidades`
- Import `PersonalidadesView`

**Arquivo:** `src/components/layout/NavSidebar.tsx`
- Adicionar item no menu: `{ title: "Personalidades", path: "/personalidades", icon: Users }`

### Tipos e Dados

```typescript
interface Persona {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: "emerald" | "purple" | "cyan" | "orange";
  isLocked: boolean;
  unlockRequirement?: string;
}
```

### Cards de Personalidades

| Persona | Icone | Status |
|---------|-------|--------|
| O Padrao | Bot/Sparkles | Desbloqueado (ativo) |
| O Sarcastico | Laugh/Drama | Bloqueado |
| A Vovo Economica | Heart/Cookie | Bloqueado |
| O Coach | Dumbbell/Flame | Bloqueado |

### Layout Visual

```text
+--------------------------------------------------+
| 🎭 PERSONALIDADES                                |
| Em breve voce podera escolher quem controla      |
| suas financas. Desbloqueie com Streak!           |
+--------------------------------------------------+
|                                                  |
| +---------------------+  +---------------------+ |
| |    ⚡ ATIVO         |  |    🔒 EM BREVE     | |
| |                     |  |                     | |
| |   🤖 O PADRAO       |  |   😈 O SARCASTICO  | |
| |                     |  |   (opacidade 50%)   | |
| |   Profissional e    |  |   Te julga gastando | |
| |   equilibrado       |  |                     | |
| |                     |  |   Streak: 7 dias    | |
| +---------------------+  +---------------------+ |
|                                                  |
| +---------------------+  +---------------------+ |
| |    🔒 EM BREVE     |  |    🔒 EM BREVE     | |
| |                     |  |                     | |
| |   👵 VOVO          |  |   💪 O COACH       | |
| |   ECONOMICA        |  |   (opacidade 50%)   | |
| |   (opacidade 50%)   |  |   Te motiva no     | |
| |   Cuida do seu $   |  |   grito             | |
| |   Streak: 14 dias  |  |   Streak: 21 dias   | |
| +---------------------+  +---------------------+ |
+--------------------------------------------------+
```

### Estilo dos Cards Bloqueados

- Opacidade reduzida: `opacity-50`
- Overlay com cadeado: `Lock` icon centralizado
- Badge "EM BREVE" no topo direito
- Borda tracejada ou esmaecida
- Hover desabilitado: `pointer-events-none` ou cursor diferente

---

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/types/missions.ts` | Tipos para missoes empreendedoras |
| `src/types/personas.ts` | Tipos para personalidades da IA |
| `src/components/views/PersonalidadesView.tsx` | Nova pagina de personalidades |
| `src/components/missions/MissionCard.tsx` | Card individual de missao |
| `src/components/missions/DailyProgress.tsx` | Barra de progresso + XP |
| `src/components/personas/PersonaCard.tsx` | Card de personalidade |

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/views/MissoesView.tsx` | Refatorar completamente |
| `src/components/layout/NavSidebar.tsx` | Adicionar "Personalidades" |
| `src/App.tsx` | Adicionar rota `/personalidades` |

---

## Detalhes de Implementacao

### MissionCard Component

```tsx
// Cada card de missao tera:
// - Icone colorido por categoria (ROI = amarelo, Mindset = roxo, etc)
// - Titulo em negrito
// - Descricao em texto menor
// - Badge de XP com glow
// - Botao/checkbox para completar
// - Animacao ao completar (scale + glow)
```

### PersonaCard Component

```tsx
// Card desbloqueado (Padrao):
// - Borda neon ativa (verde)
// - Badge "ATIVO" no topo
// - Hover com scale

// Cards bloqueados:
// - Overlay semi-transparente
// - Icone Lock centralizado
// - Badge "EM BREVE"
// - Texto de requisito: "Desbloqueie com 7 dias de streak"
// - Cursor not-allowed
```

### Estilo Visual Consistente

Todos os novos componentes seguirao o padrao existente:
- Fundo: Deep Navy (`#0a0f1c`)
- Cards: `.glass-card` (glassmorphism)
- Acentos: Neon Verde (primary) e Roxo (secondary)
- Sombras: `neon-glow-emerald`, `neon-glow-purple`
- Fontes: Space Grotesk para titulos, Inter para texto

---

## Fluxo de Usuario

### Missoes

```text
1. Usuario abre aba "Missoes"
   |
   +-- Ve dashboard com 6 missoes do dia
   |
   +-- Clica em checkbox de uma missao
       |
       +-- Missao marca como concluida (animacao)
       |
       +-- XP aumenta (animacao de contador)
       |
       +-- Barra de progresso atualiza
```

### Personalidades

```text
1. Usuario abre aba "Personalidades"
   |
   +-- Ve 4 cards: 1 ativo, 3 bloqueados
   |
   +-- Tenta clicar em card bloqueado
       |
       +-- Nada acontece (visual de bloqueado)
       |
       +-- Ve mensagem: "Desbloqueie com X dias de streak"
```

