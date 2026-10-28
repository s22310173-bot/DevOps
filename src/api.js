const request = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (response.status === 204) return null;

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error || "Permintaan gagal");
  }

  return body;
};

export const api = {
  list: (entity) => request(`/${entity}`),
  create: (entity, data) =>
    request(`/${entity}`, { method: "POST", body: JSON.stringify(data) }),
  update: (entity, id, data) =>
    request(`/${entity}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (entity, id) => request(`/${entity}/${id}`, { method: "DELETE" }),
  summary: (month) => request(`/summary?month=${month}`),
  getSettings: () => request("/settings"),
  updateSettings: (data) =>
    request("/settings", { method: "PUT", body: JSON.stringify(data) }),
};
