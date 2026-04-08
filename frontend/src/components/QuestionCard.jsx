export default function QuestionCard({ question }) {
  return (
    <article className="question-card panel" aria-labelledby={`question-${question.number}`}>
      <div className="question-header">
        <div>
          <p className="eyebrow" id={`question-${question.number}`}>
            Questao {question.number}
          </p>
          <h2>{question.score}</h2>
        </div>
      </div>

      <p className="question-summary">{question.summary}</p>

      <div className="code-block">
        <span className="code-label">Trecho observado</span>
        <pre tabIndex={0} aria-label={`Trecho observado da questao ${question.number}`}>
          <code>{question.errorLine}</code>
        </pre>
      </div>

      <div className="code-block note-block">
        <span className="code-label">Comentario</span>
        <pre tabIndex={0} aria-label={`Comentario da questao ${question.number}`}>
          <code>{question.note}</code>
        </pre>
      </div>
    </article>
  );
}
