"use client";

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from "@/shared/types/product";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimilarProductsProps {
  products: Product[] | any[];
}

function formatPrice(price?: { amount?: string | number | null, currencyCode?: string | null } | null): string | null {
    if (!price?.amount) return null;
    try {
        const amount = parseFloat(String(price.amount));
        if (isNaN(amount)) return null;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currencyCode || 'USD',
        }).format(amount);
    } catch (e) {
        console.error("Price format error", e);
        const numAmount = Number(price.amount);
        return isNaN(numAmount) ? null : `$${numAmount.toFixed(2)}`;
    }
}

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

const getGradientClass = (title?: string | null) => {
    const safeTitle = typeof title === 'string' ? title : '';
    const index = (safeTitle.length + 1) % gradientClasses.length;
    return gradientClasses[index];
};

export default function SimilarProducts({ products }: SimilarProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollAmount = 300;

   const checkScrollBounds = useCallback(() => {
     const el = scrollContainerRef.current;
     if (el) {
       const tolerance = 5;
       const atStart = el.scrollLeft <= tolerance;
       const scrollable = el.scrollWidth > el.clientWidth;
       const atEnd = !scrollable || (el.scrollLeft >= el.scrollWidth - el.clientWidth - tolerance);

       setIsAtStart(atStart);
       setIsAtEnd(atEnd);
     }
   }, []);

   useEffect(() => {
     const container = scrollContainerRef.current;
     if (container) {
       checkScrollBounds();

       container.addEventListener('scroll', checkScrollBounds, { passive: true });

       const resizeObserver = new ResizeObserver(checkScrollBounds);
       resizeObserver.observe(container);

       return () => {
         container.removeEventListener('scroll', checkScrollBounds);
         resizeObserver.unobserve(container);
       }
     }
   }, [products, checkScrollBounds]);

   const scroll = useCallback((direction: 'left' | 'right') => {
     const el = scrollContainerRef.current;
     if (el) {
         const targetScroll = direction === 'left' ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount;
         el.scrollTo({ left: targetScroll, behavior: 'smooth' });

         setTimeout(checkScrollBounds, 350);
     }
   }, [scrollAmount, checkScrollBounds]);

  if (!products || products.length === 0) {
    return null;
  }

  const showArrows = !(isAtStart && isAtEnd);

  return (
    <div className="mt-16 sm:mt-20 relative">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-semibold tracking-tight text-foreground dark:text-foreground">
           You Might Also Like
         </h2>
         {showArrows && (
           <div className="flex gap-2">
             <button
                onClick={() => scroll('left')}
                disabled={isAtStart}
                aria-label="Scroll similar products left"
                className={`p-1.5 rounded-full border text-foreground hover:bg-muted/50 disabled:opacity-50 disabled:pointer-events-none transition-opacity ${isAtStart ? 'border-muted' : 'border-border hover:border-foreground'}`}
             >
                 <ChevronLeft className="h-5 w-5" />
             </button>
             <button
                 onClick={() => scroll('right')}
                 disabled={isAtEnd}
                 aria-label="Scroll similar products right"
                 className={`p-1.5 rounded-full border text-foreground hover:bg-muted/50 disabled:opacity-50 disabled:pointer-events-none transition-opacity ${isAtEnd ? 'border-muted' : 'border-border hover:border-foreground'}`}
             >
                 <ChevronRight className="h-5 w-5" />
             </button>
           </div>
         )}
       </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
      >
        {products.map((product) => {
          const imageUrl = product?.images?.edges?.[0]?.node?.url ?? product?.media?.edges?.[0]?.node?.image?.url ?? '/placeholder-image.png';
          const imageAlt = product?.images?.edges?.[0]?.node?.altText ?? product?.altText ?? product?.title ?? 'Product image';
          const priceString = formatPrice(product?.priceRange?.minVariantPrice);
          const productTitle = product?.title;

          const cardGradientClass = getGradientClass(productTitle);

          return (
            <div key={product.id || product.handle} className="flex-shrink-0 w-56 sm:w-64">
              <Link
                href={`/shop/${product.handle}`}
                className="group relative block h-full overflow-hidden rounded-lg border border-border dark:border-border bg-card dark:bg-card hover:shadow-lg transition-shadow duration-200"
              >
                <div className={`aspect-w-3 aspect-h-4 sm:aspect-none sm:h-48 overflow-hidden rounded-t-lg ${cardGradientClass}`}>
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    loading="lazy"
                    className="h-full w-full object-contain object-center group-hover:opacity-90 transition-opacity duration-300"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-medium text-foreground dark:text-foreground truncate" title={productTitle}>{productTitle}</h3>
                  {priceString && (
                     <p className="mt-1 text-sm font-semibold text-foreground dark:text-foreground">{priceString}</p>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}