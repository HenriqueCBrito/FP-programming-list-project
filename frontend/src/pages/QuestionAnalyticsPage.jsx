import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen.jsx";
import InvalidLinkPage from "./InvalidLinkPage.jsx";
import {
  fetchAvailableStudentLists,
  fetchFeedback,
  fetchQuestionAnalytics,
  fetchStudentLinkForAnalytics,
} from "../services/feedbackApi.js";

export default function QuestionAnalyticsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialListId = searchParams.get("listId") || "";
  const cachedAnalytics = getInitialAnalytics(location.state, initialListId);
  const [analyticsAccessKey, setAnalyticsAccessKey] = useState(() =>
    window.sessionStorage.getItem("analyticsAccessKey") || "",
  );
  const [accessKeyInput, setAccessKeyInput] = useState(() =>
    window.sessionStorage.getItem("analyticsAccessKey") || "",
  );
  const [selectedListId, setSelectedListId] = useState(initialListId);
  const [selectedStudentKey, setSelectedStudentKey] = useState("");
  const [analytics, setAnalytics] = useState(cachedAnalytics);
  const [status, setStatus] = useState(cachedAnalytics ? "success" : "loading");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadAnalytics() {
      const hasCachedAnalytics = analytics !== null;

      if (hasCachedAnalytics) {
        setIsRefreshing(true);
      } else {
        setStatus("loading");
      }

      setError(null);

      try {
        const payload = await fetchQuestionAnalytics(selectedListId, {
          signal: controller.signal,
          headers: buildAnalyticsHeaders(analyticsAccessKey),
        });

        if (!isActive) {
          return;
        }

        setAnalytics(payload);
        writeAnalyticsCache(payload);
        setStatus("success");
        setIsRefreshing(false);
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setError(requestError);
        setIsRefreshing(false);
        setStatus("error");
      }
    }

    loadAnalytics();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [analyticsAccessKey, selectedListId]);

  useEffect(() => {
    setSelectedStudentKey("");
  }, [selectedListId]);

  useEffect(() => {
    if (selectedListId) {
      setSearchParams({ listId: selectedListId }, { replace: true });
      return;
    }

    setSearchParams({}, { replace: true });
  }, [selectedListId, setSearchParams]);

  useEffect(() => {
    if (status === "loading") {
      document.title = "Analise de questoes";
      return;
    }

    if (status === "error") {
      document.title = "Erro na analise";
      return;
    }

    document.title = analytics?.listId
      ? `Analise da lista ${analytics.listId}`
      : "Analise geral das questoes";
  }, [analytics, status]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "error") {
    if (error?.status === 401 || error?.status === 503) {
      return (
        <main className="feedback-shell analytics-shell" aria-busy="false">
          <div className="aurora aurora-one" />
          <div className="aurora aurora-two" />

          <div className="page-content">
            <section className="panel analytics-hero" aria-labelledby="analytics-title">
              <div className="analytics-copy">
                <p className="eyebrow">Acesso restrito</p>
                <h1 id="analytics-title">Entre com a chave do professor.</h1>
                <p className="analytics-lead">
                  Esse painel agora exige uma chave simples para evitar acesso
                  indevido aos dados da turma.
                </p>
              </div>

              <form className="analytics-form" onSubmit={handleAccessSubmit}>
                <label className="analytics-label" htmlFor="analyticsAccessKey">
                  Chave de acesso
                </label>
                <div className="analytics-form-row">
                  <input
                    id="analyticsAccessKey"
                    name="analyticsAccessKey"
                    type="password"
                    value={accessKeyInput}
                    onChange={(event) => setAccessKeyInput(event.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <div className="analytics-form-row">
                  <button type="submit">Entrar</button>
                  {analyticsAccessKey ? (
                    <button type="button" onClick={handleAccessReset}>
                      Limpar chave
                    </button>
                  ) : null}
                </div>
              </form>
            </section>
          </div>
        </main>
      );
    }

    return (
      <InvalidLinkPage
        title="Nao foi possivel carregar a analise"
        description={error?.message || "Tente novamente em alguns instantes."}
        showRetryLink
      />
    );
  }

  const hasQuestions = analytics.questions.length > 0;

  function handleStudentChange(event) {
    const nextStudentKey = event.target.value;

    setSelectedStudentKey(nextStudentKey);

    if (!nextStudentKey) {
      return;
    }

    const selectedStudent = analytics.students.find(
      (student) => buildStudentKey(student) === nextStudentKey,
    );

    if (!selectedStudent) {
      return;
    }

    openStudentFeedback(selectedStudent);
  }

  async function openStudentFeedback(student) {
    try {
      const resolvedLink = await fetchStudentLinkForAnalytics(
        student.listId,
        student.name,
        {
          headers: buildAnalyticsHeaders(analyticsAccessKey),
        },
      );
      const [prefetchedFeedback, prefetchedAvailableLists] = await Promise.all([
        fetchFeedback(resolvedLink.listId, resolvedLink.token),
        fetchAvailableStudentLists(resolvedLink.token),
      ]);

      const returnTo = selectedListId
        ? `/analise/questoes?listId=${selectedListId}`
        : "/analise/questoes";

      navigate(`/lista/${resolvedLink.listId}/${resolvedLink.token}`, {
        state: {
          fromAnalytics: true,
          returnTo,
          prefetchedAnalytics: analytics,
          prefetchedStudentView: {
            token: resolvedLink.token,
            listId: resolvedLink.listId,
            feedback: prefetchedFeedback,
            availableListIds: prefetchedAvailableLists.availableListIds,
          },
        },
      });
    } catch (requestError) {
      setError(requestError);
      setStatus("error");
    }
  }

  function handleAccessSubmit(event) {
    event.preventDefault();

    const normalizedKey = accessKeyInput.trim();

    window.sessionStorage.setItem("analyticsAccessKey", normalizedKey);
    setAnalyticsAccessKey(normalizedKey);
    setStatus("loading");
    setError(null);
  }

  function handleAccessReset() {
    window.sessionStorage.removeItem("analyticsAccessKey");
    setAccessKeyInput("");
    setAnalyticsAccessKey("");
    setStatus("loading");
    setError(null);
  }

  return (
    <main className="feedback-shell analytics-shell" aria-busy={isRefreshing}>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <div className="page-content">
        <section className="panel analytics-hero" aria-labelledby="analytics-title">
          <div className="analytics-copy">
            <p className="eyebrow">Analise agregada</p>
            <h1 id="analytics-title">Quais questoes tiveram a menor media.</h1>
            <p className="analytics-lead">
              Esse painel resume apenas os alunos que ja possuem detalhamento de
              questoes no JSON. O ranking considera primeiro a menor media da
              questao e usa perda total de pontos como desempate.
            </p>
            {isRefreshing ? (
              <p className="analytics-refresh-indicator" aria-live="polite">
                Atualizando filtro...
              </p>
            ) : null}
          </div>

          <div className="analytics-form">
            <label className="analytics-label" htmlFor="listId">
              Trocar de lista
            </label>
            <div className="analytics-form-row">
              <select
                id="listId"
                name="listId"
                value={selectedListId}
                onChange={(event) => setSelectedListId(event.target.value)}
              >
                <option value="">Todas as listas</option>
                {analytics.availableListIds.map((listId) => (
                  <option key={listId} value={listId}>
                    Lista {listId}
                  </option>
                ))}
              </select>
            </div>

            <label className="analytics-label" htmlFor="studentId">
              Abrir feedback do aluno
            </label>
            <div className="analytics-form-row">
              <select
                id="studentId"
                name="studentId"
                value={selectedStudentKey}
                onChange={handleStudentChange}
              >
                <option value="">Selecione um aluno</option>
                {analytics.students.map((student) => (
                  <option
                    key={buildStudentKey(student)}
                    value={buildStudentKey(student)}
                  >
                    {formatStudentLabel(student, analytics.listId)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="analytics-summary-grid">
          <article className="panel analytics-stat-card">
            <p className="eyebrow">Escopo</p>
            <strong>{analytics.listId || "Todas as listas"}</strong>
            <span>{analytics.studentCount} alunos com feedback cadastrado</span>
          </article>

          <article className="panel analytics-stat-card">
            <p className="eyebrow">Questoes lidas</p>
            <strong>{analytics.questionCount}</strong>
            <span>questoes com pelo menos uma ocorrencia valida</span>
          </article>
        </section>

        {hasQuestions ? (
          <section className="analytics-board">
            {analytics.questions.map((question, index) => (
              <article className="panel analytics-card" key={question.number}>
                <div className="analytics-card-topline">
                  <span className="hero-badge">#{index + 1} no ranking</span>
                  <span className="analytics-question-label">
                    Questao {question.number}
                  </span>
                </div>

                <h2>
                  {question.averageScore}/{question.averagePossibleScore}
                </h2>

                <div className="analytics-metrics">
                  <div>
                    <span className="analytics-metric-label">Media</span>
                    <strong>{question.averageAccuracy}%</strong>
                  </div>
                  <div>
                    <span className="analytics-metric-label">Alunos com erro</span>
                    <strong>{question.incorrectCount}</strong>
                  </div>
                  <div>
                    <span className="analytics-metric-label">Perda total</span>
                    <strong>{question.totalLostPoints} pts</strong>
                  </div>
                </div>

                <p className="analytics-card-copy">
                  {question.correctCount} alunos fecharam essa questao,{" "}
                  {question.incorrectRate}% erraram e {question.attemptCount}{" "}
                  registros validos entraram nessa conta.
                </p>
              </article>
            ))}
          </section>
        ) : (
          <section className="panel empty-panel" aria-live="polite">
            <p className="eyebrow">Sem dados agregados</p>
            <h2>Nenhuma questao com score valido foi encontrada nesse filtro.</h2>
            <p className="question-summary">
              Cadastre mais feedbacks ou ajuste o filtro de lista para gerar o
              ranking de erros.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

function buildStudentKey(student) {
  return `${student.listId}:${student.name}`;
}

function formatStudentLabel(student, currentListId) {
  if (currentListId) {
    return student.name;
  }

  return `${student.name} - Lista ${student.listId}`;
}

function buildAnalyticsHeaders(accessKey) {
  return accessKey
    ? {
        "x-analytics-key": accessKey,
      }
    : undefined;
}

function getInitialAnalytics(locationState, selectedListId) {
  const analyticsFromState = locationState?.prefetchedAnalytics;

  if (isMatchingAnalyticsCache(analyticsFromState, selectedListId)) {
    return analyticsFromState;
  }

  try {
    const rawCache = window.sessionStorage.getItem(
      buildAnalyticsCacheKey(selectedListId),
    );

    if (!rawCache) {
      return null;
    }

    const parsedCache = JSON.parse(rawCache);
    return isMatchingAnalyticsCache(parsedCache, selectedListId) ? parsedCache : null;
  } catch {
    return null;
  }
}

function writeAnalyticsCache(analytics) {
  try {
    window.sessionStorage.setItem(
      buildAnalyticsCacheKey(analytics.listId || ""),
      JSON.stringify(analytics),
    );
  } catch {
    // Cache is opportunistic and should not break navigation.
  }
}

function buildAnalyticsCacheKey(listId) {
  return `analyticsCache:${listId || "all"}`;
}

function isMatchingAnalyticsCache(analytics, selectedListId) {
  if (!analytics) {
    return false;
  }

  return (analytics.listId || "") === (selectedListId || "");
}
