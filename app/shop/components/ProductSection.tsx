import React from 'react';
import ProductInteractiveArea from "@/shop/components/ProductInteractiveArea";
import ProductDescriptionArea from "@/shop/components/ProductDescriptionArea";
import ProductImage from "@/shop/components/ProductImage";
import {
    ProductSectionProps,
    ProductImageNode,
    BaseImageNode
} from "@/shared/types/product";
import { FC } from "react";

const ProductSection: FC<ProductSectionProps> = ({ productData }) => {
  const productImageNodes: ProductImageNode[] | undefined = productData?.images?.edges
    ?.map((imageEdge): ProductImageNode | null => {
         if (!imageEdge?.node) return null;
         const apiNode = imageEdge.node;
         const baseNode: BaseImageNode = { id: apiNode.id ?? null, url: apiNode.url ?? null, originalSrc: apiNode.originalSrc ?? apiNode.url ?? null, altText: apiNode.altText ?? apiNode.alt ?? "", alt: apiNode.alt ?? apiNode.altText ?? "", width: apiNode.width ?? null, height: apiNode.height ?? null, };
         if (!baseNode.url && !baseNode.originalSrc) { return null; }
         return { node: baseNode };
    })
    .filter((item): item is ProductImageNode => item !== null);

  const descriptionHtml = productData?.descriptionHtml || productData?.description || "";


  if (!productData) {
      return <div className="text-center p-10 text-muted-foreground dark:text-muted-foreground">Loading product data...</div>;
  }

  return (
    <section aria-labelledby={`product-heading-${productData.id}`} className="bg-background dark:bg-background pb-6 sm:pb-8 md:pb-10 lg:pb-12 mx-auto max-w-screen-xl px-4 md:px-8">
       <h2 id={`product-heading-${productData.id}`} className="sr-only">Product options and details for {productData.title}</h2>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-8 md:mb-12">

         <div className="md:py-8 flex flex-col">
           <div className="w-full">
             {productImageNodes && productImageNodes.length > 0 ? (
                 <ProductImage
                     images={productImageNodes}
                     className="w-full h-auto object-contain rounded-md shadow-lg"
                 />
             ) : (
                  <div className="w-full aspect-square max-h-[500px] md:max-h-[600px] bg-muted dark:bg-muted flex items-center justify-center rounded-md shadow-lg border border-border dark:border-border">
                     <span className="text-muted-foreground dark:text-muted-foreground">Image Coming Soon</span>
                  </div>
             )}
           </div>
         </div>

         <div className="md:py-8 flex flex-col">
           <ProductInteractiveArea productData={productData} className="flex-grow" />
         </div>

       </div>


       {descriptionHtml && (
            <div className="mt-8 md:mt-12 bg-card dark:bg-card rounded-lg shadow-md overflow-hidden border border-border dark:border-border">
                <ProductDescriptionArea descriptionHtml={descriptionHtml} />
            </div>
       )}

    </section>
  );
}

export default ProductSection;