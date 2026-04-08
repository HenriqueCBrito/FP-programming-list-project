import assert from "node:assert/strict";
import test from "node:test";

import {
  findStudentLinkForAnalytics,
  getQuestionAnalytics,
} from "../src/services/analyticsService.js";
import {
  findAvailableListsByToken,
  findFeedbackByLink,
} from "../src/services/feedbackService.js";
import { getTopStudentsRanking } from "../src/services/rankingService.js";
import {
  getAnalyticsAccessKey,
  getCorsOrigins,
  getHost,
  getPort,
} from "../src/utils/config.js";
import { validateFeedbackRecord } from "../src/utils/validateFeedback.js";

test("findFeedbackByLink returns only the public feedback payload", async () => {
  const payload = await findFeedbackByLink("1", "9xK2mPq7RaN4");

  assert.equal(payload.listId, "1");
  assert.equal(payload.name, "MARIA FERNANDA BASTOS DE CARVALHO");
  assert.equal(payload.theme, "mid_garden");
  assert.equal(payload.token, undefined);
  assert.ok(Array.isArray(payload.questions));
  assert.equal(payload.questions.length, 10);
});

test("findFeedbackByLink returns null for an invalid link", async () => {
  const payload = await findFeedbackByLink("1", "invalid-token");

  assert.equal(payload, null);
});

test("findAvailableListsByToken returns the list ids available for the same token", async () => {
  const payload = await findAvailableListsByToken("9xK2mPq7RaN4");

  assert.deepEqual(payload, {
    availableListIds: ["1"],
  });
});

test("getQuestionAnalytics ranks the questions by lower average score first", async () => {
  const payload = await getQuestionAnalytics("1");

  assert.equal(payload.listId, "1");
  assert.deepEqual(payload.availableListIds, ["1"]);
  assert.equal(payload.studentCount, 25);
  assert.equal(payload.students.length, 25);
  assert.equal(payload.students[0].listId, "1");
  assert.equal("token" in payload.students[0], false);
  assert.equal(payload.questionCount, 10);
  assert.equal(payload.questions[0].number, 3);
  assert.equal(payload.questions[0].averageAccuracy, 52.8);
  assert.equal(payload.questions[0].incorrectCount, 17);
  assert.equal(payload.questions[0].totalLostPoints, 118);
  assert.equal(payload.questions[1].number, 9);
  assert.equal(payload.questions[1].averageAccuracy, 67.2);
  assert.equal(payload.questions[2].number, 4);
  assert.equal(payload.questions[2].averageAccuracy, 78);
});

test("findStudentLinkForAnalytics resolves a student link from teacher-only lookup", async () => {
  const payload = await findStudentLinkForAnalytics(
    "1",
    "MARIA FERNANDA BASTOS DE CARVALHO",
  );

  assert.deepEqual(payload, {
    listId: "1",
    token: "9xK2mPq7RaN4",
  });
});

test("getTopStudentsRanking uses competition ranking for ties", async () => {
  const payload = await getTopStudentsRanking("1", 10);

  assert.equal(payload.listId, "1");
  assert.equal(payload.topCount, 10);
  assert.equal(payload.ranking.length, 10);
  assert.equal(payload.ranking[0].place, 1);
  assert.equal(payload.ranking[1].place, 1);

  const firstScore = payload.ranking[0].score;
  const tieGroupSize = payload.ranking.filter(
    (entry) => entry.score === firstScore,
  ).length;
  const firstDifferentIndex = payload.ranking.findIndex(
    (entry) => entry.score !== firstScore,
  );

  if (firstDifferentIndex !== -1) {
    assert.equal(payload.ranking[firstDifferentIndex].place, tieGroupSize + 1);
  }
});

test("validateFeedbackRecord rejects malformed feedback objects", () => {
  const valid = validateFeedbackRecord({
    listId: "1",
    token: "R2aM7nZ5XpK1",
    name: "Aluno Teste",
    score: 70,
    theme: "mid_hope",
    overall: "Resumo geral",
    closing: "Mensagem final",
    questions: [
      {
        number: 1,
        score: "7/10",
        summary: "Resumo",
        errorLine: "print('oi')",
        note: "# comentario",
      },
    ],
  });

  const invalid = validateFeedbackRecord({
    listId: "1",
    token: "R2aM7nZ5XpK1",
    name: "Aluno Teste",
    score: 70,
    theme: "mid_hope",
    overall: "Resumo geral",
    closing: "Mensagem final",
    questions: [
      {
        number: "1",
        score: "7/10",
        summary: "Resumo",
        errorLine: "print('oi')",
        note: "# comentario",
      },
    ],
  });

  assert.equal(valid, true);
  assert.equal(invalid, false);
});

test("config helpers normalize backend environment variables", () => {
  const previousPort = process.env.PORT;
  const previousHost = process.env.HOST;
  const previousCorsOrigin = process.env.CORS_ORIGIN;
  const previousAnalyticsAccessKey = process.env.ANALYTICS_ACCESS_KEY;

  process.env.PORT = "4010";
  process.env.HOST = "127.0.0.1";
  process.env.CORS_ORIGIN = "https://frontend.example, https://preview.example";
  process.env.ANALYTICS_ACCESS_KEY = "teacher-secret";

  assert.equal(getPort(), 4010);
  assert.equal(getHost(), "127.0.0.1");
  assert.equal(getAnalyticsAccessKey(), "teacher-secret");
  assert.deepEqual(getCorsOrigins(), [
    "https://frontend.example",
    "https://preview.example",
  ]);

  restoreEnv("PORT", previousPort);
  restoreEnv("HOST", previousHost);
  restoreEnv("CORS_ORIGIN", previousCorsOrigin);
  restoreEnv("ANALYTICS_ACCESS_KEY", previousAnalyticsAccessKey);
});

function restoreEnv(key, value) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
