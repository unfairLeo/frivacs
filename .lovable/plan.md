

## Plano: Correcao Critica de UX - Navegacao e Sidebar (Dock Mode)

### Visao Geral

Reestruturar a barra lateral esquerda para um padrao "App SaaS Premium" com navegacao clara, areas clicaveis maiores, estados ativos visiveis e separacao entre navegacao principal e historico de chats.

---

## Arquitetura da Solucao

```text
+--------------------------------------------------+
|                   SIDEBAR FIXA                    |
|                                                   |
|  +--------------------------------------------+  |
|  |  [$] MoneyPlan          (Logo + Titulo)    |  |
|  +--------------------------------------------+  |
|                                                   |
|  GRUPO A - Navegacao Principal                   |
|  +--------------------------------------------+  |
|  | [|] 🏠 Dashboard                           |  |  <- Borda esquerda neon
|  +--------------------------------------------+  |
|  |     🎯 Metas                               |  |
|  +--------------------------------------------+  |
|  |     🚀 Missoes                             |  |
|  +--------------------------------------------+  |
|  |     🎭 Personalidades                      |  |
|  +--------------------------------------------+  |
|  |     🏆 Conquistas                          |  |
|  +--------------------------------------------+  |
|                                                   |
|  SEPARADOR                                       |
|                                                   |
|  GRUPO B - Acoes                                 |
|  +--------------------------------------------+  |
|  |   🗂️ Historico de Chats     [>]           |  |  <- Abre Sheet/Drawer
|  +--------------------------------------------+  |
|                                                   |
|  RODAPE                                          |
|  +--------------------------------------------+  |
|  |           [<<] Recolher                    |  |  <- Botao de colapso
|  +--------------------------------------------+  |
+--------------------------------------------------+
```

---

## Parte 1: Sidebar Expandida por Padrao

### Alteracoes na Sidebar

| Elemento | Antes | Depois |
|----------|-------|--------|
| Largura padrao | 16rem (256px) | 18rem (288px) |
| Largura colapsada | 3rem (48px) | 4rem (64px) |
| Estado inicial | Dependente de cookie | Expandido (defaultOpen=true) |
| Icones | 20px (w-5) | 24px (w-6) |
| Padding dos botoes | py-3 px-3 | py-4 px-4 |

### Constantes Atualizadas

```typescript
// src/components/ui/sidebar.tsx
const SIDEBAR_WIDTH = "18rem";        // Aumentado de 16rem
const SIDEBAR_WIDTH_ICON = "4rem";    // Aumentado de 3rem
```

---

## Parte 2: Grupos de Navegacao Separados

### Estrutura do NavSidebar

```tsx
<Sidebar collapsible="icon">
  {/* Header com Logo */}
  <SidebarHeader>
    <MoneyPlanLogo /> + "MoneyPlan"
  </SidebarHeader>

  {/* Grupo A: Navegacao Principal */}
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Navegacao</SidebarGroupLabel>
      <SidebarMenu>
        {mainNavItems.map(...)}
      </SidebarMenu>
    </SidebarGroup>

    {/* Separador Visual */}
    <SidebarSeparator />

    {/* Grupo B: Historico */}
    <SidebarGroup>
      <SidebarGroupLabel>Acoes</SidebarGroupLabel>
      <SidebarMenuItem>
        <HistoryDrawerTrigger />
      </SidebarMenuItem>
    </SidebarGroup>
  </SidebarContent>

  {/* Footer com Botao de Colapso */}
  <SidebarFooter>
    <CollapseButton />
  </SidebarFooter>
</Sidebar>
```

### Itens de Navegacao

```typescript
const mainNavItems = [
  { 
    title: "Dashboard", 
    path: "/", 
    icon: Home,
    description: "Visao geral e chat"
  },
  { 
    title: "Metas", 
    path: "/metas", 
    icon: Target,
    description: "Seus cofres digitais"
  },
  { 
    title: "Missoes", 
    path: "/missoes", 
    icon: Rocket,
    description: "Desafios financeiros"
  },
  { 
    title: "Personalidades", 
    path: "/personalidades", 
    icon: Users,
    description: "Configurar IA"
  },
  { 
    title: "Conquistas", 
    path: "/conquistas", 
    icon: Trophy,
    description: "Sala de trofeus"
  },
];
```

