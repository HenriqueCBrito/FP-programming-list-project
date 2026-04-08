import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const feedbacksFilePath = path.resolve(__dirname, "../data/feedbacks.json");

export async function loadFeedbacks() {
  try {
    const rawFile = await readFile(feedbacksFilePath, "utf-8");
    const parsed = JSON.parse(rawFile);

    if (!Array.isArray(parsed)) {
      throw createAppError(
        500,
        "feedbacks.json precisa ser um array",
        "erro interno ao buscar feedback",
      );
    }

    return parsed;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw createAppError(
        500,
        "Arquivo feedbacks.json nao encontrado",
        "erro interno ao buscar feedback",
      );
    }

    if (error instanceof SyntaxError) {
      throw createAppError(
        500,
        "feedbacks.json contem JSON invalido",
        "erro interno ao buscar feedback",
      );
    }

    throw error;
  }
}

function createAppError(statusCode, message, publicMessage) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.publicMessage = publicMessage;
  return error;
}
