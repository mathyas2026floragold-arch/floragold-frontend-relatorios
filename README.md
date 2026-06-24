# Frontend Netlify - Relatório FloraGold v0.8.5

Este pacote já está pronto para publicar no Netlify.

## Backend configurado
O arquivo `config.js` já aponta para:

```js
API_BASE_URL: 'https://floragold-backend-relatorios.onrender.com'
```

## Como publicar no Netlify

1. Entre no Netlify.
2. Clique em **Add new site**.
3. Escolha **Deploy manually**.
4. Arraste a pasta `frontend-netlify-floragold-pronto` inteira para o Netlify.
5. Aguarde publicar.
6. Abra o link gerado pelo Netlify.

## Observação
O backend ainda está em `DEMO_MODE=true`, então primeiro ele vai simular o relatório.
Depois que o teste funcionar, mude `DEMO_MODE=false` no Render para tentar usar o sistema real.
