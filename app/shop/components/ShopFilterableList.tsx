"use client";

import React, { useMemo, useCallback, Suspense, FC } from 'react';
import { Product } from '@/shared/types/product';
import ProductListings from "@/shop/components/ProductListings";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface ShopFilterableListProps {
  availableTags: string[];
  currentTag: string;
  products: Product[];
}

const ShopFilterableListComponent: FC<ShopFilterableListProps> = ({ availableTags, currentTag, products }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlTag = useMemo(() => {
    return searchParams.get('tag') || '';
  }, [searchParams]);

  const handleTagChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTag = event.target.value;
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    if (newTag) {
      currentParams.set('tag', newTag);
    } else {
      currentParams.delete('tag');
    }
    const queryString = currentParams.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  }, [searchParams, router, pathname]);

  const selectInputClasses = `
    block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md appearance-none cursor-pointer
    border border-border dark:border-border
    bg-input dark:bg-input
    text-foreground dark:text-foreground
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background
  `;

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex items-center justify-center gap-3 max-w-xs sm:max-w-sm mx-auto">
        <label htmlFor="tag-filter-select" className="text-sm font-medium text-foreground dark:text-foreground whitespace-nowrap">
          Filter by Tag:
        </label>
        <div className="relative flex-grow-0 w-auto min-w-[150px]">
          <select
            id="tag-filter-select"
            value={urlTag}
            onChange={handleTagChange}
            className={selectInputClasses}
          >
            <option value="">All Products</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 pr-3 h-5 w-5 text-muted-foreground dark:text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>

      {products.length > 0 ? (
          <ProductListings products={products} />
      ) : (
          <p className="text-center text-muted-foreground dark:text-muted-foreground mt-10">
              {urlTag ? `No products found with the tag "${urlTag}".` : 'No products found.'}
          </p>
      )}
    </div>
  );
}

export default function ShopFilterableList(props: ShopFilterableListProps) {
  return (
    <Suspense fallback={<div className="text-center p-10 text-muted-foreground dark:text-muted-foreground">Loading filter options...</div>}>
      <ShopFilterableListComponent {...props} />
    </Suspense>
  );
}