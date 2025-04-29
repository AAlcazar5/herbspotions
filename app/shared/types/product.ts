import React from 'react';
import { ParsedUrlQuery } from "querystring";

// --- Core Product & Related Types ---

export interface FeaturedProduct {
  name: string;
  href: string;
  imageSrc: string;
  altText: string;
}

export interface BaseImageNode {
  id?: string | null;
  url?: string | null;
  originalSrc?: string | null;
  altText?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ImageEdge {
  node?: BaseImageNode | null;
}

export interface SelectedOption {
  name?: string | null;
  value?: string | null;
}

export interface PriceObject {
  amount?: string | null;
  currencyCode?: string | null;
}

export interface VariantNodeData {
  id: string;
  title?: string | null;
  availableForSale?: boolean | null;
  selectedOptions?: SelectedOption[] | null;
  price?: PriceObject | null;
  strength?: string | number | null;
}

export interface VariantNode {
    node: VariantNodeData;
}

export interface ProductVariantEdge {
  node?: VariantNodeData | null;
}

export interface ProductMediaEdge {
  node?: {
    alt?: string | null;
    image?: {
      id?: string | null;
      url?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
  } | null;
}

export interface Product {
  id: string;
  handle?: string | null;
  title?: string | null;
  description?: string | null;
  descriptionHtml?: string | null;
  tags?: string[] | null;
  vendor?: string | null;
  productType?: string | null;
  media?: { edges?: (ProductMediaEdge | null)[] | null; } | null;
  images?: { edges?: (ImageEdge | null)[] | null; } | null;
  variants?: { edges?: (ProductVariantEdge | null)[] | null; } | null;
  priceRange?: { minVariantPrice?: PriceObject | null; maxVariantPrice?: PriceObject | null; } | null;
  seo?: { title?: string | null; description?: string | null; } | null;
}


// --- Component Prop Interfaces ---

export interface BackToProductButtonProps {
  className?: string;
  href?: string;
}

// Moved from CheckoutButton.tsx
export interface CheckOutButtonProps {
  webUrl: string;
  className?: string;
  disabled?: boolean;
}

export interface ProductImageProps {
  images?: (ImageEdge | ProductImageNode | null)[] | null;
  className?: string;
}
export interface ProductImageNode {
    node?: BaseImageNode | null;
}

export interface ProductDetailsProps {
  productData: Product | null;
  className?: string;
}

export interface ProductInfoProps {
  title?: string | null;
  price: PriceObject | null;
  productData?: Product | null;
}

export interface ProductFormProps {
  className?: string;
  title: string;
  handle: string;
  variants: VariantNode[];
  mainImg?: ImageNode | undefined;
  setVariantPrice: React.Dispatch<React.SetStateAction<PriceObject | null>>;
}
export type ImageNode = { node?: BaseImageNode | null };

export interface ProductCardProps {
  product: Product;
}

export interface ProductListingsProps {
  products: Product[];
}

export interface ProductSectionProps {
  productData: Product | null;
}


// --- Page-Level Types ---

export interface ProductPageParams {
  slug: string;
}

export interface ProductParams extends ParsedUrlQuery {
  product?: string;
}