
## Plano: Refatorar Layout para Dashboard Cyberpunk com Barras Laterais

### Visao Geral da Arquitetura

A aplicacao sera reorganizada em um "App Shell" com:
- **Barra Lateral Esquerda (Navegacao)**: Menu fixo com itens Chats, Metas, Missoes, Graficos
- **Area Central (Conteudo)**: Renderiza dinamicamente o componente selecionado
- **Barra Lateral Direita (Historico)**: Historico de conversas movido para ca

```text
+------------------+---------------------------+------------------+
|                  |                           |                  |
|   NAV SIDEBAR    |      AREA CENTRAL         | HISTORY SIDEBAR  |
|    (Esquerda)    |       (Conteudo)          |    (Direita)     |
|                  |                           |                  |
|  [x] Chats       |   - Chat View (atual)     |  Conversas       |
|  [ ] Metas       |   - Metas Dashboard       |  salvas          |
|  [ ] Missoes     |   - Missoes (futuro)      |                  |
|  [ ] Graficos    |   - Graficos (futuro)     |                  |
|                  |                           |                  |
+------------------+---------------------------+------------------+
```

---

### Arquivos a Criar

#### 1. `src/components/layout/AppLayout.tsx`
Layout principal (App Shell) com:
- SidebarProvider do Shadcn para gerenciar estado
- Barra lateral esquerda de navegacao (fixa, colapsavel)
- Slot central para conteudo dinamico
- Barra lateral direita para historico

#### 2. `src/components/layout/NavSidebar.tsx`
Barra de navegacao esquerda com:
- Logo Frivac$ no topo
- Itens de menu: Chats (MessageSquare), Metas (Target), Missoes (Rocket), Graficos (BarChart3)
- Estilo dark cyberpunk com hover neon
- Indicador visual do item ativo

#### 3. `src/components/layout/RightSidebar.tsx`
Barra de historico direita (adaptar HistorySidebar atual):
- Sempre visivel em desktop
- Colapsavel em mobile
- Manter toda a funcionalidade existente

#### 4. `src/components/views/ChatView.tsx`
Extrair a logica de chat do Dashboard.tsx:
- Manter exatamente o mesmo comportamento
- QueryInput, ConversationCard, MetricsGrid, ChartDisplay
- Estados de loading, error, empty
- Integrar com hook useConversationHistory

#### 5. `src/components/views/MetasView.tsx`
Novo dashboard de metas:
- Cards glassmorphism com metas (ex: "Viagem Japao")
- Barra de progresso neon (ciano/verde)
- Lista de checks de missoes vinculadas
- Dados mockados inicialmente

#### 6. `src/components/views/MissoesView.tsx` (placeholder)
Pagina placeholder para futuras missoes

#### 7. `src/components/views/GraficosView.tsx` (placeholder)
Pagina placeholder para graficos gerais

---

### Arquivos a Modificar

#### 1. `src/App.tsx`
- Configurar rotas: `/`, `/metas`, `/missoes`, `/graficos`
- Usar AppLayout como wrapper

#### 2. `src/pages/Index.tsx`
- Remover Dashboard, usar AppLayout com ChatView

#### 3. `src/index.css`
- Adicionar variaveis CSS para sidebar
- Cores: `--sidebar-background`, `--neon-cyan`
- Fundo Deep Navy: atualizar `--background` para `#0a0f1c`

#### 4. `src/components/HistorySidebar.tsx`
- Sera substituido por RightSidebar (pode ser deletado)

---

### Estrutura de Pastas Final

```text
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx       (NOVO)
│   │   ├── NavSidebar.tsx      (NOVO)
│   │   └── RightSidebar.tsx    (NOVO)
│   ├── views/
│   │   ├── ChatView.tsx        (NOVO - extraido do Dashboard)
│   │   ├── MetasView.tsx       (NOVO)
│   │   ├── MissoesView.tsx     (NOVO - placeholder)
│   │   └── GraficosView.tsx    (NOVO - placeholder)
│   ├── ChartDisplay.tsx        (manter)
│   ├── ConversationCard.tsx    (manter)
│   ├── MetricsGrid.tsx         (manter)
│   ├── QueryInput.tsx          (manter)
│   └── ui/...                  (manter)
```

