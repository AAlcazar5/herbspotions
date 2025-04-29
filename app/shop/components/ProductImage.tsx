"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faExpand } from "@fortawesome/free-solid-svg-icons";
import {
  ProductImageProps,
  BaseImageNode,
} from "@/shared/types/product";
import { cn } from "@/lib/utils";

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

const getGradientClass = (seed?: string | null): string => {
    const safeSeed = typeof seed === 'string' ? seed : '';
    const index = (safeSeed.length + 1) % gradientClasses.length;
    return gradientClasses[index] || 'bg-muted dark:bg-muted';
};


function ProductImage({ images, className }: ProductImageProps) {
  const imageArray = images ?? [];

  const getImageUrl = useCallback((imageNode?: BaseImageNode | null): string | null => {
    if (!imageNode) return null;
    return imageNode.originalSrc || imageNode.url || null;
  }, []);

  const getAltText = useCallback((imageNode?: BaseImageNode | null): string => {
    if (!imageNode) return "Product image";
    return imageNode.altText || imageNode.alt || "Product image";
  }, []);

   const initialMainImgNode = useMemo(() => {
     return (images ?? []).find(img => img?.node && getImageUrl(img.node))?.node || null;
   }, [images, getImageUrl]);


  const [mainImg, setMainImg] = useState<BaseImageNode | null>(initialMainImgNode);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     setMainImg(initialMainImgNode);
  }, [initialMainImgNode]);

  const handleThumbnailClick = useCallback((imageNode: BaseImageNode | null) => {
    if (imageNode) { setMainImg(imageNode); }
  }, []);

  const scrollThumbnails = useCallback((scrollOffset: number) => {
    thumbnailContainerRef.current?.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  }, []);

  const openZoomModal = useCallback(() => {
      if (mainImg && getImageUrl(mainImg)) { setIsZoomModalOpen(true); }
  }, [mainImg, getImageUrl]);

  const closeZoomModal = useCallback(() => { setIsZoomModalOpen(false); }, []);

   useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isZoomModalOpen) { closeZoomModal(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomModalOpen, closeZoomModal]);

  const backgroundGradientClass = useMemo(() => {
    const seed = initialMainImgNode?.altText || initialMainImgNode?.id || '';
    return getGradientClass(seed);
  }, [initialMainImgNode]);

  if (imageArray.length === 0 || !initialMainImgNode) {
    return (
      <div className={cn(`w-full h-[400px] border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-md shadow-lg flex justify-center items-center`, className)}>
        <span className="text-gray-500 dark:text-gray-400">No Images Available</span>
      </div>
    );
  }

  const currentMainImageUrl = getImageUrl(mainImg);
  const currentMainImageAlt = getAltText(mainImg);

  return (
    <div className={cn(`w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-lg flex flex-col overflow-hidden`, className)}>
      <div className={cn(`relative flex-grow w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center`, backgroundGradientClass)}>
        {currentMainImageUrl ? (
          <button onClick={openZoomModal} className="relative block cursor-pointer w-full h-full focus:outline-none group">
            <img
              src={currentMainImageUrl}
              alt={currentMainImageAlt}
              className="object-contain w-full h-full max-h-[65vh]"
              width={mainImg?.width || 800}
              height={mainImg?.height || 800}
              loading="eager"
              fetchPriority="high"
            />
             <div className="absolute top-2 right-2 p-2 bg-black bg-opacity-40 rounded-full text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200">
                 <FontAwesomeIcon icon={faExpand} className="w-4 h-4" />
             </div>
          </button>
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-100 dark:bg-gray-800">
            <span className="text-gray-400">Image unavailable</span>
          </div>
        )}
      </div>

      {imageArray.length > 1 && (
          <div className="relative flex items-center border-t border-gray-200 dark:border-gray-700 h-24 md:h-28 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50 p-2">
            <button aria-label="Scroll thumbnails left" className="absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent dark:from-gray-800/50 dark:via-gray-800/80 dark:to-transparent flex items-center justify-center text-gray-700 dark:text-gray-300 opacity-75 hover:opacity-100 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => scrollThumbnails(-150)}>
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            </button>
            <div ref={thumbnailContainerRef} className="flex space-x-2 w-full h-full overflow-x-auto scroll-smooth px-8 snap-x snap-mandatory">
              {imageArray.map((imgItem, index) => {
                if (!imgItem?.node) return null;
                const node = imgItem.node;
                const thumbnailUrl = getImageUrl(node);
                const thumbnailAlt = getAltText(node);
                if (!thumbnailUrl) return null;
                const mainImgIdentifier = mainImg ? getImageUrl(mainImg) : null;
                const thumbIdentifier = thumbnailUrl;
                const isSelected = mainImgIdentifier === thumbIdentifier;
                const selectedClasses = 'ring-2 ring-primary dark:ring-primary opacity-100';
                const idleClasses = 'border border-gray-300 dark:border-gray-600 opacity-70 hover:opacity-100 focus:opacity-100';
                return (
                  <button
                    key={thumbIdentifier || index}
                    className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-1 snap-start transition-all duration-150 ${ isSelected ? selectedClasses : idleClasses }`}
                    onClick={() => handleThumbnailClick(node)}
                    aria-label={`View image ${index + 1}`}
                    aria-current={isSelected ? 'true' : 'false'}
                  >
                    <img src={thumbnailUrl} alt={thumbnailAlt} className="object-cover w-full h-full" width={100} height={100} loading="lazy" />
                  </button>
                );
              })}
            </div>
            <button aria-label="Scroll thumbnails right" className="absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent dark:from-gray-800/50 dark:via-gray-800/80 dark:to-transparent flex items-center justify-center text-gray-700 dark:text-gray-300 opacity-75 hover:opacity-100 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => scrollThumbnails(150)}>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
            </button>
          </div>
      )}


      {isZoomModalOpen && currentMainImageUrl && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={closeZoomModal} role="dialog" aria-modal="true" aria-label="Zoomed product image">
              <button onClick={closeZoomModal} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-[10000]" aria-label="Close zoom view">&times;</button>
              <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                   <img
                      src={currentMainImageUrl}
                      alt={`Zoomed view: ${currentMainImageAlt}`}
                      className="block max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-xl"
                      width={mainImg?.width ? mainImg.width * 1.5 : 1200}
                      height={mainImg?.height ? mainImg.height * 1.5 : 1200}
                    />
              </div>
          </div>
      )}

    </div>
  );
}

export default ProductImage;