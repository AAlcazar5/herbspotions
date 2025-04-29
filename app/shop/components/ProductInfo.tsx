import React from 'react';
import Price from "@/shop/components/Price";
import { ProductInfoProps } from "@/shared/types/product";
import { PriceData } from "@/shared/types/cart";
import { FC } from "react";

const ProductInfo: FC<ProductInfoProps> = ({ title, price }) => {
    let priceForNumProp: PriceData['num'] | null = null;
    if (price) {
        priceForNumProp = {
            amount: price.amount ?? undefined,
            currencyCode: price.currencyCode ?? undefined,
        };
    }

    const isPriceValid = priceForNumProp !== null &&
                         (priceForNumProp.amount !== undefined && priceForNumProp.amount !== null && String(priceForNumProp.amount).trim() !== '') &&
                         !isNaN(parseFloat(String(priceForNumProp.amount)));


    return (
        <div className="font-primary flex flex-col items-start gap-1">
            <h1 className="leading-tight font-extrabold text-3xl md:text-4xl text-green-500 dark:text-green-300 pb-1">
                {title || "Product Title"}
            </h1>

            <div className="text-xl font-medium mt-1 px-1 h-8 flex items-center">
                {isPriceValid ? (
                    <Price
                        num={priceForNumProp}
                        numSize="text-2xl"
                        currencyCode={price?.currencyCode ?? undefined}
                    />
                ) : (
                    <span className="text-2xl font-bold text-muted-foreground dark:text-muted-foreground">
                        --
                    </span>
                )}
            </div>
        </div>
    );
}

export default ProductInfo;