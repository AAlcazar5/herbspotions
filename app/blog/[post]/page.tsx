import { Metadata, ResolvingMetadata } from 'next';
import { getPost, getPostSlugs, getAllPosts } from "@/lib/shopifyPosts";
import PostDetails from "@/blog/components/PostDetails";
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Post } from '@/shared/types/blog';
import { findSimilarPosts } from '@/lib/blogUtils';

const SimilarPostsCarousel = dynamic(() => import('@/blog/components/SimilarPostsCarousel'), { ssr: false });

interface PostPageParams { post: string; }
interface PostPageProps { params: PostPageParams; }

export async function generateStaticParams(): Promise<PostPageParams[]> {
   try {
      const postSlugs = await getPostSlugs();
      return postSlugs.map(item => ({ post: item.handle }));
   } catch (error) {
       console.error("Failed to generate static params for posts:", error);
       return [];
   }
}

export async function generateMetadata( { params }: PostPageProps, parent: ResolvingMetadata ): Promise<Metadata> {
   const handle = params.post;
   if (!handle) return { title: 'Blog Post | Herbs & Potions' };
   const post = await getPost(handle);
   if (!post) { return { title: 'Post Not Found | Herbs & Potions' }; }
   const pageTitle = `${post.title || 'Blog Post'} | Herbs & Potions`;
   const pageDescription = post.excerpt || 'Read this blog post from Herbs & Potions.';
   const imageUrl = post.image?.url;
   return {
     title: pageTitle, description: pageDescription,
     openGraph: { title: pageTitle, description: pageDescription, type: 'article', publishedTime: post.publishedAt, authors: post.authorV2?.name ? [post.authorV2.name] : undefined, tags: post.tags ?? undefined, images: imageUrl ? [{ url: imageUrl, alt: post.image?.altText || post.title || 'Blog post image', }] : undefined, },
   };
}


export default async function PostPage({ params }: PostPageProps) {
  const { post: handle } = params;
  if (!handle) { notFound(); }

  let currentPost: Post | null = null;
  let allPosts: Post[] = [];
  let similarPosts: Post[] = [];

  try {
      [currentPost, allPosts] = await Promise.all([
          getPost(handle),
          getAllPosts()
      ]);
  } catch (error) {
      console.error(`[PostPage blog/[post]] Failed fetching data for handle ${handle}:`, error);
  }

  if (!currentPost) {
      console.error(`[PostPage blog/[post]] Post not found for handle: ${handle}, triggering notFound()`);
      notFound();
  }

  if (allPosts.length > 0 && currentPost) {
      try {
          similarPosts = findSimilarPosts(currentPost, allPosts, 4);
      } catch (error) {
          console.error("[PostPage blog/[post]] Error finding similar posts:", error);
          similarPosts = [];
      }
  }

  return (
    <div>
        <div className="min-h-screen py-12 sm:pt-20">
            <PostDetails postData={currentPost} />
        </div>

        {similarPosts.length > 0 && (
            <SimilarPostsCarousel posts={similarPosts} />
        )}
    </div>
  );
}