"use client";

import React, { useState, useRef, useEffect, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { PostImageProps, ImageNode } from "@/shared/types/blog";

const PostImage: FC<PostImageProps> = ({ images = [], className = '' }) => {

  const findFirstValidNode = (imgArray: { node: ImageNode | null }[]): ImageNode | null => {
      for (const img of imgArray) {
          if (img?.node && (img.node.url || img.node.originalSrc)) {
              return img.node;
          }
      }
      return null;
  };

  const initialMainImgNode = findFirstValidNode(images);
  const [mainImg, setMainImg] = useState<ImageNode | null>(initialMainImgNode);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     setMainImg(findFirstValidNode(images));
  }, [images]);

  const scroll = (scrollOffset: number) => {
    scrollContainerRef.current?.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  };

  const handleThumbnailClick = (imageNode: ImageNode | null) => {
      if (imageNode) {
          setMainImg(imageNode);
      }
  }

  const mainImageUrl = mainImg?.originalSrc || mainImg?.url || "";
  const mainImageAlt = mainImg?.altText || mainImg?.alt || "Main post image";

  if (!initialMainImgNode) {
      return (
         <div className={`w-full md:w-1/2 max-w-md border border-border dark:border-border bg-muted dark:bg-muted rounded-md shadow-lg flex items-center justify-center h-96 ${className}`}>
            <span className="text-muted-foreground dark:text-muted-foreground">No Image Available</span>
         </div>
      );
  }


  return (
    <div className={`w-full md:w-1/2 max-w-md border border-border dark:border-border bg-background dark:bg-background rounded-md shadow-lg flex flex-col overflow-hidden ${className}`}>
      <div className="relative h-96 overflow-hidden">
        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={mainImageAlt}
            className="object-cover w-full h-full absolute top-0 left-0 transition-transform duration-300 ease-in-out hover:scale-105"
            width={mainImg?.width || 800}
            height={mainImg?.height || 800}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted dark:bg-muted flex items-center justify-center">
              <span className="text-muted-foreground dark:text-muted-foreground">Image unavailable</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
          <div className="relative flex items-center border-t border-border dark:border-border h-32 flex-shrink-0 bg-background dark:bg-background">
            <button
              aria-label="Scroll left"
              className="h-full px-2 bg-background/80 dark:bg-background/80 hover:bg-muted dark:hover:bg-gray-800 absolute left-0 z-10 opacity-75 hover:opacity-100 focus:outline-none transition-colors"
              onClick={() => scroll(-300)}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-3 text-green-500 dark:text-green-300" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex space-x-1 w-full h-full overflow-x-auto scroll-smooth px-10"
            >
              {images.map((imgItem, index) => {
                  const node = imgItem?.node;
                  const thumbnailUrl = node?.originalSrc || node?.url || null;
                  const thumbnailAlt = node?.altText || node?.alt || `Thumbnail ${index + 1}`;
                  if (!node || !thumbnailUrl) return null;
                  const isSelected = (mainImg?.originalSrc || mainImg?.url) === thumbnailUrl;

                  const selectedClasses = 'ring-2 ring-green-500 dark:ring-green-300 opacity-100';
                  const idleClasses = 'opacity-70 hover:opacity-100 focus:opacity-100';

                  return (
                    <button
                      key={thumbnailUrl || index}
                      className={`relative w-40 h-full flex-shrink-0 rounded-sm overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-ring transition-all duration-150 ${
                          isSelected ? selectedClasses : idleClasses
                      }`}
                      onClick={() => handleThumbnailClick(node)}
                    >
                      <img
                        src={thumbnailUrl}
                        alt={thumbnailAlt}
                        className="object-cover w-full h-full absolute top-0 left-0"
                        width={160}
                        height={128}
                        loading="lazy"
                      />
                    </button>
                  );
              })}
            </div>

            <button
              aria-label="Scroll right"
              className="h-full px-2 bg-background/80 dark:bg-background/80 hover:bg-muted dark:hover:bg-gray-800 absolute right-0 z-10 opacity-75 hover:opacity-100 focus:outline-none transition-colors"
              onClick={() => scroll(300)}
            >
              <FontAwesomeIcon icon={faArrowRight} className="w-3 text-green-500 dark:text-green-300" />
            </button>
          </div>
      )}
    </div>
  );
};

export default PostImage;