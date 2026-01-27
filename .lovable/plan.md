

## Plano: Gerenciamento de Metas com CRUD e Geracao Automatica de Missoes

### Resumo das Alteracoes

1. Remover "Graficos" da navegacao lateral
2. Adicionar botao "Nova Meta" com modal de criacao/edicao
3. Implementar geracao automatica de missoes baseada no titulo
4. Adicionar botao "+" para missoes manuais
5. Checkboxes funcionais que atualizam o progresso

---

### Parte 1: Remover "Graficos" da Sidebar

**Arquivo:** `src/components/layout/NavSidebar.tsx`

Remover o item "Graficos" do array `navItems` e remover o import do icone `BarChart3`:

```tsx
const navItems = [
  { title: "Chats", path: "/", icon: MessageSquare },
  { title: "Metas", path: "/metas", icon: Target },
  { title: "Missoes", path: "/missoes", icon: Rocket },
  // Graficos removido
];
```

**Arquivo:** `src/App.tsx`

Remover a rota `/graficos` e o import de `GraficosView`.

---

### Parte 2: Estado e Tipos para Gerenciamento de Metas

**Arquivo:** `src/components/views/MetasView.tsx`

Adicionar estado React para gerenciar metas dinamicamente:

```tsx
interface Meta {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  icon: keyof typeof iconMap;
  deadline: Date | null;
  missions: Mission[];
}

// Estado no componente
const [metas, setMetas] = useState<Meta[]>(mockMetas);
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
```

---

### Parte 3: Modal de Criar/Editar Meta

**Novo componente dentro de MetasView:** `MetaFormModal`

Campos do formulario:
- **Titulo da Meta** (Input texto)
- **Valor Total** (Input numerico, R$)
- **Valor Ja Guardado** (Input numerico, R$)
- **Prazo Final** (DatePicker usando Calendar + Popover)
- **Categoria/Icone** (Select com icones: Aviao, Casa, Carro, Formatura, Generico)

```tsx
interface MetaFormData {
  title: string;
  targetValue: number;
  currentValue: number;
  deadline: Date | null;
  icon: keyof typeof iconMap;
}
```

**Estilo do Modal:**
- Background: `bg-card` com borda `border-border/50`
- Header com gradiente neon
- Botoes com estilo `neon` e `glass`
- Campos de input com fundo `bg-muted/50`

---

### Parte 4: Geracao Automatica de Missoes

**Funcao:** `generateMissions(title: string): Mission[]`

Logica baseada em palavras-chave no titulo:

```tsx
const generateMissions = (title: string): Mission[] => {
  const lowerTitle = title.toLowerCase();
  
  const missionTemplates: Record<string, string[]> = {
    viagem: ["Pesquisar destinos", "Guardar 15% da renda mensal", "Cotar passagens aereas"],
    carro: ["Pesquisar modelos economicos", "Guardar 20% da renda mensal", "Cotar seguros"],
    casa: ["Pesquisar bairros", "Simular financiamento", "Juntar entrada de 20%"],
    apartamento: ["Pesquisar bairros", "Simular financiamento", "Juntar entrada de 20%"],
    curso: ["Pesquisar instituicoes", "Comparar precos", "Reservar para matricula"],
    mba: ["Pesquisar instituicoes", "Preparar documentos", "Planejar horarios"],
    faculdade: ["Pesquisar cursos", "Fazer inscricao ENEM", "Guardar para mensalidades"],
  };

  // Buscar template correspondente ou usar generico
  for (const [keyword, missions] of Object.entries(missionTemplates)) {
    if (lowerTitle.includes(keyword)) {
      return missions.map((title, i) => ({
        id: `${Date.now()}-${i}`,
        title,
        completed: false,
      }));
    }
  }

  // Missoes genericas
  return [
    { id: `${Date.now()}-0`, title: "Definir valor mensal a guardar", completed: false },
    { id: `${Date.now()}-1`, title: "Pesquisar opcoes", completed: false },
    { id: `${Date.now()}-2`, title: "Criar cronograma", completed: false },
  ];
};
```

---

### Parte 5: Adicionar Missao Manual

Dentro de cada card de meta, adicionar botao "+" para criar missao:

```tsx
<button
  onClick={() => handleAddMission(meta.id)}
  className="flex items-center gap-2 p-2 w-full rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors"
>
  <Plus className="w-4 h-4 text-muted-foreground" />
  <span className="text-sm text-muted-foreground">Adicionar missao</span>
</button>
```

Ao clicar, abre um pequeno input inline ou modal simples para digitar o titulo da missao.

---

### Parte 6: Checkboxes Funcionais

Substituir os divs estaticos por checkboxes clicaveis que atualizam o estado:

