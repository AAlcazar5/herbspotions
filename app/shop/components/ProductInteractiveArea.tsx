"use client";

import React, { useState, useEffect, useMemo, FC } from "react";
import BackToProductButton from "@/shop/components/BackToProductButton";
import ProductInfo from "@/shop/components/ProductInfo";
import ProductForm from "@/shop/components/ProductForm";
import {
    ProductSectionProps,
    VariantNode,
    VariantNodeData,
    ImageNode,
    PriceObject,
    BaseImageNode,
} from "@/shared/types/product";
import { cn } from "@/lib/utils";

interface ProductInteractiveAreaProps {
    productData: ProductSectionProps['productData'];
    className?: string;
}

const ProductInteractiveArea: FC<ProductInteractiveAreaProps> = ({ productData, className }) => {
    const [variantPrice, setVariantPrice] = useState<PriceObject | null>(null);

    const mainImage: ImageNode | undefined = useMemo(() => {
        if (!productData?.images?.edges?.[0]?.node) return undefined;
        const firstImageNodeData = productData.images.edges[0].node;
         if (firstImageNodeData.url || firstImageNodeData.originalSrc) {
             const node: BaseImageNode = { url: firstImageNodeData.url, altText: firstImageNodeData.altText || firstImageNodeData.alt || productData.title || "Product image", alt: firstImageNodeData.alt || firstImageNodeData.altText || productData.title || "Product image", id: firstImageNodeData.id, originalSrc: firstImageNodeData.originalSrc, width: firstImageNodeData.width, height: firstImageNodeData.height };
             return { node: node };
         }
         return undefined;
    }, [productData]);

    const formattedVariants: VariantNode[] = useMemo(() => {
        if (!productData?.variants?.edges) return [];
        return productData.variants.edges
          .map((edge): VariantNode | null => {
            if (!edge?.node?.id) return null;
            const nodeData = edge.node;
            const newNodeData: VariantNodeData = { id: nodeData.id, title: nodeData.title ?? null, availableForSale: nodeData.availableForSale ?? true, selectedOptions: Array.isArray(nodeData.selectedOptions) ? nodeData.selectedOptions.map(opt => ({ name: opt?.name || 'Option', value: opt?.value || 'Default' })) : [], price: nodeData.price ? { amount: String(nodeData.price.amount ?? '0'), currencyCode: nodeData.price.currencyCode || 'USD' } : null };
            return { node: newNodeData };
          })
          .filter((variant): variant is VariantNode => variant !== null);
    }, [productData]);

    useEffect(() => {
        const firstAvailableVariant = formattedVariants.find(v => v.node.availableForSale !== false);
        const initialVariant = firstAvailableVariant || formattedVariants[0];
        setVariantPrice(initialVariant?.node?.price ?? null);
    }, [formattedVariants]);

    if (!productData || !productData.id) {
        return null;
    }

    return (
        <div className={cn("flex flex-col gap-4 justify-evenly", className)}>
                 <div className="mb-0">
                   <BackToProductButton href="/shop" />
                 </div>
                 <ProductInfo
                     title={productData.title}
                     price={variantPrice}
                     productData={productData}
                 />
            {formattedVariants.length > 0 && productData.handle ? (
                <ProductForm
                    className="mt-0"
                    title={productData.title || ""}
                    handle={productData.handle}
                    variants={formattedVariants}
                    mainImg={mainImage}
                    setVariantPrice={setVariantPrice}
                />
             ) : (
                <div className="mt-4 p-4 border border-dashed border-border dark:border-border rounded-md text-center text-muted-foreground dark:text-muted-foreground">
                    Product options are currently unavailable.
                </div>
             )}
        </div>
    );
};

export default ProductInteractiveArea;