import React from 'react';

interface PriceProps {
  num?: number | string | { amount?: string | number | null; currencyCode?: string | null } | null;
  numSize?: string;
  currency?: string;
  currencyCode?: string;
  className?: string;
}

const Price: React.FC<PriceProps> = ({
    num,
    numSize = 'text-base',
    currency,
    currencyCode,
    className = ''
}) => {
    let priceValue: number | null = null;
    let actualCurrencyCode: string = 'USD';

    if (typeof num === 'object' && num !== null && 'amount' in num) {
        priceValue = parseFloat(String(num.amount ?? 'NaN'));
        actualCurrencyCode = num.currencyCode || currencyCode || 'USD';
    } else if (num !== null && num !== undefined && String(num).trim() !== '') {
        priceValue = parseFloat(String(num));
        actualCurrencyCode = currencyCode || 'USD';
    }

    if (priceValue === null || isNaN(priceValue)) {
        return (
            <span className={`font-bold ${numSize} ${className} text-muted-foreground dark:text-muted-foreground`}>
                --
            </span>
        );
    }

    try {
        const formattedPrice = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: actualCurrencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(priceValue);

        return (
            <span className={`font-bold ${numSize} ${className} text-foreground dark:text-foreground`}>
                {formattedPrice}
            </span>
        );
    } catch (error) {
        console.error("Error formatting price:", error);
        const symbol = currency || '$';
        return (
            <span className={`font-bold ${numSize} ${className} text-destructive-500 dark:text-destructive-500`}>
                {symbol}{priceValue.toFixed(2)}
            </span>
        );
    }
}

export default Price;