---

## Parte 3: Estado Ativo Destacado

### Visual do Item Ativo

```text
Normal:          Hover:           Ativo:
+-----------+    +-----------+    +-----------+
|   🏠 Home |    | ▓ 🏠 Home |    |█ 🏠 Home ▓|
+-----------+    +-----------+    +-----------+
                 Fundo sutil      Borda esq + Fundo neon
```

### Classes CSS para Estados

```tsx
// Item Normal
className="text-muted-foreground hover:text-foreground hover:bg-muted/50"

// Item Ativo
activeClassName="bg-primary/20 text-primary border-l-4 border-primary neon-glow-emerald"
```

### CSS Adicional para Borda Esquerda

```css
/* src/index.css */
.nav-item-active {
  position: relative;
  background: hsl(var(--primary) / 0.15);
  color: hsl(var(--primary));
}

.nav-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: hsl(var(--primary));
  box-shadow: 0 0 10px hsl(var(--primary) / 0.6);
  border-radius: 0 2px 2px 0;
}
```

---

## Parte 4: Tooltips Instantaneos

### Comportamento

- **Sidebar Expandida**: Sem tooltip (texto ja visivel)
- **Sidebar Colapsada**: Tooltip aparece instantaneamente ao lado direito

### Implementacao

```tsx
<SidebarMenuButton 
  asChild 
  tooltip={{
    children: (
      <div>
        <p className="font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.description}</p>
      </div>
    ),
    side: "right",
    sideOffset: 8,
  }}
>
```

### Configuracao do TooltipProvider

```tsx
// src/components/ui/sidebar.tsx - ja tem delayDuration={0}
<TooltipProvider delayDuration={0}>
```

---

## Parte 5: Areas Clicaveis Maiores

### Antes vs Depois

| Propriedade | Antes | Depois |
|-------------|-------|--------|
| Padding vertical | py-3 (12px) | py-4 (16px) |
| Padding horizontal | px-3 (12px) | px-4 (16px) |
| Gap icone-texto | gap-3 (12px) | gap-4 (16px) |
| Tamanho icone | w-5 h-5 (20px) | w-6 h-6 (24px) |
| Border radius | rounded-xl | rounded-xl (mantido) |
| Min height | Nenhum | min-h-[52px] |

### Codigo do Botao

```tsx
<NavLink
  to={item.path}
  className="flex items-center gap-4 px-4 py-4 rounded-xl min-h-[52px] 
             transition-all duration-300 text-muted-foreground 
             hover:text-foreground hover:bg-muted/50 group"
  activeClassName="nav-item-active"
>
  <item.icon className="w-6 h-6 flex-shrink-0 group-hover:scale-110 transition-transform" />
  {!isCollapsed && (
    <span className="font-medium text-base">{item.title}</span>
  )}
</NavLink>
```

---

## Parte 6: Historico como Sheet/Drawer

### Remover RightSidebar Permanente

Atualmente o historico ocupa espaco fixo a direita. Vamos substituir por um Drawer que abre sob demanda.

### Novo Componente: HistoryDrawerButton

```tsx
export function HistoryDrawerButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { history, selectedId, selectConversation, deleteConversation } = useConversation();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-4 px-4 py-4 rounded-xl min-h-[52px] w-full
                          text-muted-foreground hover:text-foreground hover:bg-muted/50 
                          transition-all duration-300 group">
          <FolderClock className="w-6 h-6 flex-shrink-0" />
          <span className="font-medium text-base flex-1 text-left">Historico</span>
          {history.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {history.length}
            </Badge>
          )}
          <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-96">
        {/* Lista de conversas */}
      </SheetContent>
    </Sheet>
  );
}
```

---

## Parte 7: Botao de Colapso no Rodape

### Componente CollapseButton

```tsx
function CollapseButton() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center justify-center gap-3 px-4 py-3 w-full
                 text-muted-foreground hover:text-foreground hover:bg-muted/50
                 transition-all duration-300 rounded-xl"
    >
      {isCollapsed ? (
        <>
          <ChevronRight className="w-5 h-5" />
        </>
      ) : (
        <>
          <ChevronsLeft className="w-5 h-5" />
          <span className="text-sm">Recolher menu</span>
        </>
      )}
    </button>
  );
}
```

