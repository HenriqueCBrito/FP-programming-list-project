# JSON Rules

## Regra principal

O arquivo [feedbacks.json](/home/ricobrto/PersonalDevelopment/feedback/feedback-app/backend/src/data/feedbacks.json) deve conter apenas registros reais de alunos.

Nao manter exemplos ficticios no JSON porque eles:

- poluem a analise de questoes
- aparecem como se fossem alunos reais
- atrapalham o uso do dropdown por lista

## Regra de token por aluno

Cada aluno deve ter um token fixo.

Esse mesmo token deve ser reutilizado quando um novo feedback da mesma pessoa for cadastrado em outra lista.

Exemplo:

```json
[
  {
    "listId": "1",
    "token": "Ab3xK9Lm2Qa7",
    "name": "ALUNO EXEMPLO",
    "score": 81,
    "theme": "high_pink",
    "overall": "Resumo geral",
    "closing": "Mensagem final",
    "questions": []
  },
  {
    "listId": "2",
    "token": "Ab3xK9Lm2Qa7",
    "name": "ALUNO EXEMPLO",
    "score": 74,
    "theme": "mid_hope",
    "overall": "Resumo geral da lista 2",
    "closing": "Mensagem final da lista 2",
    "questions": []
  }
]
```

## Regra de lista

Cada novo feedback entra como um novo objeto no array.

Ou seja:

- mesmo aluno em outra lista = novo objeto
- mesmo token = sim
- novo `listId` = sim

## Regra de nome

O campo `name` deve usar o nome exato do aluno, igual ao cadastro real.

Evitar:

- apelido no lugar do nome
- variacoes de caixa sem necessidade
- nomes abreviados diferentes entre listas

## Regra operacional

Ao receber um novo feedback:

1. localizar o aluno
2. reutilizar o token ja existente desse aluno, se ele ja estiver no JSON
3. criar um novo objeto com o novo `listId`
4. nunca criar um segundo token para a mesma pessoa sem necessidade

## Estado atual

Hoje o JSON foi limpo para manter apenas o registro real ja cadastrado.
