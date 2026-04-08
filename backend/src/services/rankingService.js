import { loadFeedbacks } from "../utils/loadFeedbacks.js";
import { validateFeedbackRecord } from "../utils/validateFeedback.js";

export async function getTopStudentsRanking(listId, limit = 10) {
  const feedbacks = await loadFeedbacks();
  const normalizedListId = normalizeListId(listId);

  const filtered = feedbacks.filter((feedback) => {
    if (normalizedListId === null) {
      return true;
    }

    return feedback.listId === normalizedListId;
  });

  for (const feedback of filtered) {
    if (!validateFeedbackRecord(feedback)) {
      const error = new Error("Registro de feedback invalido");
      error.statusCode = 500;
      error.publicMessage = "erro interno ao gerar ranking";
      throw error;
    }
  }

  const sorted = filtered
    .map((feedback) => ({
      name: feedback.name,
      listId: feedback.listId,
      score: feedback.score,
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.name.localeCompare(right.name, "pt-BR");
    });

  const limited = sorted.slice(0, Math.max(1, limit));
  const ranked = applyCompetitionRanking(limited);

  return {
    listId: normalizedListId,
    studentCount: filtered.length,
    topCount: ranked.length,
    ranking: ranked,
  };
}

function normalizeListId(listId) {
  if (listId === undefined || listId === null || String(listId).trim() === "") {
    return null;
  }

  return String(listId).trim();
}

function applyCompetitionRanking(rows) {
  let previousScore = null;
  let currentRank = 0;

  return rows.map((row, index) => {
    const absolutePosition = index + 1;

    if (previousScore === null || row.score !== previousScore) {
      currentRank = absolutePosition;
      previousScore = row.score;
    }

    return {
      place: currentRank,
      name: row.name,
      listId: row.listId,
      score: row.score,
    };
  });
}
