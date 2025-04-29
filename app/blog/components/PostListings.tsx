"use client";

import PostCard from "@/blog/components/PostCard";
import React, { useState, useEffect, useMemo, useCallback, FC } from "react";
import { Post, PostListingsProps } from '@/shared/types/blog';
import { useSearchParams, usePathname, useRouter as useAppRouter } from 'next/navigation';

const PostListings: FC<PostListingsProps> = ({ posts: initialPosts = [] }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const appRouter = useAppRouter();

  const getInitialPage = useCallback(() => {
    const pageFromQuery = searchParams.get('page');
    const pageNum = pageFromQuery ? parseInt(pageFromQuery, 10) : 1;
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  }, [searchParams]);

  const [post, setPost] = useState<Post[]>(initialPosts || []);
  const [number, setNumber] = useState<number>(getInitialPage());
  const [postsPerPage] = useState<number>(10);

  useEffect(() => {
    setPost(initialPosts || []);
    setNumber(getInitialPage());
  }, [initialPosts, getInitialPage]);

  const lastPostIndex = number * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts: Post[] = Array.isArray(post) ? post.slice(firstPostIndex, lastPostIndex) : [];
  const totalPages = Math.ceil((Array.isArray(post) ? post.length : 0) / postsPerPage);
  const pageNumbers = useMemo(() => {
      const numbers: number[] = [];
      for (let i = 1; i <= totalPages; i++) { numbers.push(i); }
      return numbers;
  }, [totalPages]);

  const changePage = useCallback((pageNumber: number) => {
    const targetPage = Math.max(1, Math.min(pageNumber, totalPages || 1));

    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (targetPage === 1) {
        newSearchParams.delete('page');
    } else {
        newSearchParams.set('page', targetPage.toString());
    }
    const queryString = newSearchParams.toString();
    const newUrl = `${pathname}${queryString ? `?${queryString}` : ''}`;

    appRouter.push(newUrl);

  }, [totalPages, searchParams, appRouter, pathname]);

  const showPagination = totalPages > 1;

  const paginationBaseClasses = "mx-1 cursor-pointer px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const paginationIdleClasses = "border border-border bg-transparent text-muted-foreground hover:bg-muted dark:hover:bg-gray-800";
  const paginationActiveClasses = "border border-transparent bg-green-500 dark:bg-green-300 text-white cursor-default";
  const paginationDisabledClasses = "border border-transparent text-muted-foreground opacity-50 cursor-not-allowed";

  return (
    <>
      <div className="py-12 max-w-6xl mx-auto grid grid-cols-1 gap-x-8 gap-y-8 items-start pb-16">
        {currentPosts.length > 0 ? (
            currentPosts.map((singlePost) => {
                if (!singlePost?.id || !singlePost.handle) {
                    console.warn("Skipping rendering PostCard due to missing id/handle", singlePost);
                    return null;
                }
                return ( <PostCard key={singlePost.id} post={singlePost} /> );
             })
        ) : (
             <div className="col-span-full text-center py-16 text-muted-foreground dark:text-muted-foreground">
                 <p className="text-xl">No posts found for the current filter or page.</p>
                 { number > 1 && (
                     <button
                       onClick={() => changePage(1)}
                       className="mt-2 text-green-500 dark:text-green-300 hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                         Go to first page
                     </button>
                 )}
             </div>
        )}
      </div>

      {showPagination && (
        <div aria-label="Blog post pagination" className="flex justify-center items-center py-4 mb-6 space-x-2">
           <button
             onClick={() => changePage(number - 1)}
             disabled={number === 1}
             className={`${paginationBaseClasses} ${number === 1 ? paginationDisabledClasses : paginationIdleClasses}`}
             aria-label="Go to previous page"
            >
                &lt;
            </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
              disabled={number === pageNumber}
              className={`${paginationBaseClasses} ${number === pageNumber ? paginationActiveClasses : paginationIdleClasses}`}
              aria-current={number === pageNumber ? 'page' : undefined}
              aria-label={`Go to page ${pageNumber}`}
            >
              {pageNumber}
            </button>
          ))}

           <button
             onClick={() => changePage(number + 1)}
             disabled={number === totalPages}
             className={`${paginationBaseClasses} ${number === totalPages ? paginationDisabledClasses : paginationIdleClasses}`}
             aria-label="Go to next page"
            >
                &gt;
            </button>
        </div>
      )}
    </>
  );
};

export default PostListings;