import prisma from "../prismaCliente.js";
import { getStatusEstoque, getStatusValidade } from "./statusModels.js";

export const buscarEstoque = async ({
    fornecedor,
    categoria,
    nivelEstoque,
    statusValidade,
    pesquisa,
    pagina,
    limite
}) => {

    const produtos = await prisma.produtos.findMany({
        where: {
            ativo: true,
            nome_produto: pesquisa ? { contains: pesquisa, mode: "insensitive" } : undefined,
            categoria: categoria ? { nome_categoria: categoria } : undefined,
        },
        include: {
            categoria: true,
            unidade: true,
            fornecedores: { include: { fornecedor: true } },
            movimentacoes: { orderBy: { data_movimentacao: "desc" }, take: 1 },
        },
    });

    let filtrado = produtos;

    if (fornecedor) {
        filtrado = filtrado.filter((p) =>
            p.fornecedores.some((f) => f.fornecedor.nome_empresa === fornecedor)
        );
    }

    const itens = filtrado.map((p) => {
        const quantidade = Number(p.quantidade_atual);
        const minimo = Number(p.quantidade_minima);
        const ultimaMov = p.movimentacoes[0];

        return {
            id: p.id_produto,
            nome: p.nome_produto,
            fornecedor: p.fornecedores[0]?.fornecedor.nome_empresa || "Desconhecido",
            categoria: p.categoria.nome_categoria,
            quantidade,
            minimo,
            unidade: p.unidade.nome_unidade,
            custoTotal: Number(p.custo_unitario || 0) * quantidade,
            validade: p.validade,
            statusEstoque: getStatusEstoque(quantidade, minimo),
            statusValidade: getStatusValidade(p.validade),
            ultimaAcao: ultimaMov?.tipo_movimentacao || "—",
            dataUltMovimento: ultimaMov?.data_movimentacao || null,
        };
    });

    let filtradoFinal = itens;

    if (nivelEstoque)
        filtradoFinal = filtradoFinal.filter((i) => i.statusEstoque === nivelEstoque);

    if (statusValidade)
        filtradoFinal = filtradoFinal.filter((i) => i.statusValidade === statusValidade);

    const total = filtradoFinal.length;

    const paginado = filtradoFinal.slice(
        (pagina - 1) * limite,
        pagina * limite
    );

    return {
        paginaAtual: pagina,
        totalPaginas: Math.ceil(total / limite),
        totalResultados: total,
        itens: paginado,
    };
};
