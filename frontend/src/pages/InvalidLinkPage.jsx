import { Link } from "react-router-dom";

export default function InvalidLinkPage({
  title = "Feedback nao encontrado",
  description = "Esse link pode estar incompleto, expirado ou ter sido informado com algum caractere incorreto.",
  showRetryLink = false,
}) {
  return (
    <main className="feedback-shell invalid-shell" aria-live="polite">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <section className="status-panel" role="status" aria-labelledby="invalid-title">
        <span className="status-kicker">Link invalido</span>
        <h1 id="invalid-title">{title}</h1>
        <p>{description}</p>
        {showRetryLink ? (
          <Link className="ghost-button" to="." reloadDocument>
            Tentar novamente
          </Link>
        ) : null}
      </section>
    </main>
  );
}
