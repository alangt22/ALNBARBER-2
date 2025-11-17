
const CURENCY_FORMATTER =  new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
    minimumFractionDigits: 0
})

export function formatCurrency(number: number){
    return CURENCY_FORMATTER.format(number)
}