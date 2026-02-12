

## Corrigir WealthWidget Travado em R$ 0,00

### Problemas Identificados

Dois erros de build e um problema de logica:

1. **`WealthWidget.tsx` linha 127**: referencia `patrimony` que nao existe mais como prop (foi removida no ultimo diff). Precisa usar `netWorth` diretamente.
2. **`Dashboard.tsx` linha 175**: usa `response?.net_worth`, mas `ApiResponse` nao tem campo `net_worth`. O `net_worth` vem do backend e precisa ser extraido via `transformBackendResponse` e armazenado num estado separado.
3. **Grafico estatico**: o grafico usa dados mockados fixos em vez de refletir o `netWorth` real.

---

### Correcoes

#### 1. `src/types/api.ts` - Adicionar `net_worth` ao `ApiResponse`

Adicionar campo opcional `net_worth?: number` na interface `ApiResponse` para que o Dashboard possa acessar diretamente.

#### 2. `src/components/Dashboard.tsx` - Extrair net_worth corretamente

O Dashboard usa `response?.net_worth`. Com o campo adicionado ao tipo, isso compila. Mas tambem precisa garantir que ao parsear a resposta do webhook, o `net_worth` seja mapeado para esse campo. 

Adicionar logica de transformacao no `handleQuery`: apos o `JSON.parse`, verificar se o dado bruto tem `variaveis_matematicas?.net_worth` ou `net_worth` na raiz, e incluir no objeto `response`.

#### 3. `src/components/wealth/WealthWidget.tsx` - Remover referencia a `patrimony`

Linha 127: trocar `netWorth !== undefined ? netWorth : patrimony` por simplesmente `netWorth`. O `patrimony` nao existe mais como prop.

O grafico `generateFakeHistory` ja usa `finalValue` que sera o `netWorth` -- uma vez que o valor chega corretamente, o grafico refletira o saldo real com variacao simulada nos dias anteriores.

---

### Resumo

| Arquivo | Mudanca |
|---------|---------|
| `src/types/api.ts` | Adicionar `net_worth?: number` em `ApiResponse` |
| `src/components/Dashboard.tsx` | Mapear `net_worth` do JSON bruto para o campo `response.net_worth` |
| `src/components/wealth/WealthWidget.tsx` | Linha 127: trocar `patrimony` por `netWorth` |

Resultado: o saldo exibe o valor real do webhook e o grafico gera a curva baseada nesse valor.

