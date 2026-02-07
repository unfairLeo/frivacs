

## Ocultar Badge Flutuante do Lovable

### O Que Sera Feito

Adicionar uma regra CSS no final do arquivo `src/index.css` para esconder o botao/badge "Edit in Lovable" que aparece no canto inferior direito da aplicacao.

### Alteracao

**Arquivo:** `src/index.css`

Adicionar ao final do arquivo um bloco CSS que:
- Seleciona o elemento `#lovable-badge` e qualquer `a` dentro dele
- Aplica `display: none !important` para garantir que o badge seja completamente ocultado
- Tambem cobre o seletor generico `[id^="lovable"]` como fallback

```css
/* Hide Lovable badge */
#lovable-badge,
#lovable-badge a,
[id^="lovable-badge"] {
  display: none !important;
}
```

### Nota

Essa alteracao e puramente visual e nao afeta nenhuma funcionalidade da aplicacao. O badge tambem pode ser removido oficialmente nas configuracoes do projeto (Settings > Hide 'Lovable' Badge) caso voce tenha um plano pago.

