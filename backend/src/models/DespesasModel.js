import prisma from "../prismaCliente.js";

export const criarDespesa = async (dados) => {
    // console.log("Recebendo dados da despesa:", dados);
    const statusEnumMap = {
        "a pagar": "A_pagar",
        "pago": "Pago",
        "vencida": "Vencida",
        "cancelado/estornado": "Cancelado_Estornado",
    };

    const statusDivida =
        statusEnumMap[dados.status_divida?.toLowerCase()] || "A_pagar";


    const despesa = await prisma.despesas.create({
        data: {
            descricao: dados.descricao,
            valor_original: dados.valor_original,
            data_vencimento: new Date(dados.data_vencimento),
            status_divida: statusDivida,
            data_pagamento: dados.data_pagamento || null,
            fornecedor: {
                connect: { id_fornecedor: Number(dados.fornecedorId) },
            },
            categoria: {
                connect: { id_categoria_financeira: Number(dados.categoriaId) },
            },
            usuario: dados.usuarioId
                ? { connect: { id_usuario: Number(dados.usuarioId) } }
                : undefined,
        },
    });

    return despesa;
};

export const listarDespesas = async () => {
    const despesas = await prisma.despesas.findMany({
        include: {
            fornecedor: { select: { nome_empresa: true } },
            categoria: { select: { nome_categoria: true } },
        },
        orderBy: { data_vencimento: "asc" },
    });

    return despesas.map((d) => ({
        id_despesa: d.id_despesa,
        descricao: d.descricao,
        valor_original: d.valor_original,
        data_vencimento: d.data_vencimento,
        status_divida: d.status_divida,
        data_pagamento: d.data_pagamento
            ? d.data_pagamento.toISOString().split("T")[0]
            : null,
        fornecedor: d.fornecedor?.nome_empresa || "—",
        categoria: d.categoria?.nome_categoria || "—",
    }));

};

export const atualizarDespesa = async (id, dados) => {
    return await prisma.despesas.update({
        where: { id_despesa: id },
        data: {
            status_divida: dados.status_divida,
            data_pagamento: dados.data_pagamento,
        },
    });
};

export const deletarDespesa = async (id) => {
    return await prisma.despesas.delete({
        where: { id_despesa: id },
    });
};
