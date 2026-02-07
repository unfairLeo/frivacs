

## Plano: Fix de UX Mobile - Menu Hamburguer Responsivo

### Diagnostico

O componente `Sidebar` (sidebar.tsx) ja possui suporte mobile nativo: quando `isMobile` e verdadeiro, ele renderiza o conteudo dentro de um `Sheet` (painel deslizante). O problema e que nao existe nenhum botao visivel no mobile para abrir esse Sheet.

### O Que Precisa Mudar

---

### 1. Adicionar Botao Hamburguer no Header Mobile

**Arquivo:** `src/components/layout/AppLayout.tsx`

No header existente (linha 24), adicionar um botao de menu hamburguer que:
- Aparece apenas no mobile (`md:hidden`)
- Usa o componente `SidebarTrigger` ou chama `toggleSidebar()` do contexto
- Usa o icone `Menu` do lucide-react (3 linhas horizontais)
- Fica posicionado no lado esquerdo do header
- O logo "MoneyPlan" aparece centralizado no header mobile

Layout do header no mobile:

```text
+----------------------------------+
| [=]   MoneyPlan        [Jogo 🎮] |
+----------------------------------+
```

O header passa de `justify-end` para `justify-between` para acomodar o hamburguer a esquerda e o toggle de jogo a direita.

---

### 2. Fechar Menu ao Clicar em Link

**Arquivo:** `src/components/layout/NavSidebar.tsx`

Quando o usuario clica em um link de navegacao no mobile, o Sheet deve fechar automaticamente. Para isso:
- Usar `setOpenMobile(false)` do contexto `useSidebar()` ao clicar em qualquer `NavLink`
- Isso garante que o menu fecha sem recarregar a pagina

---

### 3. Fechar Sheet do Historico ao Navegar

**Arquivo:** `src/components/layout/HistoryDrawer.tsx`

O mesmo comportamento de fechamento automatico deve ser aplicado ao selecionar uma conversa no historico - fechar tanto o Sheet do historico quanto o Sheet do menu mobile.

---

## Resumo das Alteracoes

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/layout/AppLayout.tsx` | Adicionar botao hamburguer `md:hidden` no header + logo mobile centralizado |
| `src/components/layout/NavSidebar.tsx` | Adicionar `onClick` nos NavLinks para fechar o menu mobile via `setOpenMobile(false)` |
| `src/components/layout/HistoryDrawer.tsx` | Fechar menu mobile ao selecionar conversa |

Nenhum arquivo novo precisa ser criado. O componente `Sheet` do mobile ja esta funcional - apenas falta o gatilho (trigger) visivel.

---

## Detalhes Tecnicos

### AppLayout.tsx - Header Atualizado

```tsx
<header className="h-14 border-b border-border/30 flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
  {/* Hamburger - Mobile Only */}
  <div className="flex items-center gap-3 md:hidden">
    <SidebarTrigger className="h-10 w-10" />
    <MoneyPlanLogo size="sm" />
    <span className="text-lg font-bold">
      <span className="text-primary">Money</span>
      <span className="text-foreground">Plan</span>
    </span>
  </div>

  {/* Spacer for desktop */}
  <div className="hidden md:block" />

  {/* Game Mode Toggle */}
  <div className="flex items-center gap-3">
    ...toggle existente...
  </div>
</header>
```

### NavSidebar.tsx - Auto-Fechar no Mobile

```tsx
const { state, toggleSidebar, isMobile, setOpenMobile } = useSidebar();

// Nos NavLinks, adicionar:
<NavLink
  to={item.path}
  onClick={() => isMobile && setOpenMobile(false)}
  ...
>
```

### Tamanho de Toque Adequado

Os itens de navegacao ja possuem `min-h-[52px]` (acima dos 44px minimos recomendados), entao estao adequados para toque mobile.

