"use client";

import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import {
  ProductCardProps,
  ProductVariantEdge,
  VariantNodeData,
  ProductMediaEdge,
  ImageEdge,
  PriceObject,
} from '@/shared/types/product';
import Price from './Price';
import { PriceData } from '@/shared/types/cart';

const gradientClasses = [
    "bg-gradient-to-br from-secondary-500 via-green-500 to-lime-500",
    "bg-gradient-to-tr from-secondary-500 via-yellow-500 to-accent-500",
    "bg-gradient-to-bl from-lime-500 via-accent-500 to-green-500",
    "bg-gradient-to-tl from-yellow-500 via-destructive-500 to-secondary-500",
    "bg-gradient-to-r from-yellow-500 via-lime-500 to-green-500",
    "bg-gradient-to-l from-accent-500 via-light-500 to-secondary-500",
    "bg-gradient-to-b from-green-500 via-accent-500 to-yellow-500",
    "bg-gradient-to-t from-lime-500 via-secondary-500 to-light-500",
    "bg-gradient-to-br from-light-500 via-green-500 to-yellow-500",
    "bg-gradient-to-tl from-accent-500 via-lime-500 to-destructive-500",
    "bg-gradient-to-tr from-accent-500 to-destructive-500",
    "bg-gradient-to-bl from-yellow-500 to-secondary-500",
];

const getGradientClass = (title: string) => {
    const safeTitle = typeof title === 'string' ? title : '';
    const index = (safeTitle.length + 1) % gradientClasses.length;
    return gradientClasses[index];
};


