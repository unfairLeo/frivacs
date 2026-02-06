

## Plano: Correcao Critica de UX - Navegacao e Sidebar (Dock Mode)

### Visao Geral

Reestruturar a barra lateral esquerda para um padrao "App SaaS Premium" com navegacao clara, areas clicaveis maiores, estados ativos visiveis e separacao entre navegacao principal e historico de chats.

---

## Arquitetura da Solucao

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
|  🗂️ Historico        [3] [>]  |  <- Badge + Seta (abre Drawer)
|                                |
+--------------------------------+
|  [<<] Recolher menu            |
+--------------------------------+
```

---

## Parte 1: Sidebar Expandida por Padrao

### Dimensoes Atualizadas

| Elemento | Antes | Depois |
|----------|-------|--------|
| Largura padrao | 16rem (256px) | 18rem (288px) |
| Largura colapsada | 3rem (48px) | 4rem (64px) |
| Icones | w-5 (20px) | w-6 (24px) |
| Padding dos botoes | py-3 px-3 | py-4 px-4 |
| Gap icone-texto | gap-3 | gap-4 |
| Altura minima item | Nenhuma | min-h-[52px] |

---

## Parte 2: Grupos de Navegacao Separados

### Grupo A - Navegacao Principal

| Icone | Titulo | Rota |
|-------|--------|------|
| Home | Dashboard | / |
| Target | Metas | /metas |
| Rocket | Missoes | /missoes |
| Users | Personalidades | /personalidades |
| Trophy | Conquistas | /conquistas |

### Grupo B - Acoes (Historico)

Botao especial que abre um **Sheet/Drawer** lateral com a lista de conversas:
- Icone: FolderClock ou History
- Badge com contador de conversas
- Seta indicando que abre painel

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

### CSS para Estado Ativo

Nova classe `.nav-item-active` com:
- Borda esquerda de 4px verde neon
- Fundo translucido com primary/15
- Glow sutil na borda

---

## Parte 4: Historico como Drawer

Remover a `RightSidebar` fixa do layout e substituir por um Sheet que abre sob demanda a partir do botao "Historico" na navegacao.

---

## Parte 5: Botao de Colapso no Rodape

Adicionar um `SidebarFooter` com botao que alterna entre:
- **Expandido**: `[<<] Recolher menu`
- **Colapsado**: `[>>]` (apenas icone)

---

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/components/layout/HistoryDrawer.tsx` | Drawer lateral com lista de historico |

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/layout/NavSidebar.tsx` | Redesign completo com grupos, icones maiores, estados, botao de colapso |
| `src/components/layout/AppLayout.tsx` | Remover RightSidebar do layout |
| `src/components/ui/sidebar.tsx` | Aumentar SIDEBAR_WIDTH para 18rem e SIDEBAR_WIDTH_ICON para 4rem |
| `src/index.css` | Adicionar classe `.nav-item-active` para borda esquerda neon |

---

## Detalhes de Implementacao

### NavSidebar.tsx - Estrutura Principal

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
        {mainNavItems.map((item) => (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={item.title}>
              <NavLink 
                className="flex items-center gap-4 px-4 py-4 min-h-[52px] rounded-xl"
                activeClassName="nav-item-active"
              >
                <Icon className="w-6 h-6" />
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>

    <SidebarSeparator />

    {/* Grupo B: Historico */}
    <SidebarGroup>
      <SidebarGroupLabel>Acoes</SidebarGroupLabel>
      <HistoryDrawerButton />
    </SidebarGroup>
  </SidebarContent>

  {/* Footer com Botao de Colapso */}
  <SidebarFooter>
    <CollapseButton />
  </SidebarFooter>
</Sidebar>
```

### HistoryDrawer.tsx - Drawer com Historico

```tsx
<Sheet>
  <SheetTrigger>
    <button className="flex items-center gap-4 px-4 py-4 min-h-[52px]">
      <FolderClock className="w-6 h-6" />
      <span>Historico</span>
      <Badge>{history.length}</Badge>
      <ChevronRight />
    </button>
  </SheetTrigger>
  
  <SheetContent side="left" className="w-96">
    <SheetHeader>
      <SheetTitle>Historico de Conversas</SheetTitle>
    </SheetHeader>
    
    <ScrollArea>
      {history.map((conversation) => (
        <ConversationItem key={conversation.id} />
      ))}
    </ScrollArea>
  </SheetContent>
</Sheet>
```

### CSS - Estado Ativo com Borda Neon

```css
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

## Sidebar Colapsada

Quando colapsada, a sidebar mostra apenas icones com tooltips instantaneos:

```text
+------+
|  [$] |
+------+
| [🏠] |  <- Tooltip: "Dashboard"
| [🎯] |
| [🚀] |
| [🎭] |
| [🏆] |
| ──── |
| [🗂️] |  <- Tooltip: "Historico (3)"
+------+
| [>>] |
+------+
```

---

## Beneficios da Mudanca

1. **Areas clicaveis maiores** - De 44px para 52px de altura minima
2. **Icones mais visiveis** - De 20px para 24px
3. **Estado ativo claro** - Borda esquerda neon + fundo translucido
4. **Historico separado** - Nao compete com navegacao principal
5. **Botao de colapso acessivel** - No rodape, sempre visivel
6. **Tooltips instantaneos** - delayDuration=0 ja configurado
7. **Mais espaco para conteudo** - Sem RightSidebar fixa ocupando espaco

