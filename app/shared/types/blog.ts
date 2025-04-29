import { ParsedUrlQuery } from "querystring";

export interface ImageNode {
  id?: string | null;
  url?: string | null;
  altText?: string | null;
  alt?: string | null;
  originalSrc?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface Post {
  id: string;
  handle: string;
  title: string;
  image?: ImageNode | null;
  excerpt?: string | null;
  authorV2?: { name: string; } | null;
  contentHtml?: string | null;
  publishedAt: string;
  tags?: string[] | null;
  seo?: { title?: string | null; description?: string | null; } | null;
}


// --- Component Prop Interfaces ---
export interface PostCardProps {
  post: Post;
}

export interface PostDetailsProps {
  postData: Post | null;
}

export interface PostInfoProps {
  title?: string | null;
  contentHtml?: string | null;
  image?: ImageNode | null;
  publishedAt?: string | null;
  authorName?: string | null;
}

export interface PostListingsProps {
  posts: Post[];
}

export interface PostSectionProps {
  postData: Post | null;
}

export interface PostImageProps {
  images: { node: ImageNode | null; }[];
  className?: string;
}

export interface BackToPostButtonProps {
  className?: string;
  href?: string;
}

// --- Page-Level Types ---
export interface PostPageParams {
  post: string;
}

export interface PostParams extends ParsedUrlQuery {
  post?: string;
}