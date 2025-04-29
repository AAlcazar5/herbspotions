import { Post, ImageNode as PostImageNode } from '@/shared/types/blog';
import { posts } from './posts';
import { callShopify, blogHandle } from './shopifyUtils';

interface Blog_ImageNode { url: string; altText?: string | null; id?: string; }
interface Blog_AuthorNode { name: string; }
interface Blog_SeoNode { title?: string | null; description?: string | null; }
interface Blog_ArticleNodeApi {
    authorV2?: Blog_AuthorNode | null; contentHtml?: string | null; excerpt?: string | null;
    handle: string; id: string; image?: Blog_ImageNode | null; publishedAt: string;
    tags?: string[] | null; title: string; seo?: Blog_SeoNode | null;
}
interface BlogArticleEdgeApi { node: Blog_ArticleNodeApi | null; }
interface AllPostsData { blog?: { articles: { edges: BlogArticleEdgeApi[] | null } } | null; articles?: { edges: BlogArticleEdgeApi[] | null } | null; }
interface PostSlugsDataApi { blog?: { articles: { edges: { node: { handle: string } | null }[] | null } } | null; }
interface SinglePostDataApi { blog?: { articleByHandle?: Blog_ArticleNodeApi | null } | null; }


function mapPostData(
    postSource: Blog_ArticleNodeApi | typeof posts[0] | null | undefined
): Post | null {
     if (!postSource) return null;

     const image: PostImageNode | null = postSource.image?.url ? {
        url: postSource.image.url,
        altText: postSource.image.altText ?? null,
        id: postSource.image.id ?? null,
        alt: postSource.image.altText ?? null,
     } : null;

     const seo = ('seo' in postSource && postSource.seo)
                ? { title: postSource.seo?.title ?? null, description: postSource.seo?.description ?? null }
                : { title: postSource.title, description: postSource.excerpt ?? '' };

     const mappedPost: Post = {
         id: postSource.id, handle: postSource.handle, title: postSource.title,
         authorV2: postSource.authorV2 ?? { name: 'Unknown Author' },
         contentHtml: postSource.contentHtml ?? '', excerpt: postSource.excerpt ?? '',
         image: image, publishedAt: postSource.publishedAt, tags: postSource.tags ?? [], seo: seo,
     };
     return mappedPost;
}

export async function getAllPosts(): Promise<Post[]> {
  const query = `
    query GetBlogPosts($handle: String!) {
      blog(handle: $handle) {
        articles(first: 50, sortKey: PUBLISHED_AT, reverse: true) { edges { node {
          authorV2 { name } contentHtml excerpt handle id
          image { url altText id } publishedAt tags title
          seo { title description }
        } } }
      }
    }
  `;
  const variables = { handle: blogHandle };
  const response = await callShopify<AllPostsData>(query, variables);
  const edges = response?.data?.blog?.articles?.edges ?? response?.data?.articles?.edges;

  if (edges) {
    return edges.map(edge => mapPostData(edge?.node)).filter((post): post is Post => post !== null);
  } else {
    console.warn(`Falling back to demo data for getAllPosts (blog: ${blogHandle})`);
    return posts.map(post => mapPostData(post)).filter((post): post is Post => post !== null);
  }
}

export async function getPostSlugs(): Promise<{ handle: string }[]> {
  const query = `
    query GetPostSlugs($handle: String!) {
      blog(handle: $handle) {
        articles(first: 100) { edges { node { handle } } }
      }
    }
  `;
  const variables = { handle: blogHandle };
  const response = await callShopify<PostSlugsDataApi>(query, variables);
  const edges = response?.data?.blog?.articles?.edges;

  if (edges) {
     return edges.map(edge => edge?.node).filter((node): node is { handle: string } => node != null && typeof node.handle === 'string');
  } else {
    console.warn(`Falling back to demo data for getPostSlugs (blog: ${blogHandle})`);
    return posts.filter(p => typeof p.handle === 'string').map(p => ({ handle: p.handle }));
  }
}

export async function getPost(handle: string): Promise<Post | null> {
   if (!handle || typeof handle !== 'string' || handle.trim() === '') {
        console.warn(`getPost called with invalid handle: "${handle}". Attempting demo fallback.`);
        const post = posts.find((post) => post.handle === handle);
        return mapPostData(post);
    }

  // console.log(`[getPost] Fetching post with handle: ${handle}`);
  const query = `
    query GetPostByHandle($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        articleByHandle(handle: $articleHandle) {
          authorV2 { name } contentHtml excerpt handle id
          image { url altText id } publishedAt tags title
          seo { title description }
        }
      }
    }
  `;
  const variables = { blogHandle: blogHandle, articleHandle: handle }; // Use imported blog handle
  const response = await callShopify<SinglePostDataApi>(query, variables);
  const postNode = response?.data?.blog?.articleByHandle;

  if (postNode) {
      //  console.log(`[getPost] Found post via API: ${postNode.id}`);
       return mapPostData(postNode);
  } else {
    console.warn(`[getPost] API did not return post for handle: ${handle}. Falling back to demo posts.`);
    const post = posts.find((post) => post.handle === handle);
     if (post) {
        //  console.log(`[getPost] Found demo post for handle: ${handle}`);
         return mapPostData(post);
     }
     console.error(`[getPost] No post found in API or Demo for handle: ${handle}`);
    return null;
  }
}