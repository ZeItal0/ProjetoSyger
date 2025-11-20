import prisma from "../prismaCliente.js";
import { parseISO, startOfMonth, endOfMonth, isValid } from "date-fns";

export const DashboardModel = {
    async getDashboardData(dataInicial, dataFinal) {
        let start = dataInicial ? parseISO(dataInicial) : null;
        let end = dataFinal ? parseISO(dataFinal) : null;

        if (!start || !isValid(start)) start = startOfMonth(new Date());
        if (!end || !isValid(end)) end = endOfMonth(new Date());

        const startISO = start.toISOString();
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        const endISO = endOfDay.toISOString();

        const pedidos = await prisma.pedidos.findMany({
            where: {
                data_hora_pedido: { gte: startISO, lte: endISO },
                NOT: { status_pedido: "Estornado" },
            },
            include: {
                itens: {
                    include: {
                        produto: true,
                        prato: true,
                        variacao: { include: { prato: true } }
                    }
                }
            }
        });

        let totalVendas = 0;
        let totalCustoEstimado = 0;

        for (const p of pedidos) {
            totalVendas += Number(p.total_liquido ?? 0);

            for (const item of p.itens) {
                const quantidade = Number(item.quantidade ?? 0);

                if (item.produto && item.produto.custo_unitario != null) {
                    totalCustoEstimado += Number(item.produto.custo_unitario) * quantidade;

                } else if (item.variacao) {
                    const mult = Number(item.variacao.multiplicador_receita ?? 1);
                    const custoBase = Number(item.variacao.prato?.valor_base_custo ?? 0);
                    totalCustoEstimado += custoBase * mult * quantidade;

                } else if (item.prato) {
                    const custoBase = Number(item.prato.valor_base_custo ?? 0);
                    totalCustoEstimado += custoBase * quantidade;
                }
            }
        }

        const lucroEstimado = totalVendas - totalCustoEstimado;

        const totalEntrada = await prisma.movimentacaoEstoque.count({
            where: {
                tipo_movimentacao: "Entrada",
                data_movimentacao: { gte: startISO, lte: endISO }
            }
        });

        const totalSaida = await prisma.movimentacaoEstoque.count({
            where: {
                tipo_movimentacao: "Saida",
                data_movimentacao: { gte: startISO, lte: endISO }
            }
        });

        function monthsBetween(s, e) {
            const res = [];
            const cur = new Date(s.getFullYear(), s.getMonth(), 1);
            const endMonth = new Date(e.getFullYear(), e.getMonth(), 1);

            while (cur <= endMonth) {
                const y = cur.getFullYear();
                const m = cur.getMonth();
                res.push({
                    year: y,
                    month: m,
                    label: `${y}-${String(m + 1).padStart(2, "0")}`
                });
                cur.setMonth(cur.getMonth() + 1);
            }
            return res;
        }

        const meses = monthsBetween(start, end);
        const vendasPorMes = [];
        const receitasDespesas = [];

        for (const m of meses) {
            const monthStart = new Date(m.year, m.month, 1);
            const monthEnd = new Date(m.year, m.month + 1, 0, 23, 59, 59, 999);

            const pedidosMes = await prisma.pedidos.aggregate({
                _sum: { total_liquido: true },
                where: {
                    data_hora_pedido: {
                        gte: monthStart.toISOString(),
                        lte: monthEnd.toISOString()
                    },
                    NOT: { status_pedido: "Estornado" },
                },
            });

            const despesasMes = await prisma.despesas.aggregate({
                _sum: { valor_original: true },
                where: {
                    data_registro: {
                        gte: monthStart.toISOString(),
                        lte: monthEnd.toISOString()
                    }
                }
            });

            const receita = Number(pedidosMes._sum.total_liquido ?? 0);
            const despesa = Number(despesasMes._sum.valor_original ?? 0);

            vendasPorMes.push({ mes: m.label, receita });
            receitasDespesas.push({ mes: m.label, receita, despesa });
        }

        return {
            totalVendas,
            lucro: Number(lucroEstimado.toFixed(2)),
            totalEntrada,
            totalSaida,
            vendasPorMes,
            receitasDespesas
        };
    }
};
