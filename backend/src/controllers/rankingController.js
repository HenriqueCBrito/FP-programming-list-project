import { getTopStudentsRanking } from "../services/rankingService.js";

export async function getTopStudents(req, res, next) {
  try {
    const ranking = await getTopStudentsRanking(req.query.listId, 10);
    return res.json(ranking);
  } catch (error) {
    return next(error);
  }
}
