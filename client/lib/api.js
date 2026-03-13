const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json();
}

export function getBoards(search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return request(`/boards${query}`);
}

export function createBoard(name) {
  return request("/boards", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function createList(title, boardId) {
  return request("/lists", {
    method: "POST",
    body: JSON.stringify({ title, boardId }),
  });
}

export function deleteList(id) {
  return request(`/lists/${id}`, { method: "DELETE" });
}

export function createCard(title, listId) {
  return request("/cards", {
    method: "POST",
    body: JSON.stringify({ title, listId }),
  });
}

export function updateCard(id, payload) {
  return request(`/cards/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCard(id) {
  return request(`/cards/${id}`, { method: "DELETE" });
}
