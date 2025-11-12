import { apiFetch } from "../api/apiFetch";
const API_URL = "http://localhost:5000/LoginERegistro";

export async function getUserProfile() {
  const result = await apiFetch(`${API_URL}/perfil`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return result;
}
