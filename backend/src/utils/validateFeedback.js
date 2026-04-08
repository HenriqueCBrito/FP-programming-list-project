function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidQuestion(question) {
  return (
    question &&
    Number.isInteger(question.number) &&
    isNonEmptyString(question.score) &&
    isNonEmptyString(question.summary) &&
    isNonEmptyString(question.errorLine) &&
    isNonEmptyString(question.note)
  );
}

export function validateFeedbackRecord(feedback) {
  const hasBaseShape =
    feedback &&
    isNonEmptyString(feedback.listId) &&
    isNonEmptyString(feedback.token) &&
    isNonEmptyString(feedback.name) &&
    typeof feedback.score === "number" &&
    isNonEmptyString(feedback.theme) &&
    isNonEmptyString(feedback.overall) &&
    isNonEmptyString(feedback.closing) &&
    Array.isArray(feedback.questions);

  if (!hasBaseShape) {
    return false;
  }

  return feedback.questions.every(isValidQuestion);
}
