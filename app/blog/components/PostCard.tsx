import Link from 'next/link';
import React from "react";
import { PostCardProps } from '@/shared/types/blog';

function PostCard({ post }: PostCardProps) {

  const handle = post?.handle || '';
  const title = post?.title || 'Untitled Post';
  const imageNode = post?.image;
  const excerpt = post?.excerpt || '';
  const imageUrl = imageNode?.url ?? imageNode?.originalSrc ?? '/placeholder-image.png';
  const imageAlt = imageNode?.altText ?? imageNode?.alt ?? title;

  if (!handle || !title) {
     console.warn("PostCard received invalid post data (missing handle or title):", post);
     return null;
  }

  return (
    <Link href={`/blog/${handle}`} className="block group" aria-label={`Read more about ${title}`}>
      <div className="flex flex-col md:flex-row mx-auto my-8 border border-border dark:border-border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-card dark:bg-card cursor-pointer">

          {imageUrl !== '/placeholder-image.png' ? (
            <div className="relative w-full aspect-[3/2] md:w-48 md:aspect-square md:mx-0 flex-shrink-0 overflow-hidden bg-muted dark:bg-muted">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ) : (
             <div className="w-full aspect-[3/2] md:w-48 md:aspect-square md:mx-0 flex-shrink-0 bg-muted dark:bg-muted flex items-center justify-center text-muted-foreground dark:text-muted-foreground text-sm">
                 <span>No Image</span>
             </div>
          )}

          <div className="flex flex-col justify-between p-4 leading-normal flex-grow">
              <div>
                  <h2 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-foreground  group-hover:text-green-500 dark:text-green-300 dark:group-hover:text-white transition-colors line-clamp-2">
                      {title}
                  </h2>
                  <p className="mb-3 font-normal text-muted-foreground dark:text-muted-foreground line-clamp-3">
                      {excerpt}
                  </p>
              </div>
              <span className="text-sm font-medium text-green-500 dark:text-green-300 group-hover:underline mt-2 self-start">
                  Read More &rarr;
              </span>
          </div>
      </div>
    </Link>
  );
}

export default PostCard;