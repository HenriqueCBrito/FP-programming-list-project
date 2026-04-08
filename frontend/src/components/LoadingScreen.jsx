export default function LoadingScreen() {
  return (
    <main className="feedback-shell loading-shell" aria-live="polite" aria-busy="true">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <section className="status-panel" role="status" aria-label="Carregando feedback">
        <span className="status-kicker">Preparando seu feedback</span>
        <h1>Buscando os dados da sua lista.</h1>
        <p>
          Aguarde um instante enquanto carregamos seu resultado individual com
          seguranca.
        </p>
        <div className="loading-bar" aria-hidden="true">
          <span />
        </div>
        <p className="loading-caption">Isso costuma levar apenas alguns segundos.</p>
      </section>
    </main>
  );
}