```tsx
const handleToggleMission = (metaId: string, missionId: string) => {
  setMetas((prev) =>
    prev.map((meta) => {
      if (meta.id !== metaId) return meta;
      return {
        ...meta,
        missions: meta.missions.map((mission) =>
          mission.id === missionId
            ? { ...mission, completed: !mission.completed }
            : mission
        ),
      };
    })
  );
};
```

A barra de progresso ja esta calculada com base em `currentValue/targetValue`, mas podemos adicionar um indicador visual adicional baseado nas missoes completadas.

---

### Parte 7: Botao "Nova Meta" no Header

Adicionar botao de destaque no header da pagina:

```tsx
<header className="mb-8 flex items-center justify-between">
  <div>
    <div className="flex items-center gap-3 mb-2">
      <div className="p-3 rounded-xl bg-primary/20 neon-glow-emerald">
        <Target className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-3xl md:text-4xl font-display font-bold">
        Minhas Metas
      </h1>
    </div>
    <p className="text-muted-foreground">
      Acompanhe o progresso das suas metas financeiras
    </p>
  </div>
  
  <Button 
    onClick={() => { setEditingMeta(null); setIsModalOpen(true); }}
    variant="neon"
    className="gap-2"
  >
    <Plus className="w-5 h-5" />
    Nova Meta
  </Button>
</header>
```

---

### Parte 8: Abrir Modal em Modo Edicao

Adicionar `onClick` nos cards existentes para editar:

```tsx
<div
  key={meta.id}
  onClick={() => { setEditingMeta(meta); setIsModalOpen(true); }}
  className="glass-card p-6 cursor-pointer transition-all duration-300 hover:border-primary/50 group"
>
  ...
</div>
```

O modal verifica se `editingMeta` existe:
- Se `editingMeta !== null`: modo edicao, pre-preenche campos
- Se `editingMeta === null`: modo criacao, campos vazios

---

### Arquivos a Modificar

| Arquivo | Acao |
|---------|------|
| `src/components/layout/NavSidebar.tsx` | Remover "Graficos" do menu |
| `src/App.tsx` | Remover rota `/graficos` |
| `src/components/views/MetasView.tsx` | Refatorar completamente para CRUD |

---

### Componentes UI Utilizados

Ja existentes no projeto:
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` (modal)
- `Button` com variantes `neon`, `glass`
- `Input` para campos de texto/numero
- `Calendar` + `Popover` para DatePicker
- `Select` para escolha de icone
- `Progress` para barra de progresso

---

### Fluxo de Usuario

```text
1. Usuario abre aba "Metas"
   |
   +-- Ve lista de metas existentes
   |
   +-- Clica "Nova Meta"
       |
       +-- Modal abre (modo criacao)
       |
       +-- Preenche: Titulo, Valores, Prazo, Icone
       |
       +-- Clica "Criar"
           |
           +-- Sistema gera 3 missoes automaticas
           |
           +-- Card aparece na lista

2. Usuario clica em card existente
   |
   +-- Modal abre (modo edicao)
   |
   +-- Altera valores
   |
   +-- Clica "Salvar"

3. Usuario clica checkbox de missao
   |
   +-- Missao marca/desmarca
   |
   +-- Visual atualiza instantaneamente

4. Usuario clica "+" em missoes
   |
   +-- Input aparece
   |
   +-- Digita nova missao
   |
   +-- Missao adicionada ao card
```

---

### Estilo Visual do Modal

```text
+------------------------------------------+
|  [X]                                     |
|                                          |
|  + Nova Meta          (ou "Editar Meta") |
|  ----------------------------------------|
|                                          |
|  Titulo da Meta                          |
|  [________________________]              |
|                                          |
|  Valor Total (R$)    Valor Guardado (R$) |
|  [__________]        [__________]        |
|                                          |
|  Prazo Final                             |
|  [Selecionar data...]                    |
|                                          |
|  Categoria                               |
|  [Aviao ▼]                               |
|                                          |
|  ----------------------------------------|
|  [Cancelar]              [Criar Meta]    |
+------------------------------------------+
```

- Fundo: `bg-card` com `backdrop-blur`
- Borda: `border-border/50` com gradiente neon sutil
- Botao principal: variante `neon` (verde brilhante)
- Botao secundario: variante `ghost`

---

### Dependencias Ja Instaladas

Todas as bibliotecas necessarias ja estao no projeto:
- `@radix-ui/react-dialog` (modal)
- `@radix-ui/react-popover` (datepicker)
- `@radix-ui/react-select` (seletor de icone)
- `react-day-picker` (calendario)
- `date-fns` (formatacao de datas)
- `lucide-react` (icones)
- `zod` (validacao de formulario)
- `react-hook-form` (gerenciamento de formulario)

