# Frontend Netlify - Central de Relatórios

Este é somente o front-end estático.

## Publicar no Netlify
1. Envie esta pasta para um repositório GitHub.
2. No Netlify, crie um novo site usando esse repositório.
3. Build command: deixe vazio.
4. Publish directory: `.`

## Conectar ao backend do Render
Depois que o backend estiver publicado no Render, edite o arquivo `config.js`:

```js
window.RELATORIOS_CONFIG = {
  API_BASE_URL: 'https://SEU-BACKEND.onrender.com'
};
```

Não coloque barra no final da URL.

## Atualizações desta versão
- Campos de usuário e senha vêm em branco.
- O período agora é selecionado por um calendário de intervalo: clique no campo "Período do relatório", escolha a data inicial e a data final e depois clique em "Aplicar período".
- As horas inicial e final ficam separadas como campos de horário.

## Versão completa preservada

Esta versão mantém todos os blocos do projeto e adiciona o contador de execução:

- contador de página atual, exemplo: `3 de 21`;
- tempo estimado restante;
- velocidade média de captura;
- registros lidos;
- progresso circular e barra linear;
- resultado final com CSV/Excel;
- histórico resumido;
- configurações rápidas.

Nenhuma função foi removida para adicionar o contador.

## Atualização FloraGold v0.8.5
- Visual verde brilhante no estilo FloraGold.
- Layout sem barra lateral.
- Cabeçalho principal com identidade FloraGold.
- Status do sistema reduzido para um bloco pequeno.
- Validações obrigatórias em chips/cards mais bonitos.
- Mantém formulário, calendário de período, execução em tempo real, resultado, downloads, histórico e configurações rápidas.
