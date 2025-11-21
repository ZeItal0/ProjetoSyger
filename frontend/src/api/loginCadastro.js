const API_URL = "http://localhost:5000/LoginERegistro";

export async function login(usuario, senha) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, senha }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "erro ao fazer login");
  localStorage.setItem("token", result.token);
  localStorage.setItem("id", result.user.id);
  localStorage.setItem("nome_usuario", result.user.nome);
  localStorage.setItem("nivel_acesso", result.user.nivel_acesso);

  return result;
}


export async function register(data) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erro ao registrar");

  return result;
}
