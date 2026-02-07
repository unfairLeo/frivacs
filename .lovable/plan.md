

## Elevar a Dashboard: Smart Actions + Streak Widget

### Visao Geral

Dois novos componentes visuais serao adicionados ao ChatView, logo acima da barra de chat, para aumentar engajamento e reforcar o loop de dopamina.

---

### 1. Smart Actions Grid (Acoes Rapidas)

**Novo arquivo:** `src/components/SmartActions.tsx`

Uma linha horizontal com 4 botoes circulares glassmorphism que preenchem automaticamente o input do chat ao clicar.

| Botao | Icone | Texto gerado no input |
|-------|-------|-----------------------|
| Alimentacao | UtensilsCrossed (lucide) | `Gastei R$ em Alimentacao` |
| Transporte | Car (lucide) | `Gastei R$ em Transporte` |
| Mercado | ShoppingCart (lucide) | `Gastei R$ em Mercado` |
| Lazer | Gamepad2 (lucide) | `Gastei R$ em Lazer` |

**Visual:**
- Botoes redondos (64x64px) com fundo `glass-card` e borda sutil
- Icone centralizado com cor neon (emerald)
- Label abaixo do icone em texto pequeno (`text-xs`)
- Efeito hover: glow neon + scale 105%
- Efeito ao clicar: animacao `bounce-in` (ja existe no tailwind.config.ts)
- Layout responsivo: `grid grid-cols-4 gap-4` com `justify-items-center`

**Comportamento:**
- O componente recebe uma callback `onAction(text: string)` como prop
- Ao clicar, dispara a callback com o texto pre-formatado
- O cursor deve ficar posicionado apos "R$ " para o usuario digitar o valor

### 2. Streak Widget (Ofensiva)

**Novo arquivo:** `src/components/StreakBadge.tsx`

Um componente compacto que mostra a ofensiva atual do usuario, posicionado ao lado do WealthWidget.

**Visual:**
- Icone `Flame` do lucide-react com gradiente laranja/amarelo neon
- Texto "3 Dias" ao lado (dados mockados)
- Background glassmorphism com borda sutil
- Animacao `pulse-glow` no icone de fogo
- Glow laranja/amarelo no hover

**Tooltip:**
- Ao passar o mouse, exibe: "Mantenha o foco! Registre gastos diariamente para aumentar sua chama."
- Usa os componentes `Tooltip`, `TooltipTrigger`, `TooltipContent` do Radix ja instalados

---

### 3. Integracao no ChatView

**Arquivo modificado:** `src/components/views/ChatView.tsx`

Mudancas na estrutura da pagina:

```text
+------------------------------------------+
|           MoneyPlan (header)             |
+------------------------------------------+
|  Patrimonio Estimado    [Streak Badge]   |
+------------------------------------------+
|  [Alimentacao] [Transporte] [Mercado] [Lazer]  |
+------------------------------------------+
|  [Chat Input - Query]                    |
+------------------------------------------+
|  [Respostas / Empty State]               |
+------------------------------------------+
```

- O WealthWidget e o StreakBadge ficam lado a lado (flex row)
- O SmartActions Grid fica entre o WealthWidget e o QueryInput
- Envolver o conteudo com `TooltipProvider` para habilitar tooltips

### 4. Integracao no QueryInput

**Arquivo modificado:** `src/components/QueryInput.tsx`

- Adicionar uma nova prop `externalQuery` e `setExternalQuery` para permitir que o SmartActions preencha o input externamente
- Alternativa mais simples: elevar o estado do `query` para o ChatView e passar como props controladas

**Abordagem escolhida:** O ChatView gerencia o estado `prefillQuery` e passa para o QueryInput via nova prop `initialValue`. O QueryInput detecta mudancas nessa prop e atualiza o input, posicionando o cursor apos "R$ ".

---

### 5. Animacao de Bounce no Clique

**Arquivo modificado:** `src/index.css`

Adicionar uma classe utilitaria para a animacao de bounce no clique dos Smart Actions:

```css
.animate-bounce-click {
  animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

A animacao `bounce-in` ja existe no `tailwind.config.ts` (keyframe definido nas linhas 92-97).

---

### Resumo dos Arquivos

| Arquivo | Acao |
|---------|------|
| `src/components/SmartActions.tsx` | **Criar** - Grid de acoes rapidas glassmorphism |
| `src/components/StreakBadge.tsx` | **Criar** - Badge de ofensiva com tooltip |
| `src/components/views/ChatView.tsx` | **Modificar** - Integrar os dois novos componentes + gerenciar prefill |
| `src/components/QueryInput.tsx` | **Modificar** - Aceitar valor externo via prop para prefill do input |
| `src/index.css` | **Modificar** - Adicionar classe de animacao bounce-click |

### Detalhes Tecnicos

#### SmartActions.tsx

```tsx
// Props
interface SmartActionsProps {
  onAction: (text: string) => void;
}

// Dados das acoes
const actions = [
  { icon: UtensilsCrossed, label: "Alimentacao", template: "Gastei R$  em Alimentacao" },
  { icon: Car, label: "Transporte", template: "Gastei R$  em Transporte" },
  { icon: ShoppingCart, label: "Mercado", template: "Gastei R$  em Mercado" },
  { icon: Gamepad2, label: "Lazer", template: "Gastei R$  em Lazer" },
];

// Cada botao: fundo glass, border-border/50, rounded-full, w-16 h-16
// Estado local: activeIndex para animacao bounce no clique
// Ao clicar: seta activeIndex, chama onAction(template), reseta apos 400ms
```

#### StreakBadge.tsx

```tsx
// Componente compacto com Tooltip
// Icone Flame com classe text-orange-400 + animate-pulse-glow
// Texto "3 Dias" com cor gradiente
// Tooltip com mensagem motivacional
// Background glass-card, inline-flex, rounded-full
```

#### QueryInput.tsx - Mudancas

```tsx
// Nova prop:
interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  prefillValue?: string;  // NOVO
}

// useEffect para reagir ao prefillValue:
useEffect(() => {
  if (prefillValue) {
    setQuery(prefillValue);
    // Posicionar cursor apos "R$ "
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        const cursorPos = prefillValue.indexOf("R$ ") + 3;
        input.focus();
        input.setSelectionRange(cursorPos, cursorPos);
      }
    }, 50);
  }
}, [prefillValue]);
```

#### ChatView.tsx - Mudancas

```tsx
// Novo estado:
const [prefillQuery, setPrefillQuery] = useState("");
const [prefillKey, setPrefillKey] = useState(0);

// Handler do SmartActions:
const handleSmartAction = (text: string) => {
  setPrefillQuery(text);
  setPrefillKey(prev => prev + 1); // Forcar re-render
};

// Layout atualizado:
// 1. WealthWidget + StreakBadge lado a lado (flex row)
// 2. SmartActions Grid abaixo
// 3. QueryInput com prefillValue
```

