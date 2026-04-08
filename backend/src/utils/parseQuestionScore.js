export function parseQuestionScore(score) {
  const match = /^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(String(score).trim());

  if (!match) {
    return null;
  }

  const earned = Number(match[1]);
  const possible = Number(match[2]);

  if (!Number.isFinite(earned) || !Number.isFinite(possible) || possible <= 0) {
    return null;
  }

  return { earned, possible };
}
