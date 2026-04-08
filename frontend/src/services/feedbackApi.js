const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

export async function fetchFeedback(listId, token, options = {}) {
  return requestJson(`${apiBaseUrl}/api/feedback/${listId}/${token}`, options);
}

export async function fetchAvailableStudentLists(token, options = {}) {
  return requestJson(`${apiBaseUrl}/api/feedback/token/${token}/lists`, options);
}

export async function fetchQuestionAnalytics(listId, options = {}) {
  const query = new URLSearchParams();

  if (listId) {
    query.set("listId", listId);
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : "";

  return requestJson(`${apiBaseUrl}/api/analytics/questions${suffix}`, options);
}

export async function fetchStudentLinkForAnalytics(listId, name, options = {}) {
  const query = new URLSearchParams({
    listId: String(listId),
    name: String(name),
  });

  return requestJson(
    `${apiBaseUrl}/api/analytics/student-link?${query.toString()}`,
    options,
  );
}

export async function fetchTopStudentsRanking(listId, options = {}) {
  const query = new URLSearchParams();

  if (listId) {
    query.set("listId", listId);
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : "";

  return requestJson(`${apiBaseUrl}/api/ranking/top-students${suffix}`, options);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    signal: options.signal,
    headers: options.headers,
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    const error = new Error(payload?.message || "erro ao carregar dados");
    error.status = response.status;
    throw error;
  }

  return payload;
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
