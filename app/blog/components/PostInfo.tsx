"use client";

import { PostInfoProps } from "@/shared/types/blog";
import React from 'react';
import Script from 'next/script';
import Link from 'next/link';
import parse, { domToReact, attributesToProps, HTMLReactParserOptions, Element as DOMElement, DOMNode } from 'html-react-parser';

function formatDate(dateString?: string | null): string {
    if (!dateString) return '';
    try {
        return new Date(dateString).toISOString();
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
    }
}

export default function PostInfo({ title, contentHtml, image, publishedAt, authorName }: PostInfoProps) {
  const imageUrl = image?.url ?? image?.originalSrc ?? null;
  const imageAlt = image?.altText ?? image?.alt ?? title ?? 'Blog post header image';

  const jsonLdData = {
      "@context": "https://schema.org", "@type": "BlogPosting",
      "headline": title || "Untitled Blog Post",
      "image": imageUrl ? [imageUrl] : undefined,
      "datePublished": publishedAt ? formatDate(publishedAt) : undefined,
      ...(authorName && { "author": { "@type": "Person", "name": authorName } }),
      "publisher": { "@type": "Organization", "name": "Herbs & Potions" },
  };

  const jsonLdString = JSON.stringify(jsonLdData);


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
            return <a target="_blank" rel="noopener noreferrer" {...props} className={linkClassName}>{domToReact(domNode.children as DOMNode[], parserOptions)}</a>;
          }
        }

        if (domNode.name === 'img') {
             const src = typeof props.src === 'string' ? props.src : undefined;
             if (!src) return <></>;
             const alt = typeof props.alt === 'string' ? props.alt : 'Blog post image';
             const width = props.width && typeof props.width === 'string' ? parseInt(props.width) : undefined;
             const height = props.height && typeof props.height === 'string' ? parseInt(props.height) : undefined;
             const imgClassName = className || "my-4 rounded-lg shadow-sm"; // Use theme radius
             return ( <img src={src} alt={alt} width={width} height={height} loading="lazy" className={imgClassName} /> );
        }

        if (domNode.name === 'blockquote') {
             const blockquoteClassName = className || "border-l-4 border-green-500 dark:border-green-300 pl-4 italic my-6 text-muted-foreground dark:text-muted-foreground";
             return <blockquote {...props} className={blockquoteClassName}>{domToReact(domNode.children as DOMNode[], parserOptions)}</blockquote>;
        }
      }
    }
  };

  return (
    <>
      <Script
          id="post-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
      >
          {jsonLdString}
      </Script>

      <div className="flex flex-col items-center w-full max-w-prose mx-auto">
        <h1 className="leading-tight font-extrabold text-3xl md:text-4xl text-green-500 dark:text-green-300 py-2 sm:py-4 mb-2 w-full text-center">
          {title || "Blog Post Title"}
        </h1>
         <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground dark:text-muted-foreground mb-6 border-b border-border dark:border-border pb-4 w-full">
            {authorName && <span>By {authorName}</span>}
        </div>
        <div className="relative w-full mb-6 sm:mb-8">
          <div className="w-full aspect-video relative overflow-hidden rounded-lg shadow-md bg-muted dark:bg-muted">
            {imageUrl ? ( <img src={imageUrl} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover object-center" loading="eager"/> )
             : ( <div className="w-full h-full flex justify-center items-center text-muted-foreground dark:text-muted-foreground"><span>Placeholder Image</span></div> )}
          </div>
        </div>

        <div className="w-full">
          <div className="prose prose-md sm:prose-lg dark:prose-invert max-w-none prose-img:rounded-lg prose-a:text-green-500 dark:prose-a:text-green-300 hover:prose-a:underline [&_p]:mb-6 [&_h1,_h2,_h3,_h4,_h5,_h6]:mb-4 [&_h1,_h2,_h3,_h4,_h5,_h6]:text-center [&_ul,_ol]:mb-6">
             {parse(contentHtml || '', parserOptions)}
          </div>
        </div>
      </div>
    </>
  );
}