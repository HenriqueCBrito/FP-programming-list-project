import { loadFeedbacks } from "../utils/loadFeedbacks.js";
import { sanitizeFeedback } from "../utils/sanitizeFeedback.js";
import { validateFeedbackRecord } from "../utils/validateFeedback.js";

export async function findFeedbackByLink(listId, token) {
  const feedbacks = await loadFeedbacks();

  const feedback = feedbacks.find(
    (item) => item.listId === String(listId) && item.token === String(token),
  );

  if (!feedback) {
    return null;
  }

  if (!validateFeedbackRecord(feedback)) {
    const error = new Error("Registro de feedback invalido");
    error.statusCode = 500;
    error.publicMessage = "erro interno ao buscar feedback";
    throw error;
  }

  return sanitizeFeedback(feedback);
}

export async function findAvailableListsByToken(token) {
  const feedbacks = await loadFeedbacks();
  const normalizedToken = String(token);

  const availableListIds = Array.from(
    new Set(
      feedbacks
        .filter((feedback) => feedback.token === normalizedToken)
        .map((feedback) => feedback.listId),
    ),
  ).sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

  if (availableListIds.length === 0) {
    return null;
  }

  return {
    availableListIds,
  };
}
