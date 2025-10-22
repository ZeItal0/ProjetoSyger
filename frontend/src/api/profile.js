const API_URL = "http://localhost:5000/LoginERegistro";

export async function getUserProfile() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/perfil`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erro ao carregar perfil");
  return result;
}

