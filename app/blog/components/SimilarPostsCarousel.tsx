"use client";

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from "@/shared/types/blog";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimilarPostsCarouselProps {
  posts: Post[];
}

export default function SimilarPostsCarousel({ posts }: SimilarPostsCarouselProps) {
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
   }, [posts, checkScrollBounds]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
        const targetScroll = direction === 'left' ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount;
        el.scrollTo({ left: targetScroll, behavior: 'smooth' });
        setTimeout(checkScrollBounds, 350);
    }
   }, [scrollAmount, checkScrollBounds]);


  if (!posts || posts.length === 0) {
    return null;
  }

  const showArrows = !(isAtStart && isAtEnd);

  return (
    <div className="mt-16 sm:mt-20 py-8 border-t border-border dark:border-border">
      <div className="max-w-6xl w-11/12 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground dark:text-foreground">
              Related Posts
            </h2>
            {showArrows && (
              <div className="flex gap-2">
                <button
                    onClick={() => scroll('left')}
                    disabled={isAtStart}
                    aria-label="Scroll related posts left"
                    className={`p-1.5 rounded-full border border-border text-foreground hover:bg-muted dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors`}
                >
                     <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    disabled={isAtEnd}
                    aria-label="Scroll related posts right"
                    className={`p-1.5 rounded-full border border-border text-foreground hover:bg-muted dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors`}
                >
                     <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div
            ref={scrollContainerRef}
            className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
          >
            {posts.map((post) => {
              const imageUrl = post.image?.url ?? '/placeholder-image.png';
              const imageAlt = post.image?.altText ?? post.image?.alt ?? post.title ?? 'Blog post image';

              return (
                <div key={post.id} className="flex-shrink-0 w-64 sm:w-72 md:w-80">
                  <Link
                    href={`/blog/${post.handle}`}
                    className="group block h-full overflow-hidden rounded-lg border border-border dark:border-border bg-card dark:bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-muted dark:bg-muted">
                      <img
                        src={imageUrl}
                        alt={imageAlt}
                        loading="lazy"
                        className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-foreground dark:text-foreground group-hover:text-green-500 dark:group-hover:text-green-300 line-clamp-2 transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                         <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
       </div>
    </div>
  );
}