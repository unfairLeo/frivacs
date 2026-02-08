

## Patrimonio Interativo + Streak Inteligente

### Visao Geral

Hoje o `WealthWidget` mostra "R$ 0,00" fixo e o `StreakBadge` mostra "3 Dias" hardcoded. Vamos transformar ambos em componentes vivos, reativos e conectados aos dados reais do sistema -- tudo persistido via `localStorage` seguindo o padrao `moneyplan_*` ja existente no projeto.

---

### Arquitetura: O Que Muda

```text
+--------------------------------------------------+
|            useFinancialStore (NOVO HOOK)          |
|  - patrimony, transactions[], monthlyChange      |
|  - addTransaction(), removeTransaction()         |
|  - sparklineData (ultimos 7 dias agregados)      |
|  - Persiste em localStorage: moneyplan_finances   |
+--------------------------------------------------+
            |                       |
            v                       v
+---------------------+  +------------------------+
|   WealthWidget      |  |   StreakBadge           |
|   (ATUALIZADO)      |  |   (ATUALIZADO)         |
|   - Le patrimonio   |  |   - Le historico real   |
|     real do hook     |  |     de conversas       |
|   - Sparkline real   |  |   - Calcula streak     |
|   - Clique expande   |  |     automatico         |
|     mini-extrato     |  |   - Animacao de nivel  |
+---------------------+  +------------------------+
            |
            v
+---------------------+
|  SmartActions        |
|  (ATUALIZADO)        |
|  - Ao registrar      |
|    gasto via chat,   |
|    adiciona ao       |
|    financialStore    |
+---------------------+
```

---

### 1. Hook `useFinancialStore` (Novo)

**Arquivo:** `src/hooks/useFinancialStore.ts`

Um hook customizado que gerencia as transacoes financeiras do usuario com persistencia em `localStorage`.

**Estrutura de dados:**

```text
Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string (ISO)
}
```

**Funcionalidades:**
- `transactions`: lista completa de transacoes
- `patrimony`: soma de todos os incomes menos expenses
- `monthlyChange`: variacao percentual comparando mes atual vs anterior
- `sparklineData`: array de 7 pontos com patrimonio acumulado dos ultimos 7 dias
- `addTransaction(tx)`: adiciona e persiste
- `removeTransaction(id)`: remove e persiste
- `recentTransactions(n)`: retorna as ultimas N transacoes

**Persistencia:** `localStorage` com chave `moneyplan_finances`

**Dados iniciais (seed):** Para nao comecar zerado, incluir 5-8 transacoes mock que simulam um historico recente (ultimos 15 dias), gerando um patrimonio inicial de ~R$ 12.450,00 para que o widget ja mostre dados visuais atrativos.

---

### 2. WealthWidget Interativo (Atualizado)

**Arquivo:** `src/components/wealth/WealthWidget.tsx`

Mudancas:

**A) Dados reais do hook:**
- Consumir `useFinancialStore` para obter `patrimony`, `monthlyChange` e `sparklineData`
- Remover os dados mock fixos atuais

**B) Mini-extrato expansivel:**
- Ao clicar no card, ele expande com uma animacao suave (`max-height` transition)
- Mostra as ultimas 5 transacoes em uma lista compacta:

```text
  Alimentacao     -R$ 45,00    hoje
  Salario        +R$ 3.200    2d atras
  Mercado        -R$ 230,00   3d atras
```

- Cada linha com icone da categoria, valor colorido (verde income / vermelho expense), e data relativa
- Botao "Ver tudo" (futuro - nao funcional ainda, apenas placeholder)

**C) Animacao de contagem (CountUp):**
- Quando o patrimonio muda, animar o valor numerico com um efeito de contagem progressiva (countup de ~800ms)
- Implementar com `useEffect` + `requestAnimationFrame` -- sem dependencia externa

**D) Sparkline reativa:**
- A sparkline agora mostra dados reais dos ultimos 7 dias
- Cor dinamica: verde se patrimonio cresceu, vermelho se caiu

---

### 3. StreakBadge Inteligente (Atualizado)

**Arquivo:** `src/components/StreakBadge.tsx`

**A) Hook `useStreakCalculator` (Novo - inline ou separado):**

**Arquivo:** `src/hooks/useStreakCalculator.ts`

Calcula a ofensiva real baseada no historico de conversas do `ConversationContext`:

- Itera sobre `history` do contexto de conversas
- Agrupa por dia (usando `date-fns` ja instalado)
- Conta dias consecutivos ate hoje (ou ate ontem se hoje ainda nao teve registro)
- Retorna `{ currentStreak, bestStreak, isActiveToday }`

**B) Visual dinamico baseado no streak:**

| Streak | Visual |
|--------|--------|
| 0 dias | Chama cinza apagada, texto "Comece!" |
| 1-2 dias | Chama laranja suave, sem glow |
| 3-6 dias | Chama laranja neon + glow (atual) |
| 7-13 dias | Chama azul/cyan + glow intenso + texto "1 Semana!" |
| 14+ dias | Chama roxa/dourada + particulas + texto "Imparavel!" |

