"use client";

import React, { useState, useCallback, FC } from 'react';
import Link from 'next/link';
import parse, { domToReact, attributesToProps, HTMLReactParserOptions, Element as DOMElement, DOMNode } from 'html-react-parser';
import { cn } from "@/lib/utils";

interface ProductDescriptionAreaProps {
     descriptionHtml: string;
     className?: string;
}

const ProductDescriptionArea: FC<ProductDescriptionAreaProps> = ({ descriptionHtml, className }) => {
    const [openTab, setOpenTab] = useState<number>(1);

    const handleTabClick = useCallback((tabIndex: number) => {
        setOpenTab(tabIndex);
    }, []);

     const parserOptions: HTMLReactParserOptions = {
        replace: (domNode) => {
        if (domNode instanceof DOMElement && domNode.attribs) {
            const props = attributesToProps(domNode.attribs);
            const nodeClassName = typeof props.className === 'string' ? props.className : undefined;

            if (domNode.name === 'a' && props.href) {
            const href = props.href as string;
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
            const isInternal = href.startsWith('/') || (siteUrl && href.startsWith(siteUrl));
            const linkClassName = nodeClassName || "text-green-500 dark:text-green-300 hover:underline";
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
                const imgClassName = nodeClassName || "my-4 rounded-lg shadow-sm";
                return ( <img src={src} alt={alt} width={width} height={height} loading="lazy" className={imgClassName} /> );
            }

             if (domNode.name === 'blockquote') {
                const blockquoteClassName = nodeClassName || "border-l-4 border-green-500 dark:border-green-300 text-muted-foreground dark:text-muted-foreground pl-4 italic my-6";
                return <blockquote {...props} className={blockquoteClassName}>{domToReact(domNode.children as DOMNode[], parserOptions)}</blockquote>;
             }
        }
        }
    };


    const baseTabStyles = "font-bold uppercase px-5 py-3 rounded-t-md block w-full leading-normal cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
    const activeTabStyles = "text-green-500 dark:text-green-300 border-b-2 border-green-500 dark:border-green-300";
    const inactiveTabStyles = "text-muted-foreground hover:text-foreground dark:hover:text-white border-b-2 border-transparent";


    return (
        <div className={cn("w-full", className)}>
            <div className="flex list-none flex-wrap flex-row border-b border-border dark:border-border" role="tablist">
              <div className="flex-auto text-center">
                <button
                  type="button"
                  className={`${baseTabStyles} ${openTab === 1 ? activeTabStyles : inactiveTabStyles}`}
                  onClick={() => handleTabClick(1)}
                  role="tab"
                  id="tab-details"
                  aria-controls="tabpanel-details"
                  aria-selected={openTab === 1}
                >
                  Details
                </button>
              </div>
            </div>

            <div className="relative flex flex-col min-w-0 break-words w-full">
              <div className="px-4 py-5 flex-auto">
                <div className="tab-content tab-space">
                  <div id="tabpanel-details" role="tabpanel" aria-labelledby="tab-details" className={openTab === 1 ? "block" : "hidden"}>
                    <div className={cn(
                        "prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none",
                        "[&_h3]:text-green-500 dark:[&_h3]:text-green-300",
                        "[&_h4]:text-green-500 dark:[&_h4]:text-green-300",
                        "prose-a:text-green-500 dark:prose-a:text-green-300 hover:prose-a:underline",
                        "[&_blockquote]:border-green-500 dark:[&_blockquote]:border-green-300"
                    )}>
                      {parse(descriptionHtml || '', parserOptions)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    );
};

export default ProductDescriptionArea;