---

## Parte 8: Remover RightSidebar do Layout

### AppLayout Atualizado

```tsx
// ANTES
<div className="min-h-screen flex w-full bg-background">
  <NavSidebar />
  <div className="flex-1">...</div>
  <RightSidebar />  // <- Remover
</div>

// DEPOIS
<div className="min-h-screen flex w-full bg-background">
  <NavSidebar />  // <- Agora inclui botao de historico
  <div className="flex-1">...</div>
</div>
```

---

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/components/layout/HistoryDrawer.tsx` | Drawer com lista de historico |

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/layout/NavSidebar.tsx` | Redesign completo com grupos, icones maiores, estados |
| `src/components/layout/AppLayout.tsx` | Remover RightSidebar, ajustar layout |
| `src/components/ui/sidebar.tsx` | Aumentar larguras padrao |
| `src/index.css` | Adicionar classe `.nav-item-active` |

---

## Detalhes de Implementacao

### NavSidebar Completo

```tsx
export function NavSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border/30 bg-sidebar" collapsible="icon">
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <MoneyPlanLogo size="md" />
          {!isCollapsed && (
            <h1 className="text-xl font-sans font-bold tracking-tight">
              <span className="text-primary text-glow-emerald">Money</span>
              <span className="text-foreground">Plan</span>
            </h1>
          )}
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs text-muted-foreground/70 uppercase tracking-wider">
            {!isCollapsed && "Navegacao"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    size="lg"
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className="flex items-center gap-4 px-4 py-4 rounded-xl min-h-[52px]
                                 transition-all duration-300 text-muted-foreground 
                                 hover:text-foreground hover:bg-muted/50 group"
                      activeClassName="nav-item-active"
                    >
                      <item.icon className="w-6 h-6 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      {!isCollapsed && (
                        <span className="font-medium text-base">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        {/* History Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs text-muted-foreground/70 uppercase tracking-wider">
            {!isCollapsed && "Acoes"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <HistoryDrawerButton isCollapsed={isCollapsed} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - Collapse Button */}
      <SidebarFooter className="p-2 border-t border-border/30">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center gap-3 px-4 py-3 w-full
                     text-muted-foreground hover:text-foreground hover:bg-muted/50
                     transition-all duration-300 rounded-xl"
        >
          {isCollapsed ? (
            <ChevronsRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronsLeft className="w-5 h-5" />
              <span className="text-sm">Recolher menu</span>
            </>
          )}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
```

---

## Fluxo Visual Final

### Sidebar Expandida (Padrao)

```text
+--------------------------------+
|  [$] MoneyPlan                 |
+--------------------------------+
|  NAVEGACAO                     |
|                                |
| [█] 🏠 Dashboard         ▓▓▓  |  <- Ativo (borda + glow)
|     🎯 Metas                   |
|     🚀 Missoes                 |
|     🎭 Personalidades          |
|     🏆 Conquistas              |
|                                |
|  ─────────────────────────     |
|                                |
|  ACOES                         |
|  🗂️ Historico        [3] [>]  |  <- Badge + Seta
|                                |
+--------------------------------+
|  [<<] Recolher menu            |
+--------------------------------+
```

### Sidebar Colapsada

```text
+------+
|  [$] |
+------+
|      |
| [🏠] |  <- Tooltip: "Dashboard"
| [🎯] |
| [🚀] |
| [🎭] |
| [🏆] |
|      |
| ──── |
|      |
| [🗂️] |  <- Tooltip: "Historico (3)"
|      |
+------+
| [>>] |
+------+
```

---

## Consideracoes Tecnicas

### Acessibilidade

- Todos os botoes com `aria-label` apropriados
- Tooltips com `role="tooltip"`
- Navegacao por teclado mantida
- Focus visible em todos os elementos interativos

### Performance

- Transicoes CSS apenas em `transform` e `opacity`
- Sheet carrega historico sob demanda
- Tooltips com `delayDuration={0}` para resposta imediata

### Responsividade

- Em mobile: Sheet ocupa tela inteira
- Sidebar se torna drawer em telas < md
- Botao de colapso oculto em mobile (usa Sheet)

