export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
      console.warn("Sessão inválida ou usuário suspenso. Deslogando...");
      localStorage.clear();
      alert("sua sessão expirou ou seu acesso foi bloqueado. Faça login novamente.");
      window.location.href = "/";
      return;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensagem || "erro na requisição");
    }

    return await response.json();
  } catch (err) {
    console.error("erro no apiFetch:", err);
    throw err;
  }
}
