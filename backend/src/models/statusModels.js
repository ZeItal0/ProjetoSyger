export const getStatusEstoque = (quantidade, minimo) => {
    if (quantidade < minimo) return "abaixo";
    if (quantidade < minimo * 1.5) return "ok";
    return "excesso";
};

export const getStatusValidade = (dataValidade) => {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diasRestantes = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) return "vencido";
    if (diasRestantes <= 30) return "proximo";
    return "normal";
};
