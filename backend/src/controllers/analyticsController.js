import {
  findStudentLinkForAnalytics,
  getQuestionAnalytics,
} from "../services/analyticsService.js";

export async function getQuestionAnalyticsSummary(req, res, next) {
  try {
    const analytics = await getQuestionAnalytics(req.query.listId);
    return res.json(analytics);
  } catch (error) {
    return next(error);
  }
}

export async function getStudentLinkForAnalytics(req, res, next) {
  try {
    const payload = await findStudentLinkForAnalytics(
      req.query.listId,
      req.query.name,
    );

    if (!payload) {
      return res.status(404).json({ message: "feedback nao encontrado" });
    }

    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}
