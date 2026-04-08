export function sanitizeFeedback(feedback) {
  const { token, ...publicFeedback } = feedback;
  return publicFeedback;
}
