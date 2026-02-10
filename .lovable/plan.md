

## Patrimonio Dinamico - Remover Valor Hardcoded

### Problema

O `WealthWidget` tem um default hardcoded de `12.450` na prop `patrimony`. A integracao com o webhook ja existe (o `ChatView` passa `netWorth` corretamente), mas enquanto nenhuma resposta chega, o widget exibe R$ 12.450,00 ao inves de R$ 0,00.

### Mudanca

Uma unica alteracao em um unico arquivo:

| Arquivo | Acao |
|---------|------|
| `src/components/wealth/WealthWidget.tsx` | **Modificar** - Alterar default de `patrimony` de `12450` para `0` |

### Detalhe Tecnico

Na linha 102 do `WealthWidget.tsx`, mudar:

```text
patrimony = 12450
```

para:

```text
patrimony = 0
```

Isso faz o widget iniciar mostrando "R$ 0,00" e atualizar automaticamente quando o webhook retornar `net_worth` (a logica de passagem da prop ja funciona no `ChatView` linha 163).

Nenhuma outra alteracao necessaria -- graficos, filtros, tooltip e badge permanecem intactos.
