export default function PremiumResultCard({ feedback, theme }) {
  return (
    <section className="hero-card panel" aria-labelledby="feedback-title">
      <div className="hero-topline">
        <span className="hero-badge">{theme.badge}</span>
        <span className="hero-icon" aria-hidden="true">
          {theme.icon}
        </span>
      </div>

      <div className="hero-grid">
        <div>
          <p className="eyebrow">Feedback individual</p>
          <h1 id="feedback-title">{feedback.name}</h1>
          <p className="hero-message">{theme.message}</p>
        </div>

        <div className="score-block">
          <span className="score-label">Nota final</span>
          <strong>{feedback.score}</strong>
          <span className="score-caption">desempenho geral na lista {feedback.listId}</span>
        </div>
      </div>

      <div className="hero-copy">
        <p>{feedback.overall}</p>
        <p>{feedback.closing}</p>
      </div>
    </section>
  );
}
