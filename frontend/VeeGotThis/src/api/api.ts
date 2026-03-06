export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:8000${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}