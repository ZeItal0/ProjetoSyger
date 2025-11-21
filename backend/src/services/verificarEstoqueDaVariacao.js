import prisma from "../prismaCliente.js";
import { getSocket } from "../../socketServer.js";

export async function verificarEstoqueDaVariacao(id_variacao) {

    const variacao = await prisma.variacoesPorcao.findUnique({
        where: { id_variacao: Number(id_variacao) },
        include: {
            prato: {
                include: {
                    ingredientes: true,
                },
            },
            cardapioPratos: true,
        },
    });

    if (!variacao) return;

    const ingredientes = variacao.prato.ingredientes;
    const multiplicador = Number(variacao.multiplicador_receita ?? 1);

    let esgotado = false;

    for (const ing of ingredientes) {
        const produto = await prisma.produtos.findUnique({
            where: { id_produto: ing.id_produto },
        });

        const consumoPorUnidade = Number(ing.quantidade) * multiplicador;
        const estoqueAtual = Number(produto.quantidade_atual);

        if (estoqueAtual - consumoPorUnidade < Number(produto.quantidade_minima)) {
            esgotado = true;
            break;
        }
    }

    if (esgotado) {
        await prisma.cardapioPratos.updateMany({
            where: { id_variacao: Number(id_variacao) },
            data: { disponivel: false },
        });

        const socket = getSocket();
        if (socket) {
            socket.emit("cardapio_atualizado", { id_variacao });
        }

        return true;
    }

    return false;
}
