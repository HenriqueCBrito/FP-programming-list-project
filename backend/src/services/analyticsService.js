import { loadFeedbacks } from "../utils/loadFeedbacks.js";
import { parseQuestionScore } from "../utils/parseQuestionScore.js";
import { validateFeedbackRecord } from "../utils/validateFeedback.js";

export async function getQuestionAnalytics(listId) {
  const feedbacks = await loadFeedbacks();
  const normalizedListId = normalizeListId(listId);
  const availableListIds = Array.from(
    new Set(feedbacks.map((feedback) => feedback.listId)),
  ).sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (normalizedListId === null) {
      return true;
    }

    return feedback.listId === normalizedListId;
  });

  const students = filteredFeedbacks
    .map((feedback) => ({
      name: feedback.name,
      listId: feedback.listId,
    }))
    .sort((left, right) => {
      const nameComparison = left.name.localeCompare(right.name, "pt-BR");

      if (nameComparison !== 0) {
        return nameComparison;
      }

      return left.listId.localeCompare(right.listId, undefined, { numeric: true });
    });

  const statsByQuestion = new Map();

  for (const feedback of filteredFeedbacks) {
    if (!validateFeedbackRecord(feedback)) {
      const error = new Error("Registro de feedback invalido");
      error.statusCode = 500;
      error.publicMessage = "erro interno ao gerar analise";
      throw error;
    }

    for (const question of feedback.questions) {
      const parsedScore = parseQuestionScore(question.score);

      if (!parsedScore) {
        continue;
      }

      const stat = getOrCreateQuestionStat(statsByQuestion, question.number);
      const lostPoints = Math.max(parsedScore.possible - parsedScore.earned, 0);
      const isIncorrect = lostPoints > 0;

      stat.attemptCount += 1;
      stat.totalEarnedPoints += parsedScore.earned;
      stat.totalPossiblePoints += parsedScore.possible;
      stat.totalLostPoints += lostPoints;

      if (isIncorrect) {
        stat.incorrectCount += 1;
      } else {
        stat.correctCount += 1;
      }
    }
  }

  const questions = Array.from(statsByQuestion.values())
    .map((stat) => {
      const averageScore = stat.totalEarnedPoints / stat.attemptCount;
      const averagePossibleScore = stat.totalPossiblePoints / stat.attemptCount;
      const averageAccuracy = stat.totalEarnedPoints / stat.totalPossiblePoints;

      return {
        number: stat.number,
        attemptCount: stat.attemptCount,
        incorrectCount: stat.incorrectCount,
        correctCount: stat.correctCount,
        incorrectRate: roundPercentage(stat.incorrectCount / stat.attemptCount),
        averageScore: roundNumber(averageScore),
        averagePossibleScore: roundNumber(averagePossibleScore),
        averageAccuracy: roundPercentage(averageAccuracy),
        totalLostPoints: roundNumber(stat.totalLostPoints),
      };
    })
    .sort((left, right) => {
      if (left.averageAccuracy !== right.averageAccuracy) {
        return left.averageAccuracy - right.averageAccuracy;
      }

      if (right.totalLostPoints !== left.totalLostPoints) {
        return right.totalLostPoints - left.totalLostPoints;
      }

      if (right.incorrectCount !== left.incorrectCount) {
        return right.incorrectCount - left.incorrectCount;
      }

      return left.number - right.number;
    });

  return {
    listId: normalizedListId,
    availableListIds,
    students,
    studentCount: filteredFeedbacks.length,
    questionCount: questions.length,
    questions,
  };
}

export async function findStudentLinkForAnalytics(listId, studentName) {
  const feedbacks = await loadFeedbacks();
  const normalizedListId = normalizeListId(listId);
  const normalizedStudentName = normalizeStudentName(studentName);

  if (!normalizedListId || !normalizedStudentName) {
    return null;
  }

  const feedback = feedbacks.find(
    (item) =>
      item.listId === normalizedListId && item.name === normalizedStudentName,
  );

  if (!feedback) {
    return null;
  }

  if (!validateFeedbackRecord(feedback)) {
    const error = new Error("Registro de feedback invalido");
    error.statusCode = 500;
    error.publicMessage = "erro interno ao gerar analise";
    throw error;
  }

  return {
    listId: feedback.listId,
    token: feedback.token,
  };
}

function normalizeListId(listId) {
  if (listId === undefined || listId === null || String(listId).trim() === "") {
    return null;
  }

  return String(listId).trim();
}

function normalizeStudentName(studentName) {
  if (
    studentName === undefined ||
    studentName === null ||
    String(studentName).trim() === ""
  ) {
    return null;
  }

  return String(studentName).trim();
}

function getOrCreateQuestionStat(statsByQuestion, questionNumber) {
  if (!statsByQuestion.has(questionNumber)) {
    statsByQuestion.set(questionNumber, {
      number: questionNumber,
      attemptCount: 0,
      incorrectCount: 0,
      correctCount: 0,
      totalEarnedPoints: 0,
      totalPossiblePoints: 0,
      totalLostPoints: 0,
    });
  }

  return statsByQuestion.get(questionNumber);
}

function roundNumber(value) {
  return Math.round(value * 100) / 100;
}

function roundPercentage(value) {
  return Math.round(value * 10000) / 100;
}
