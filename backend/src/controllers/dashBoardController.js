import { DashboardModel } from "../models/dashBoardModel.js";

export const dashboardData = async (req, res) => {
    try {
        const resultado = await DashboardModel.getDashboardData(
            req.query.dataInicial,
            req.query.dataFinal
        );

        return res.json(resultado);

    } catch (err) {
        console.error("dashboardData error:", err);
        return res.status(500).json({
            message: "Erro ao gerar dashboard",
            detail: err.message
        });
    }
};
