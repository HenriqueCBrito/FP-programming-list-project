import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen.jsx";
import PremiumResultCard from "../components/PremiumResultCard.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import {
  fetchAvailableStudentLists,
  fetchFeedback,
} from "../services/feedbackApi.js";
import { getThemeConfig } from "../utils/themeMap.js";
import InvalidLinkPage from "./InvalidLinkPage.jsx";

export default function StudentFeedbackPage() {
  const { listId, token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const cachedStudentView = getInitialStudentView(location.state, listId, token);
  const [feedback, setFeedback] = useState(cachedStudentView?.feedback || null);
  const [availableListIds, setAvailableListIds] = useState(
    cachedStudentView?.availableListIds || [],
  );
  const [status, setStatus] = useState(cachedStudentView ? "success" : "loading");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadFeedback() {
      const hasCachedFeedback = feedback !== null;

      if (hasCachedFeedback) {
        setIsRefreshing(true);
      } else {
        setStatus("loading");
      }

      setError(null);

      try {
        const [feedbackData, availableListsData] = await Promise.all([
          fetchFeedback(listId, token, {
            signal: controller.signal,
          }),
          fetchAvailableStudentLists(token, {
            signal: controller.signal,
          }),
        ]);

        if (!isActive) {
          return;
        }

        setFeedback(feedbackData);
        setAvailableListIds(availableListsData.availableListIds);
        writeStudentViewCache(listId, token, {
          feedback: feedbackData,
          availableListIds: availableListsData.availableListIds,
        });
        setIsRefreshing(false);
        setStatus("success");
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setError(requestError);
        setIsRefreshing(false);
        setStatus("error");
      }
    }

    loadFeedback();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [listId, token]);

  useEffect(() => {
    if (status === "loading") {
      document.title = "Carregando feedback";
      return;
    }

    if (status === "error") {
      document.title = "Feedback nao encontrado";
      return;
    }

    document.title = feedback
      ? `${feedback.name} | Feedback da lista ${feedback.listId}`
      : "Feedback do aluno";
  }, [feedback, status]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "error") {
    if (error?.status === 404) {
      return <InvalidLinkPage />;
    }

    return (
      <InvalidLinkPage
        title="Nao foi possivel carregar seu feedback"
        description="Houve um problema ao acessar o servidor. Tente novamente em alguns instantes."
        showRetryLink
      />
    );
  }

  const theme = getThemeConfig(feedback.theme);
  const hasQuestions = feedback.questions.length > 0;
  const backToAnalytics = Boolean(location.state?.fromAnalytics);
  const analyticsReturnPath =
    location.state?.returnTo && typeof location.state.returnTo === "string"
      ? location.state.returnTo
      : "/analise/questoes";

  function handleListChange(event) {
    const nextListId = event.target.value;

    if (!nextListId || nextListId === listId) {
      return;
    }

    navigate(`/lista/${nextListId}/${token}`, {
      state: location.state,
    });
  }

  return (
    <main className={`feedback-shell ${theme.surface}`} aria-busy={isRefreshing}>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <div className="page-content">
        {backToAnalytics ? (
          <section className="panel analytics-return-panel">
            <p className="eyebrow">Atalho de navegacao</p>
            <button
              type="button"
              className="analytics-return-button"
              onClick={() =>
                navigate(analyticsReturnPath, {
                  state: {
                    prefetchedAnalytics: location.state?.prefetchedAnalytics || null,
                  },
                })
              }
            >
              Voltar para a analise
            </button>
          </section>
        ) : null}

        <PremiumResultCard feedback={feedback} theme={theme} />

        {availableListIds.length > 0 ? (
          <section className="panel student-switcher">
            <div>
              <p className="eyebrow">Trocar de lista</p>
              <h2>Use o mesmo link para navegar entre as listas disponiveis.</h2>
              {isRefreshing ? (
                <p className="analytics-refresh-indicator" aria-live="polite">
                  Atualizando lista...
                </p>
              ) : null}
            </div>

            <div className="student-switcher-control">
              <label htmlFor="student-list-select" className="analytics-label">
                Lista
              </label>
              <select
                id="student-list-select"
                value={listId}
                onChange={handleListChange}
              >
                {availableListIds.map((availableListId) => (
                  <option key={availableListId} value={availableListId}>
                    Lista {availableListId}
                  </option>
                ))}
              </select>
            </div>
          </section>
        ) : null}

        <section className="questions-section">
          <div className="section-heading">
            <p className="eyebrow">Feedback por questao</p>
            <h2>Onde voce foi bem e onde ainda pode ajustar a logica.</h2>
          </div>

          {hasQuestions ? (
            <div className="question-grid">
              {feedback.questions.map((question) => (
                <QuestionCard
                  key={`${feedback.listId}-${question.number}`}
                  question={question}
                />
              ))}
            </div>
          ) : (
            <section className="empty-panel panel" aria-live="polite">
              <p className="eyebrow">Detalhamento em andamento</p>
              <h2>As observacoes por questao ainda nao foram cadastradas.</h2>
              <p className="question-summary">
                O resumo geral ja esta disponivel, e os comentarios por questao
                podem ser adicionados depois sem alterar o link do aluno.
              </p>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

function getInitialStudentView(locationState, listId, token) {
  const prefetchedStudentView = locationState?.prefetchedStudentView;

  if (isMatchingStudentView(prefetchedStudentView, listId, token)) {
    return prefetchedStudentView;
  }

  try {
    const rawCache = window.sessionStorage.getItem(
      buildStudentViewCacheKey(listId, token),
    );

    if (!rawCache) {
      return null;
    }

    const parsedCache = JSON.parse(rawCache);
    return isMatchingStudentView(parsedCache, listId, token) ? parsedCache : null;
  } catch {
    return null;
  }
}

function writeStudentViewCache(listId, token, payload) {
  try {
    window.sessionStorage.setItem(
      buildStudentViewCacheKey(listId, token),
      JSON.stringify({
        listId,
        token,
        feedback: payload.feedback,
        availableListIds: payload.availableListIds,
      }),
    );
  } catch {
    // Cache is opportunistic and should not break navigation.
  }
}

function buildStudentViewCacheKey(listId, token) {
  return `studentViewCache:${listId}:${token}`;
}

function isMatchingStudentView(studentView, listId, token) {
  if (!studentView) {
    return false;
  }

  return studentView.listId === listId && studentView.token === token;
}
