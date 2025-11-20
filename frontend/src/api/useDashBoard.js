import { useState, useEffect } from "react";

export function useDashboard() {
    const [activeItem, setActiveItem] = useState("Dashboard");
    const [date, setDate] = useState(new Date());
    const [range, setRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [totalVendas, setTotalVendas] = useState(0);
    const [lucro, setLucro] = useState(0);
    const [totalEntrada, setTotalEntrada] = useState(0);
    const [totalSaida, setTotalSaida] = useState(0);

    const [vendasPorMes, setVendasPorMes] = useState([]);
    const [receitasDespesas, setReceitasDespesas] = useState([]);

    const formatDate = (d) => {
        const dt = new Date(d);
        return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
            dt.getDate()
        ).padStart(2, "0")}`;
    };

    useEffect(() => {
        const selected = new Date(date);
        const startOfMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
        const endOfMonth = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        setRange({ start: startOfMonth, end: endOfMonth });
    }, [date]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                const url = `http://localhost:5000/dashboard?dataInicial=${formatDate(range.start)}&dataFinal=${formatDate(range.end)}`;
                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error(`Erro ${res.status}`);

                const data = await res.json();
                setTotalVendas(Number(data.totalVendas ?? 0));
                setLucro(Number(data.lucro ?? 0));
                setTotalEntrada(Number(data.totalEntrada ?? 0));
                setTotalSaida(Number(data.totalSaida ?? 0));
                setVendasPorMes((data.vendasPorMes ?? []).map((r) => ({
                    mes: r.mes,
                    valor: r.receita,
                })));
                setReceitasDespesas(data.receitasDespesas ?? []);

            } catch (err) {
                console.error(err);
                setError("erro ao carregar dashboard");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [range.start, range.end]);

    return {
        activeItem, setActiveItem,
        date, setDate,
        range,
        loading,
        error,
        totalVendas,
        lucro,
        totalEntrada,
        totalSaida,
        vendasPorMes,
        receitasDespesas
    };
}
