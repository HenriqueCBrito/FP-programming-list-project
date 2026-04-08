import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTopStudentsRanking } from "../services/feedbackApi.js";

export default function HomePage() {
  const [ranking, setRanking] = useState([]);
  const [rankingStatus, setRankingStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadRanking() {
      try {
        const payload = await fetchTopStudentsRanking("1", {
          signal: controller.signal,
        });

        if (!isActive) {
          return;
        }

        setRanking(payload.ranking || []);
        setRankingStatus("success");
      } catch {
        if (!isActive) {
          return;
        }

        setRankingStatus("error");
      }
    }

    loadRanking();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  return (
    <main className="feedback-shell home-shell" aria-labelledby="home-title">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <div className="page-content">
        <section className="panel home-hero">
          <div className="home-copy">
            <span className="status-kicker">Portal de listas</span>
            <h1 id="home-title">Fundamentos de Programacao</h1>
            <p className="home-lead">
              Acompanhe os resultados das listas da disciplina em um unico lugar.
            </p>
            <p className="home-body">
              O feedback individual e liberado somente pelo link exclusivo
              enviado para cada aluno.
            </p>
          </div>

          <div className="home-highlight">
            <p className="eyebrow">Como acessar</p>
            <h2>Use o link enviado para voce.</h2>
            <p>
              Formato esperado: ` /lista/numero-da-lista/seu-token `. Esse
              endereco abre apenas o seu registro.
            </p>
          </div>
        </section>

        <section className="home-grid">
          <article className="panel home-card">
            <p className="eyebrow">Aluno</p>
            <h2>Acesse seu resultado pelo link individual.</h2>
            <p>
              Com o link correto voce visualiza nota, comentarios gerais e
              feedback por questao.
            </p>
          </article>

          <article className="panel home-card">
            <p className="eyebrow">Analise</p>
            <h2>Area restrita para professor e monitor.</h2>
            <p>
              O painel de analise agrupa o desempenho da turma por questao e
              exige chave de acesso.
            </p>
            <Link className="ghost-button" to="/analise/questoes">
              Ir para a analise
            </Link>
          </article>
        </section>

        <aside className="panel ranking-panel" aria-live="polite">
          <div className="ranking-panel-head">
            <p className="eyebrow">Ranking da turma</p>
            <h2>Top 10 por nota</h2>
            <p className="ranking-caption">
              Empates compartilham colocacao. Ex.: dois em 1o lugar, proximo em
              3o.
            </p>
          </div>

          {rankingStatus === "loading" ? (
            <p className="ranking-state">Carregando ranking...</p>
          ) : null}

          {rankingStatus === "error" ? (
            <p className="ranking-state">
              Nao foi possivel carregar o ranking agora.
            </p>
          ) : null}

          {rankingStatus === "success" ? (
            <ol className="ranking-list">
              {ranking.map((entry) => (
                <li key={`${entry.place}-${entry.name}`} className="ranking-row">
                  <span className="ranking-place">{entry.place}o</span>
                  <span className="ranking-name">{entry.name}</span>
                  <strong className="ranking-score">{entry.score}</strong>
                </li>
              ))}
            </ol>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
