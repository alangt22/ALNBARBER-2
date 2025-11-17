
/**
 * Converte um valor monetário em reais (BRL) para centavos.
 * @param {string} amount - O valor monetário em reais (BRL) a ser convertido.
 * @returns {number} O valor convertido em centavos.
 * 
 * @example
 * convertRealToCents("1.300,50"); // retorna: 123456
 */
export function convertRealToCents(amount: string){
    const numericPrice = parseFloat(amount.replace(/\./g, '').replace(',', '.'))
    const priceCents = Math.round(numericPrice * 100)
    
    return priceCents;
}