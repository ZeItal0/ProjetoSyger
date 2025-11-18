import { useState, useEffect } from "react";

export const useRelatorioVendas = () => {
  const [filtroPagamento, setFiltroPagamento] = useState("");
  const [filtroTipoVenda, setFiltroTipoVenda] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [filtroDataEspecifica, setFiltroDataEspecifica] = useState("");
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [modoComparacao, setModoComparacao] = useState(false);
  const [filtroDataInicioComparacao, setFiltroDataInicioComparacao] = useState("");
  const [filtroDataFimComparacao, setFiltroDataFimComparacao] = useState("");

  const [pedidos, setPedidos] = useState([]);
  const [resumo, setResumo] = useState({
    totalBruto: 0,
    totalLiquido: 0,
    totalDescontos: 0,
    quantidadeVendas: 0,
    ticketMedio: 0,
  });
  const [top10, setTop10] = useState([]);

  const carregarRelatorio = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filtroPagamento) params.append("pagamento", filtroPagamento);
      if (filtroTipoVenda) params.append("tipoVenda", filtroTipoVenda);
      if (filtroPeriodo) params.append("periodo", filtroPeriodo);
      if (filtroDataEspecifica) params.append("data", filtroDataEspecifica);
      if (filtroDataInicioComparacao && filtroDataFimComparacao) {
        params.append("dataInicio", filtroDataInicioComparacao);
        params.append("dataFim", filtroDataFimComparacao);
      }

      const resposta = await fetch(
        `http://localhost:5000/relatorios/vendas?${params.toString()}`,
        {
          headers: { "Authorization": `Bearer ${token}` },
        }
      );
      const dados = await resposta.json();

      setPedidos(dados.pedidos || []);
      setResumo(dados.resumo || {});
      setTop10(dados.top10Pratos || []);
    } catch (erro) {
      console.error("Erro ao carregar relatório:", erro);
    }
  };

  useEffect(() => {
    carregarRelatorio();
  }, [
    filtroPagamento,
    filtroTipoVenda,
    filtroPeriodo,
    filtroDataEspecifica,
    filtroDataInicioComparacao,
    filtroDataFimComparacao,
  ]);

  const gerarPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filtroPagamento) params.append("forma_pagamento", filtroPagamento);
      if (filtroTipoVenda) params.append("tipo_venda", filtroTipoVenda);
      if (filtroPeriodo) params.append("periodo", filtroPeriodo);
      if (filtroDataEspecifica) params.append("data", filtroDataEspecifica);
      if (filtroDataInicioComparacao && filtroDataFimComparacao) {
        params.append("dataInicial", filtroDataInicioComparacao);
        params.append("dataFinal", filtroDataFimComparacao);
      }

      const resposta = await fetch(
        `http://localhost:5000/relatorios/vendas/pdf?${params.toString()}`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );

      const blob = await resposta.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (erro) {
      console.error("Erro ao gerar PDF:", erro);
    }
  };

  const enviarEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const body = {
        forma_pagamento: filtroPagamento,
        tipo_venda: filtroTipoVenda,
        periodo: filtroPeriodo,
        data: filtroDataEspecifica,
        dataInicial: filtroDataInicioComparacao,
        dataFinal: filtroDataFimComparacao,
      };

      const resposta = await fetch(
        "http://localhost:5000/relatorios/vendas/pdf/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await resposta.json();

      if (resposta.ok) alert("E-mail enviado com sucesso!");
      else alert("Erro ao enviar e-mail: " + data.erro);
    } catch (erro) {
      console.error("Erro ao enviar e-mail:", erro);
      alert("Erro ao enviar e-mail, veja o console para mais detalhes.");
    }
  };

  return {
    filtroPagamento,
    setFiltroPagamento,
    filtroTipoVenda,
    setFiltroTipoVenda,
    filtroPeriodo,
    setFiltroPeriodo,
    filtroDataEspecifica,
    setFiltroDataEspecifica,
    diaSelecionado,
    setDiaSelecionado,
    modoComparacao,
    setModoComparacao,
    filtroDataInicioComparacao,
    setFiltroDataInicioComparacao,
    filtroDataFimComparacao,
    setFiltroDataFimComparacao,
    pedidos,
    resumo,
    top10,
    carregarRelatorio,
    gerarPDF,
    enviarEmail,
  };
};
