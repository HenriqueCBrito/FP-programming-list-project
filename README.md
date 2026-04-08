# Feedback App

Aplicacao para entregar feedback individual por aluno com:

- frontend em React + Vite
- backend em Node.js + Express
- dados em `feedbacks.json`
- links publicos por aluno no formato `/lista/:listId/:token`

## Estrutura

```text
feedback-app/
  frontend/
  backend/
```

## Rodando localmente

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend padrao: `http://localhost:3001`

Se quiser configurar host, porta ou CORS:

```bash
cp .env.example .env
```

O backend le as variaveis de `backend/.env` ao rodar `npm run dev` e `npm start`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend padrao: `http://localhost:5173`

Se o backend estiver em outra URL:

```bash
cp .env.example .env
```

## Fluxo principal

- aluno acessa `/lista/1/9xK2mPq7RaN4`
- frontend le `listId` e `token`
- frontend chama `GET /api/feedback/1/9xK2mPq7RaN4`
- backend busca o registro no JSON
- backend remove o token da resposta
- frontend renderiza o feedback premium

## Analise de questoes

- painel no frontend: `/analise/questoes`
- filtro por lista: `/analise/questoes?listId=1`
- endpoint da API: `GET /api/analytics/questions`
- endpoint com filtro: `GET /api/analytics/questions?listId=1`

O ranking prioriza:

- quantos alunos erraram a questao
- depois a perda total de pontos
- depois o numero da questao

## Variaveis opcionais

### Backend

- `PORT`: porta do servidor. Padrao `3001`
- `HOST`: host de bind. Padrao `0.0.0.0`
- `CORS_ORIGIN`: lista CSV de origens liberadas ou `*`
- `ANALYTICS_ACCESS_KEY`: chave simples para liberar o painel `/analise/questoes`
- `FEEDBACK_RATE_LIMIT_MAX`: maximo de requests por janela nas rotas de feedback
- `FEEDBACK_RATE_LIMIT_WINDOW_MS`: janela do rate limit em milissegundos

### Frontend

- `VITE_API_BASE_URL`: URL base da API. Padrao `http://localhost:3001`

## Validacao

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm run build
```

## Antes do deploy

Checklist tecnico:

- confirmar `VITE_API_BASE_URL` com a URL publica do backend
- configurar `CORS_ORIGIN` com a URL publica do frontend
- configurar `ANALYTICS_ACCESS_KEY` no backend
- validar rota `GET /api/feedback/:listId/:token`
- validar 404 neutro para links invalidos
- validar acesso restrito ao painel de analise
- testar mobile e desktop

Checklist de conteudo:

- revisar nomes, notas e temas dos alunos ja cadastrados
- revisar feedback geral, fechamento e questoes por consistencia editorial
- confirmar que todos os tokens continuam unicos e nao previsiveis
- verificar se nenhum token aparece na resposta da API

Checklist detalhado:

- [PRE_DEPLOY_CHECKLIST.md](/home/ricobrto/PersonalDevelopment/feedback/feedback-app/PRE_DEPLOY_CHECKLIST.md)

## Estado atual do conteudo

O arquivo `backend/src/data/feedbacks.json` ja contem os 25 alunos mapeados na lista de notas finais, com dados reais e token unico por aluno.

Se novos feedbacks chegarem depois (por exemplo, novas listas), use:

- [CONTENT_REQUEST_TEMPLATE.md](/home/ricobrto/PersonalDevelopment/feedback/feedback-app/CONTENT_REQUEST_TEMPLATE.md)
- [SECURITY_TODO.md](/home/ricobrto/PersonalDevelopment/feedback/feedback-app/SECURITY_TODO.md)

## Funcionalidades futuras (roadmap)

### 1) Espaco para armazenar listas de alunos

Objetivo:
- manter cadastro oficial de alunos e turmas dentro do sistema
- evitar depender de arquivos soltos para importar nomes

Sugestoes:
- criar entidade `students` (id, nome completo, email opcional, status)
- criar entidade `classes`/`lists` (id, nome, periodo, observacoes)
- criar relacao `student_lists` para vincular aluno em varias listas
- adicionar tela administrativa para importar CSV e revisar duplicidades

### 2) Verificacao de similaridade (apoio contra plagio)

Objetivo:
- identificar respostas muito parecidas entre alunos da mesma lista
- apoiar revisao manual, sem bloqueio automatico

Sugestoes:
- calcular similaridade textual em `summary`, `note` e trechos de codigo
- gerar score por par de alunos e por questao (0-100)
- criar ranking de pares suspeitos com evidencias (linhas e trechos)
- definir limiar configuravel (ex.: alerta acima de 85)
- manter status da revisao (`pendente`, `confirmado`, `descartado`)

### 3) Corretor automatico de listas

Objetivo:
- reduzir tempo de correcao manual e padronizar criterios
- entregar pre-nota e feedback inicial para revisao final do professor

Sugestoes:
- criar rubric por questao com pesos e criterios objetivos
- executar testes automatizados por questao quando houver codigo executavel
- gerar nota preliminar por questao + justificativa curta
- permitir override manual do professor antes de publicar ao aluno
- registrar historico de ajustes para auditoria

### Ordem recomendada de implementacao

1. cadastro estruturado de alunos/listas
2. corretor automatico com revisao humana obrigatoria
3. modulo de similaridade com fluxo de investigacao

### Ideias para pensar novamente depois (opcional)

Esses itens podem ser muito bons, mas valem uma decisao futura de produto antes de implementar:

- workflow de publicacao (`rascunho -> revisado -> publicado`)
- versionamento de feedbacks (historico de alteracoes por aluno)
- area de insights por turma ao longo das listas
- grupos automaticos de reforco por tipo de erro
- agendamento de liberacao de feedback
- exportacao PDF/CSV e integracao com LMS
- notificacoes automaticas quando feedback for publicado

Perguntas de decisao para cada item:
- isso resolve um problema recorrente hoje?
- isso reduz tempo operacional real por semana?
- isso aumenta risco de suporte/manutencao?