function ProductCard({ product }: ProductCardProps) {
    const handle = product?.handle || '';
    const title = product?.title || 'Untitled Product';
    const [priceRange, setPriceRange] = useState<{ min: PriceObject | null, max: PriceObject | null }>({ min: null, max: null });
    const [availableOptions, setAvailableOptions] = useState<string[]>([]);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const { imageUrl, imageAlt, imageWidth, imageHeight } = useMemo(() => {
        type PossibleImageNode = ProductMediaEdge['node'] | ImageEdge['node'] | null | undefined;
        const imageEdgeNode: PossibleImageNode = product?.media?.edges?.[0]?.node ?? product?.images?.edges?.[0]?.node;
        let url: string | null = null, alt: string = title, width: number | undefined = undefined, height: number | undefined = undefined;

        if (imageEdgeNode) {
            if ('image' in imageEdgeNode && imageEdgeNode.image && typeof imageEdgeNode.image === 'object') {
                url = imageEdgeNode.image.url || null;
                width = imageEdgeNode.image.width || undefined;
                height = imageEdgeNode.image.height || undefined;
                alt = imageEdgeNode.alt || title;
            } else if (('url' in imageEdgeNode && typeof imageEdgeNode.url === 'string') || ('originalSrc' in imageEdgeNode && typeof imageEdgeNode.originalSrc === 'string')) {
                url = imageEdgeNode.url || imageEdgeNode.originalSrc || null;
                 if ('width' in imageEdgeNode && typeof imageEdgeNode.width === 'number') width = imageEdgeNode.width;
                 if ('height' in imageEdgeNode && typeof imageEdgeNode.height === 'number') height = imageEdgeNode.height;
                 if ('altText' in imageEdgeNode && imageEdgeNode.altText) alt = imageEdgeNode.altText;
                 else if ('alt' in imageEdgeNode && imageEdgeNode.alt) alt = imageEdgeNode.alt;
                 else alt = title;
            } else if (alt === title && 'alt' in imageEdgeNode && typeof imageEdgeNode.alt === 'string' && imageEdgeNode.alt) {
                 alt = imageEdgeNode.alt;
            }
        }
        return { imageUrl: url, imageAlt: alt, imageWidth: width, imageHeight: height };
    }, [product?.media, product?.images, title]);

    useEffect(() => {
        let minPriceVal = Infinity;
        let maxPriceVal = -Infinity;
        const optionsSet = new Set<string>();
        const mainCurrencyCode = product?.priceRange?.minVariantPrice?.currencyCode ?? 'USD';
        const edges = product?.variants?.edges;
        const validEdges = edges?.filter((edge): edge is ProductVariantEdge & { node: VariantNodeData } =>
            edge != null && edge.node != null
        ) || [];

        if (validEdges.length > 0) {
            validEdges.forEach((edge) => {
                const node = edge.node;
                if (node.title && node.title.toLowerCase() !== 'default title') {
                    optionsSet.add(node.title);
                }
                const priceAmountStr = node.price?.amount;
                const priceAmount = parseFloat(priceAmountStr || 'NaN');
                if (!isNaN(priceAmount)) {
                    minPriceVal = Math.min(minPriceVal, priceAmount);
                    maxPriceVal = Math.max(maxPriceVal, priceAmount);
                }
            });
             const sortedOptions = Array.from(optionsSet).sort((a, b) => {
                 const numA = parseFloat(a.replace(/[^0-9.]/g, ''));
                 const numB = parseFloat(b.replace(/[^0-9.]/g, ''));
                 if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
                     return numA - numB;
                 }
                 return a.localeCompare(b);
             });
            setAvailableOptions(sortedOptions);
            const finalPriceRange = {
                min: isFinite(minPriceVal) ? { amount: String(minPriceVal), currencyCode: mainCurrencyCode } : null,
                max: isFinite(maxPriceVal) ? { amount: String(maxPriceVal), currencyCode: mainCurrencyCode } : null,
            };
            setPriceRange(finalPriceRange);
        } else {
             const fallbackPriceRange = {
                 min: product?.priceRange?.minVariantPrice ?? null,
                 max: product?.priceRange?.maxVariantPrice ?? null
             };
            setPriceRange(fallbackPriceRange);
            setAvailableOptions([]);
        }
    }, [product]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    let priceDisplay: React.ReactNode = <span className="text-muted-foreground text-sm">Unavailable</span>;
    if (priceRange.min) {
        const numPropMin: PriceData['num'] = {
            amount: priceRange.min.amount ?? undefined,
            currencyCode: priceRange.min.currencyCode ?? undefined,
        };
        if (priceRange.max && priceRange.min.amount !== priceRange.max.amount) {
            const numPropMax: PriceData['num'] = {
                amount: priceRange.max.amount ?? undefined,
                currencyCode: priceRange.max.currencyCode ?? undefined,
            };
            priceDisplay = (
                <span className="text-lg font-medium text-inherit">
                    <Price num={numPropMin} numSize="text-lg" currencyCode={priceRange.min.currencyCode ?? undefined} />
                    <span className="mx-1"> - </span>
                    <Price num={numPropMax} numSize="text-lg" currencyCode={priceRange.max.currencyCode ?? undefined} />
                </span>
            );
        } else {
            priceDisplay = <Price num={numPropMin} numSize="text-lg" currencyCode={priceRange.min.currencyCode ?? undefined} />;
        }
    }

    const cardGradientClass = useMemo(() => getGradientClass(title), [title]);
    const roundedClass = "rounded-lg";
    const cardBgClass = "bg-card dark:bg-card";
    const textColorClass = "text-foreground dark:text-foreground";
    const hoverRingClass = "ring-secondary-500/70 dark:ring-accent-500/70";
    const hoverEffectClass = isHovered
        ? `transform scale-[1.02] shadow-xl ring-2 ${hoverRingClass}`
        : 'shadow-md';
    const titleColorClass = "text-green-500 dark:text-green-300";
    const optionPillBgClass = "bg-muted/60 dark:bg-muted/40";
    const optionPillTextClass = "text-muted-foreground dark:text-muted-foreground";
    const optionMoreTextClass = "text-muted-foreground/70 dark:text-muted-foreground/70";
    const buttonIdleBgClass = "bg-muted";
    const buttonIdleTextClass = "text-green-500 dark:text-green-300";
    const buttonHoverClasses = "bg-green-500 dark:bg-green-300 text-white dark:text-black";
    const buttonIdleClasses = `${buttonIdleBgClass} ${buttonIdleTextClass}`;

    return (
        <Link href={handle ? `/shop/${handle}` : '#'} className="no-underline block cursor-pointer group h-full" aria-label={`View details for ${title}`} prefetch={false}>
            <div
                className={`flex flex-col ${roundedClass} overflow-hidden h-full relative ${cardBgClass} ${textColorClass} transition-all duration-300 ease-in-out ${hoverEffectClass}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={`relative overflow-hidden w-full aspect-square ${cardGradientClass}`}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={imageAlt}
                            className="object-cover transition-transform duration-500 ease-in-out transform scale-100 group-hover:scale-105 w-full h-full"
                            loading="lazy"
                            width={imageWidth || 400}
                            height={imageHeight || 400}
                        />
                    ) : (
                        <div className={`w-full h-full bg-muted dark:bg-muted/50 flex items-center justify-center text-muted-foreground`}>
                            <span>No Image</span>
                        </div>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className={`font-semibold text-md md:text-lg ${titleColorClass} overflow-hidden whitespace-normal line-clamp-2 mb-2 min-h-[2.8em] text-center`}>{title}</h3>
                    <div className="mb-3 text-inherit min-h-[1.5em] text-center">{priceDisplay}</div>

                    {availableOptions.length > 0 && (
                        <div className="text-center mt-1 mb-3 min-h-[2em]">
                            {availableOptions.slice(0, 4).map((option) => (
                                <span
                                    key={option}
                                    className={`inline-block ${optionPillBgClass} rounded-full px-2.5 py-0.5 text-xs font-medium ${optionPillTextClass} whitespace-nowrap mx-1 my-0.5`}
                                >
                                    {option}
                                </span>
                            ))}
                            {availableOptions.length > 4 && (
                                <span className={`inline-block text-xs font-medium ${optionMoreTextClass} self-center ml-1`}>
                                    +{availableOptions.length - 4} more
                                </span>
                            )}
                        </div>
                    )}

                    <div className="mt-auto pt-2 w-full">
                         <span className={`block w-full text-center px-3 py-1.5 ${roundedClass} text-sm font-medium transition-colors duration-200 ${isHovered ? buttonHoverClasses : buttonIdleClasses}`}>
                            View Details
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;