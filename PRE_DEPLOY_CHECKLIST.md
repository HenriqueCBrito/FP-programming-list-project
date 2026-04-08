# Pre-Deploy Checklist

## Ambiente

- Confirmar `backend/.env` com `PORT`, `HOST` e `CORS_ORIGIN`.
- Confirmar `frontend/.env` com `VITE_API_BASE_URL` apontando para a API correta.
- Garantir que `backend/src/data/feedbacks.json` esta no servidor e nao no frontend.

## Validacao Tecnica

### Backend

- Rodar `npm test`.
- Validar `GET /api/health`.
- Validar `GET /api/feedback/:listId/:token` com token valido.
- Validar token invalido retornando `404`.
- Validar lista invalida retornando `404`.

### Frontend

- Rodar `npm run build`.
- Testar `/lista/:listId/:token` com um aluno valido.
- Testar link invalido.
- Testar erro de rede.
- Testar mobile e desktop.

## Conteudo

- Revisar nomes exatos dos alunos ja cadastrados.
- Revisar `listId` correto de cada registro.
- Confirmar token unico por aluno e ausencia de duplicidade indevida.
- Confirmar nota final.
- Confirmar tema.
- Confirmar feedback geral.
- Confirmar mensagem final.
- Confirmar feedback por questao.
- Revisar trechos de codigo e observacoes multiline.

## Seguranca e Contrato

- Confirmar que `token` nao aparece na resposta da API.
- Confirmar que o frontend nunca recebe todos os alunos.
- Confirmar resposta neutra para links invalidos.
- Confirmar que o JSON guarda conteudo e chave de tema, nao CSS.

## Deploy Readiness

- Backend pronto para subir em Render ou Railway.
- Frontend pronto para subir em Vercel ou Netlify.
- URL publica da API configurada no frontend.
- `CORS_ORIGIN` configurado no backend com a URL publica do frontend.
- Fazer smoke test com pelo menos 2 alunos e 2 tokens diferentes.
