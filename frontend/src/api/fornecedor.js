import { useState } from "react";

export function useFornecedor() {
  const [formData, setFormData] = useState({ nome_empresa: "", cnpj: "", inscricao_estadual: "", nome_contato: "", telefone: "", email: "", cep: "", rua: "", numero: "", bairro: "", observacoes: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/cadastro/Fornecedor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setFormData({ nome_empresa: "", cnpj: "", inscricao_estadual: "", nome_contato: "", telefone: "", email: "", cep: "", rua: "", numero: "", bairro: "", observacoes: "" });
      } else if (response.status === 400 && Array.isArray(data.message)) {
        alert(data.message.join("\n"));
      } else {
        alert(data.message || "erro ao registrar fornecedor");
      }

    } catch (err) {
      console.error(err);
      alert("erro ao conectar com o servidor");
    }
  };

  return { formData, handleChange, handleSubmit };
}
