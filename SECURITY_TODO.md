# Security TODO

## Concluido nesta etapa

- proteger `/api/analytics/*` com chave simples de professor via `ANALYTICS_ACCESS_KEY`
- remover `token` da resposta agregada de analytics
- trocar a abertura de aluno na analise para lookup autenticado no backend
- adicionar rate limit basico nas rotas de feedback
- enviar `Cache-Control: no-store` nas rotas da API

## Proxima prioridade

- definir `CORS_ORIGIN` explicito no deploy e parar de usar `*`
- adicionar chave de professor no ambiente de producao
- testar analytics com chave invalida, ausente e valida
- testar retorno `429` nas rotas de feedback

## Melhorias futuras

- login real de professor em vez de chave compartilhada
- expiracao e rotacao de links de aluno
- logs de acesso na analise
- auditoria de tentativa de acesso indevido
- protecao adicional contra enumeracao de tokens
