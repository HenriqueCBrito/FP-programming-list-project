# Template Para Preencher Os Feedbacks

Quando chegar a etapa de cadastrar os alunos reais, envie os dados neste formato para cada aluno:

```text
Aluno:
Nome exato:
ListId:
Token:
Se o aluno ja existir em outra lista, reutilizar exatamente o mesmo token.
Nota final:
Tema:
Feedback geral:
Mensagem final:

Questoes:
1. Nota:
   Resumo:
   Trecho de codigo:
   Observacao:

2. Nota:
   Resumo:
   Trecho de codigo:
   Observacao:
```

## Campos obrigatorios por aluno

- `name`
- `listId`
- `token`
- `score`
- `theme`
- `overall`
- `closing`
- `questions`

## Campos obrigatorios por questao

- `number`
- `score`
- `summary`
- `errorLine`
- `note`

## Regras para os tokens

- usar entre 12 e 20 caracteres
- misturar letras maiusculas, minusculas e numeros
- nao usar nome do aluno no token
- manter um token unico por aluno
- reutilizar o mesmo token quando o mesmo aluno aparecer em outra lista