---

### Detalhes Tecnicos

#### Navegacao com React Router
```tsx
// App.tsx
<BrowserRouter>
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<ChatView />} />
      <Route path="/metas" element={<MetasView />} />
      <Route path="/missoes" element={<MissoesView />} />
      <Route path="/graficos" element={<GraficosView />} />
    </Route>
  </Routes>
</BrowserRouter>
```

#### NavSidebar - Itens de Menu
```tsx
const navItems = [
  { title: "Chats", path: "/", icon: MessageSquare },
  { title: "Metas", path: "/metas", icon: Target },
  { title: "Missoes", path: "/missoes", icon: Rocket },
  { title: "Graficos", path: "/graficos", icon: BarChart3 },
];
```

#### Estilo Visual da Sidebar
- Fundo: `bg-[#0a0f1c]` ou variavel CSS
- Borda direita: `border-r border-border/30`
- Items hover: gradiente ciano neon com glow
- Item ativo: fundo com brilho neon

#### MetasView - Estrutura do Card
```tsx
interface Meta {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  icon: string;
  missions: { id: string; title: string; completed: boolean }[];
}
```

Cada card de meta tera:
- Icone + Titulo
- Barra de progresso neon (0-100%)
- Lista de missoes com checkboxes
- Valores: atual / objetivo

#### CSS - Novas Variaveis
```css
:root {
  --background: 222 47% 4%;     /* #0a0f1c */
  --neon-cyan: 180 84% 45%;
  --sidebar: 222 47% 6%;
  --sidebar-foreground: 0 0% 95%;
  --sidebar-border: 220 20% 18%;
  --sidebar-accent: 180 84% 45%;
}
```

---

### Preservacao da Funcionalidade do Chat

A logica do chat atual (em Dashboard.tsx) sera movida INTEGRALMENTE para ChatView.tsx:

1. **Estados preservados**: isLoading, response, error, selectedConversationId
2. **Funcoes preservadas**: handleQuery, handleSelectConversation, handleDeleteConversation
3. **Hook preservado**: useConversationHistory
4. **Componentes preservados**: QueryInput, ConversationCard, MetricsGrid, ChartDisplay
5. **Integracao n8n**: mesma URL e logica de fetch

A unica mudanca e que o historico sera passado para RightSidebar via contexto ou props.

---

### Comunicacao entre Componentes

Criar um contexto para compartilhar o estado do historico:

```tsx
// src/contexts/ConversationContext.tsx
const ConversationContext = createContext<{
  history: SavedConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}>(...);
```

Isso permite que RightSidebar acesse o historico enquanto ChatView gerencia o estado.

---

### Resumo das Entregas

| Componente | Acao | Prioridade |
|------------|------|------------|
| AppLayout.tsx | Criar | Alta |
| NavSidebar.tsx | Criar | Alta |
| RightSidebar.tsx | Criar (adaptar HistorySidebar) | Alta |
| ChatView.tsx | Criar (extrair de Dashboard) | Alta |
| MetasView.tsx | Criar | Media |
| MissoesView.tsx | Criar (placeholder) | Baixa |
| GraficosView.tsx | Criar (placeholder) | Baixa |
| App.tsx | Modificar rotas | Alta |
| index.css | Atualizar cores/variaveis | Alta |
| ConversationContext.tsx | Criar | Alta |

---

### Resultado Visual Esperado

- Layout de 3 colunas em desktop (sidebar + conteudo + historico)
- Sidebar esquerda colapsavel com icones neon
- Area central com fundo Deep Navy e efeitos de particulas
- Sidebar direita mostrando historico de conversas
- Transicoes suaves entre abas (Chats, Metas, etc)
- Chat funcional exatamente como antes
- Dashboard de Metas com cards glassmorphism e barras neon
