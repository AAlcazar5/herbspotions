"use client";

import React, { useState, useEffect, useMemo, useCallback, FC } from "react";
import ProductCard from "@/shop/components/ProductCard";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ProductListingsProps } from "@/shared/types/product";

const ProductListings: FC<ProductListingsProps> = ({ products = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialPage = useCallback(() => {
    const pageFromQuery = searchParams.get('page');
    const pageNum = pageFromQuery ? parseInt(pageFromQuery, 10) : 1;
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  }, [searchParams]);

  const [currentPage, setCurrentPage] = useState<number>(getInitialPage());
  const [productPerPage] = useState<number>(9);

  useEffect(() => {
    setCurrentPage(getInitialPage());
  }, [searchParams, getInitialPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(products.length / productPerPage);
  }, [products.length, productPerPage]);

  const currentProducts = useMemo(() => {
    const lastProductIndex = currentPage * productPerPage;
    const firstProductIndex = lastProductIndex - productPerPage;
    return products.slice(firstProductIndex, lastProductIndex);
  }, [products, currentPage, productPerPage]);

  const pageNumbers = useMemo(() => {
    const numbers: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(i);
    }
    return numbers;
  }, [totalPages]);


  const ChangePage = useCallback((pageNumber: number) => {
    const targetPage = Math.max(1, Math.min(pageNumber, totalPages || 1));

    const currentUrlParams = new URLSearchParams(Array.from(searchParams.entries()));
    if (targetPage === 1) {
        currentUrlParams.delete('page');
    } else {
        currentUrlParams.set('page', targetPage.toString());
    }
    const query = currentUrlParams.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;

    router.push(newUrl);

  }, [searchParams, pathname, router, totalPages]);

  const showPagination = totalPages > 1;

  const paginationBaseClasses = "px-3 py-2 text-center border rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:focus-visible:ring-ring transition-colors duration-150 text-sm font-medium";
  const paginationIdleClasses = "border-border dark:border-border bg-transparent text-muted-foreground hover:bg-muted dark:hover:bg-gray-800 cursor-pointer";
  const paginationActiveClasses = "bg-green-500 dark:bg-green-300 text-white dark:text-white border-transparent cursor-default z-10";
  const paginationDisabledClasses = "bg-muted/50 dark:bg-gray-800 border-transparent text-muted-foreground/50 dark:text-gray-500 cursor-not-allowed";


  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {products.length > 0 ? (
          currentProducts.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                   {currentProducts.map((prod) => (
                       <ProductCard key={prod.id || `prod-${prod.handle}`} product={prod} />
                   ))}
                </div>
          ) : (
               <div className="text-center py-16 text-muted-foreground dark:text-muted-foreground">
                  <p className="text-xl mb-2">No products found on this page.</p>
                  <button
                      onClick={() => ChangePage(1)}
                      className="text-green-500 dark:text-green-300 hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                      Go to first page
                  </button>
               </div>
          )
      ) : (
        <div className="text-center py-16 text-muted-foreground dark:text-muted-foreground">
          <p className="text-xl">No products match your selected filters.</p>
        </div>
      )}

      {showPagination && (
        <nav aria-label="Product pagination" className="flex justify-center items-center pt-10 pb-4 space-x-1 md:space-x-2">
            <button
                onClick={() => ChangePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${paginationBaseClasses} ${currentPage === 1 ? paginationDisabledClasses : paginationIdleClasses}`}
                aria-label="Go to previous page"
            >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            </button>

            {pageNumbers.map((pageNumber) => (
            <button
                key={pageNumber}
                className={`${paginationBaseClasses} ${currentPage === pageNumber ? paginationActiveClasses : paginationIdleClasses}`}
                onClick={() => ChangePage(pageNumber)}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
                aria-label={`Go to page ${pageNumber}`}
            >
                {pageNumber}
            </button>
            ))}

            <button
                onClick={() => ChangePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${paginationBaseClasses} ${currentPage === totalPages ? paginationDisabledClasses : paginationIdleClasses}`}
                 aria-label="Go to next page"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            </button>
        </nav>
      )}
    </div>
  );
}

export default ProductListings;