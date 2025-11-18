import * as RelatorioModel from "../models/relatorioVendasModel.js";

export const relatorioVendas = async (req, res) => {
  try {
    const { pagamento, tipoVenda, periodo, data, dataInicio, dataFim } = req.query;

    const pedidos = await RelatorioModel.buscarPedidos({ pagamento, tipoVenda, periodo, data, dataInicio, dataFim });
    const resumoETop10 = RelatorioModel.calcularResumoETop10(pedidos);

    return res.json({
      filtrosAplicados: { pagamento, tipoVenda, periodo, data, dataInicio, dataFim },
      pedidos,
      resumo: {
        totalBruto: resumoETop10.totalBruto,
        totalLiquido: resumoETop10.totalLiquido,
        totalDescontos: resumoETop10.totalDescontos,
        quantidadeVendas: resumoETop10.quantidadeVendas,
        ticketMedio: resumoETop10.ticketMedio,
      },
      top10Pratos: resumoETop10.top10,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao gerar relatório de vendas" });
  }
};
