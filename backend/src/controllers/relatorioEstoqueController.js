import { buscarEstoque } from "../models/estoqueModel.js";
import { gerarInventarioPDFModel, gerarReposicaoPDFModel } from "../models/pdfModel.js";

export const listarEstoque = async (req, res) => {
    try {
        const {
            fornecedor,
            categoria,
            nivelEstoque,
            statusValidade,
            pesquisa,
            page = 1,
            limit = 20
        } = req.query;

        const resultado = await buscarEstoque({
            fornecedor,
            categoria,
            nivelEstoque,
            statusValidade,
            pesquisa,
            pagina: Number(page),
            limite: Number(limit)
        });

        res.json(resultado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao listar estoque" });
    }
};

export const gerarInventarioPDF = async (req, res) =>
    gerarInventarioPDFModel(res);

export const gerarRelatorioReposicaoPDF = async (req, res) =>
    gerarReposicaoPDFModel(res);
