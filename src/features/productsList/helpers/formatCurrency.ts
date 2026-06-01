export const formatCurrency = (price: number, currency: string = 'PLN') =>
    price.toLocaleString('pl-PL', { style: 'currency', currency: currency });
