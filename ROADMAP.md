# Roadmap

Este documento guarda ideias de evolucao para evitar sobrecarregar o `README.md`.

## Funcionalidades futuras

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

## Ordem recomendada

1. cadastro estruturado de alunos/listas
2. corretor automatico com revisao humana obrigatoria
3. modulo de similaridade com fluxo de investigacao

## Ideias opcionais (revisar depois)

- workflow de publicacao (`rascunho -> revisado -> publicado`)
- versionamento de feedbacks (historico de alteracoes por aluno)
- area de insights por turma ao longo das listas
- grupos automaticos de reforco por tipo de erro
- agendamento de liberacao de feedback
- exportacao PDF/CSV e integracao com LMS
- notificacoes automaticas quando feedback for publicado

Perguntas para decisao:
- isso resolve um problema recorrente hoje?
- isso reduz tempo operacional real por semana?
- isso aumenta risco de suporte/manutencao?
