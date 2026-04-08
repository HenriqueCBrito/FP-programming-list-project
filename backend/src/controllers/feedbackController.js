import {
  findAvailableListsByToken,
  findFeedbackByLink,
} from "../services/feedbackService.js";

export async function getFeedbackByLink(req, res, next) {
  const { listId, token } = req.params;

  try {
    const feedback = await findFeedbackByLink(listId, token);

    if (!feedback) {
      return res.status(404).json({ message: "feedback nao encontrado" });
    }

    return res.json(feedback);
  } catch (error) {
    return next(error);
  }
}

export async function getAvailableListsByToken(req, res, next) {
  const { token } = req.params;

  try {
    const payload = await findAvailableListsByToken(token);

    if (!payload) {
      return res.status(404).json({ message: "feedback nao encontrado" });
    }

    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}
