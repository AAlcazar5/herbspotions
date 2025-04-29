"use client";

import React, { useState, useEffect, useCallback, useMemo, FC } from "react";
import Link from 'next/link';
import parse, { domToReact, attributesToProps, HTMLReactParserOptions, Element as DOMElement, DOMNode } from 'html-react-parser';
import BackToProductButton from "@/shop/components/BackToProductButton";
import ProductInfo from "@/shop/components/ProductInfo";
import ProductForm from "@/shop/components/ProductForm";
import {
  ProductDetailsProps,
  VariantNode,
  VariantNodeData,
  ImageNode,
  PriceObject,
  BaseImageNode,
} from "@/shared/types/product";

const ProductDetails: FC<ProductDetailsProps> = ({ productData, className }) => {
  const [variantPrice, setVariantPrice] = useState<PriceObject | null>(null);
  const [openTab, setOpenTab] = useState<number>(1);
  const descriptionHtml = useMemo(() => {
    if (!productData) return "";
    return productData.descriptionHtml || productData.description || "";
  }, [productData]);

  const mainImage: ImageNode | undefined = useMemo(() => {
     if (!productData?.images?.edges?.[0]?.node) {
         return undefined;
     }
     const firstImageNodeData = productData.images.edges[0].node;

     if (firstImageNodeData.url || firstImageNodeData.originalSrc) {
         const node: BaseImageNode = {
              url: firstImageNodeData.url,
              altText: firstImageNodeData.altText || firstImageNodeData.alt || productData.title || "Product image",
              alt: firstImageNodeData.alt || firstImageNodeData.altText || productData.title || "Product image",
              id: firstImageNodeData.id,
              originalSrc: firstImageNodeData.originalSrc,
              width: firstImageNodeData.width,
              height: firstImageNodeData.height,
         };
         return { node: node };
     }
     return undefined;
   }, [productData]);

  const formattedVariants: VariantNode[] = useMemo(() => {
    if (!productData?.variants?.edges) return [];
    return productData.variants.edges
      .map((edge): VariantNode | null => {
        if (!edge?.node?.id) return null;
        const nodeData = edge.node;
        const newNodeData: VariantNodeData = {
          id: nodeData.id,
          title: nodeData.title ?? null,
          availableForSale: nodeData.availableForSale ?? true,
          selectedOptions: Array.isArray(nodeData.selectedOptions) ? nodeData.selectedOptions.map(opt => ({ name: opt?.name || 'Option', value: opt?.value || 'Default' })) : [], // Ensure options have name/value
          price: nodeData.price ? {
              amount: String(nodeData.price.amount ?? '0'),
              currencyCode: nodeData.price.currencyCode || 'USD'
          } : null,
        };
        return { node: newNodeData };
      })
      .filter((variant): variant is VariantNode => variant !== null);
  }, [productData]);

  useEffect(() => {
    const firstAvailableVariant = formattedVariants.find(v => v.node.availableForSale !== false);
    const initialVariant = firstAvailableVariant || formattedVariants[0];
    setVariantPrice(initialVariant?.node?.price ?? null);
  }, [formattedVariants]);

  const handleTabClick = useCallback((tabIndex: number) => {
      setOpenTab(tabIndex);
  }, []);

  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof DOMElement && domNode.attribs) {
        const props = attributesToProps(domNode.attribs);
        const className = typeof props.className === 'string' ? props.className : undefined;

        if (domNode.name === 'a' && props.href) {
          const href = props.href as string;
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
          const isInternal = href.startsWith('/') || (siteUrl && href.startsWith(siteUrl));
          const linkClassName = className || "text-green-500 dark:text-green-300 hover:underline";
          if (isInternal && !href.startsWith('#')) {
            delete props.target; delete props.rel;
            return <Link href={href} {...props} className={linkClassName}>{domToReact(domNode.children as DOMNode[], parserOptions)}</Link>;
          } else {
             if (!isInternal && !href.startsWith('#')) { props.target = '_blank'; props.rel = 'noopener noreferrer'; }
             return <a {...props} className={linkClassName}>{domToReact(domNode.children as DOMNode[], parserOptions)}</a>;
          }
        }

        if (domNode.name === 'img') {
             const src = typeof props.src === 'string' ? props.src : undefined;
             if (!src) return <></>;
             const alt = typeof props.alt === 'string' ? props.alt : 'Product description image';
             const width = props.width && typeof props.width === 'string' ? parseInt(props.width) : undefined;
             const height = props.height && typeof props.height === 'string' ? parseInt(props.height) : undefined;
             const imgClassName = className || "my-4 rounded-lg shadow-sm";
             return ( <img src={src} alt={alt} width={width} height={height} loading="lazy" className={imgClassName} /> );
        }

        if (domNode.name === 'blockquote') {
            const blockquoteClassName = className || "border-l-4 border-green-500 dark:border-green-300 text-muted-foreground dark:text-muted-foreground pl-4 italic my-6";
             return <blockquote {...props} className={blockquoteClassName}>{domToReact(domNode.children as DOMNode[], parserOptions)}</blockquote>;
        }
      }
    }
  };

  if (!productData || !productData.id) {
      return null;
  }

  const baseTabStyles = "font-bold uppercase px-5 py-3 shadow-lg rounded-t-md block w-full leading-normal cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const activeTabStyles = "bg-card text-foreground dark:bg-card dark:text-foreground border border-border dark:border-border border-b-0";
  const inactiveTabStyles = "bg-muted/50 text-muted-foreground hover:bg-muted dark:bg-gray-800 dark:text-muted-foreground dark:hover:bg-gray-900 border-b border-border dark:border-border";

  return (
    <div className={`flex flex-col gap-6 justify-start ${className}`}>
      <div className="mb-6">
         <BackToProductButton href="/shop" />
      </div>

      <ProductInfo
          title={productData.title}
          price={variantPrice}
          productData={productData}
      />

      {formattedVariants.length > 0 && productData.handle ? (
        <ProductForm
          className="mt-4"
          title={productData.title || ""}
          handle={productData.handle}
          variants={formattedVariants}
          mainImg={mainImage}
          setVariantPrice={setVariantPrice}
        />
      ) : (
         <div className="mt-4 p-4 border border-dashed border-border dark:border-border rounded-md text-center text-muted-foreground dark:text-muted-foreground">
            Product options are currently unavailable.
         </div>
      )}

      <div className="mt-8 w-full">
        <div className="flex mb-0 list-none flex-wrap pt-3 flex-row" role="tablist" >
          <div className="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <button type="button" className={`${baseTabStyles} ${openTab === 1 ? activeTabStyles : inactiveTabStyles}`} onClick={() => handleTabClick(1)} role="tab" id="tab-details" aria-controls="tabpanel-details" aria-selected={openTab === 1}> Details </button>
          </div>
        </div>

        <div className="relative flex flex-col min-w-0 break-words w-full mb-4 sm:mb-2 rounded-b-md shadow-lg border border-t-0 border-border dark:border-border bg-card dark:bg-card">
          <div className="px-4 py-5 flex-auto">
            <div className="tab-content tab-space">
              <div id="tabpanel-details" role="tabpanel" aria-labelledby="tab-details" className={openTab === 1 ? "block" : "hidden"} >
                <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none prose-img:rounded-lg prose-a:text-green-500 dark:prose-a:text-green-300 hover:prose-a:underline [&_p]:mb-6 [&_h1,_h2,_h3,_h4,_h5,_h6]:mb-4 [&_h1,_h2,_h3,_h4,_h5,_h6]:text-center [&_ul,_ol]:mb-6">
                  {parse(descriptionHtml || '', parserOptions)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;