**C) Tooltip dinamico:**
- Muda a mensagem baseado no nivel do streak
- Exemplos:
  - 0: "Registre um gasto hoje para iniciar sua ofensiva!"
  - 3: "3 dias seguidos! Continue registrando para nao perder o ritmo."
  - 7: "Uma semana inteira! Voce esta criando um habito poderoso."
  - 14: "Imparavel! Voce ja e um mestre das financas."

**D) Animacao de "level up":**
- Quando o streak sobe de nivel (ex: 2 para 3, 6 para 7), dispara uma animacao especial tipo "pulse" + "scale" por 1 segundo
- Implementado via classe CSS com `animation` e detectado por comparacao de nivel anterior via `useRef`

---

### 4. Integracao SmartActions -> FinancialStore

**Arquivo:** `src/components/views/ChatView.tsx`

Quando o usuario envia uma query que veio dos SmartActions (detectado pelo padrao "Gastei R$"), o sistema:
- Faz parse do valor e categoria via regex
- Chama `addTransaction` do `useFinancialStore`
- O WealthWidget atualiza automaticamente (mesmo hook)
- O StreakBadge atualiza porque uma nova conversa foi salva no contexto

Isso cria um **loop de feedback imediato**: clicou no botao -> digitou valor -> patrimonio atualiza em tempo real -> streak sobe.

---

### Resumo dos Arquivos

| Arquivo | Acao |
|---------|------|
| `src/hooks/useFinancialStore.ts` | **Criar** - Hook de estado financeiro com localStorage |
| `src/hooks/useStreakCalculator.ts` | **Criar** - Hook que calcula streak real do historico |
| `src/components/wealth/WealthWidget.tsx` | **Modificar** - Dados reais, mini-extrato, countup |
| `src/components/StreakBadge.tsx` | **Modificar** - Streak real, niveis visuais, tooltip dinamico |
| `src/components/views/ChatView.tsx` | **Modificar** - Parse de gastos e integracao com financial store |
| `src/index.css` | **Modificar** - Animacoes de level-up e transicao do extrato |

---

### Detalhes Tecnicos

#### useFinancialStore.ts

```text
Chave localStorage: "moneyplan_finances"
Estrutura salva: { transactions: Transaction[], lastUpdated: string }

Seed data (mock inicial):
- Salario +R$ 5.200 (15 dias atras)
- Freelance +R$ 1.800 (10 dias atras)
- Alimentacao -R$ 320 (8 dias atras)
- Transporte -R$ 180 (6 dias atras)
- Mercado -R$ 450 (4 dias atras)
- Investimento +R$ 6.400 (3 dias atras)

Patrimonio calculado: soma dos amounts (income positivo, expense negativo)
Sparkline: agregar patrimonio acumulado por dia nos ultimos 7 dias
MonthlyChange: comparar soma do mes atual vs soma do mes anterior
```

#### useStreakCalculator.ts

```text
Input: history (SavedConversation[]) do ConversationContext
Output: { currentStreak: number, bestStreak: number, isActiveToday: boolean, streakLevel: 'inactive' | 'warming' | 'fire' | 'blazing' | 'legendary' }

Algoritmo:
1. Extrair datas unicas dos timestamps do historico
2. Ordenar do mais recente ao mais antigo
3. Verificar se hoje (ou ontem) tem registro
4. Contar dias consecutivos para tras
5. Determinar nivel baseado na contagem
```

#### WealthWidget - CountUp Animation

```text
Usar useRef para armazenar valor anterior
Quando patrimony muda:
1. Calcular diferenca (novo - anterior)
2. Animar em 60 frames (~800ms)
3. Cada frame: displayValue = anterior + (diferenca * easeOutCubic(progress))
4. Ao finalizar: setar valor exato
```

#### WealthWidget - Mini-Extrato

```text
Estado: isExpanded (boolean)
Ao clicar no card: toggle isExpanded
Container do extrato: max-height transition (0 -> 300px)
Lista: ultimas 5 transacoes com:
- Icone da categoria (mapear via categoryIcons similar ao SmartActions)
- Descricao
- Valor formatado com cor (verde/vermelho)
- Data relativa usando formatDistanceToNow do date-fns (ja instalado)
```

#### ChatView - Parse de Gastos

```text
Regex: /Gastei R\$\s*([\d.,]+)\s*em\s*(.+)/i
Ao detectar match apos envio bem-sucedido:
1. Extrair amount e category
2. Chamar addTransaction({ type: "expense", amount, category, description: query, date: new Date().toISOString() })
3. Toast de confirmacao: "Gasto de R$ X registrado em [Categoria]"
```

#### StreakBadge - CSS para Level Up

```text
@keyframes streak-level-up {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); filter: brightness(1.5); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); filter: brightness(1); }
}

.animate-streak-level-up {
  animation: streak-level-up 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

