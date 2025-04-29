"use client";

import React, { useCallback, Suspense } from 'react';
import { Post } from '@/shared/types/blog';
import PostListings from "@/blog/components/PostListings";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface BlogFilterableListProps {
  availableTags: string[];
  currentTag: string;
  posts: Post[];
}

function BlogFilterableListComponent({ availableTags, posts }: BlogFilterableListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlTag = searchParams.get('tag') || '';

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

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex items-center justify-center gap-3 max-w-xs sm:max-w-sm mx-auto">
        <label htmlFor="blog-tag-filter-select" className="text-sm font-medium text-foreground dark:text-foreground whitespace-nowrap">
          Filter by Category:
        </label>
        <div className="relative flex-grow-0 w-auto min-w-[170px]">
          <select
            id="blog-tag-filter-select"
            value={urlTag}
            onChange={handleTagChange}
            className="block w-full pl-3 pr-10 py-2 text-base border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background sm:text-sm rounded-md appearance-none cursor-pointer"
          >
            <option value="">All Posts</option>
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

      {posts.length > 0 ? (
          <PostListings posts={posts} />
      ) : (
          <p className="text-center text-muted-foreground dark:text-muted-foreground mt-10">
              {urlTag ? `No posts found in category "${urlTag}".` : 'No blog posts found.'}
          </p>
      )}
    </div>
  );
}

export default function BlogFilterableList(props: BlogFilterableListProps) {
  return (
    <Suspense fallback={<div className="text-center p-10 text-muted-foreground dark:text-muted-foreground">Loading filter...</div>}>
      <BlogFilterableListComponent {...props} />
    </Suspense>
  );
}
