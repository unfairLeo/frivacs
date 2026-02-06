

## Alteração da URL do Webhook n8n

### O que será feito

Atualizar a URL do webhook n8n no arquivo de configuração da API.

### Arquivo a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/lib/api.ts` | Linha 4 - trocar URL do webhook |

### Mudança

**Antes:**
```typescript
const API_URL = "https://jpleoz.app.n8n.cloud/webhook/68819970-dbf1-49df-8e8b-d8c871e7301c";
```

**Depois:**
```typescript
const API_URL = "https://zoleon.app.n8n.cloud/webhook/68819970-dbf1-49df-8e8b-d8c871e7301c";
```

### Observação Técnica

O endpoint (UUID) permanece o mesmo, apenas o subdomínio muda de `jpleoz` para `zoleon`. Isso indica que o workflow foi migrado para uma nova instância n8n.

