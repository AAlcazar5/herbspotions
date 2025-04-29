import dynamic from "next/dynamic";
import { Metadata } from 'next';
import { getAllPosts } from "@/lib/shopifyPosts";
import { Post } from "@/shared/types/blog";
import { filterPostsByConceptualTag } from '@/lib/blogUtils';

const BlogFilterableList = dynamic(() =>
  import("@/blog/components/BlogFilterableList"),
  { ssr: false }
);

const AVAILABLE_BLOG_FILTER_CONCEPTS = ["CBD Basics", "CBD Benefits", "How to Use CBD", "CBD Science", "CBD for Pets"];

export const metadata: Metadata = {
  title: `Blog | Herbs & Potions`,
  description: "Learn about CBD, cannabis science, usage, benefits, pets, and more on the Herbs & Potions blog.",
};

async function getPosts(): Promise<Post[]> {
  try {
    const posts = await getAllPosts();
    return (posts || []).map((p: any) => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] }));
  } catch (error) {
    console.error("Error fetching posts for Blog Page:", error);
    return [];
  }
}

interface BlogPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentConceptTag = typeof searchParams?.tag === 'string' ? searchParams.tag : '';

  const allPosts = await getPosts();

  const filteredPosts = filterPostsByConceptualTag(allPosts, currentConceptTag);

  const displayTag = AVAILABLE_BLOG_FILTER_CONCEPTS.find(t => t === currentConceptTag) || '';
  const pageTitle = displayTag ? `Blog Posts - ${displayTag} 📚` : 'All Blog Posts 📚📗📖';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="flex justify-center items-center text-center uppercase tracking-wide mx-auto max-w-6xl mb-8 sm:mb-10 text-2xl sm:text-3xl font-semibold text-foreground dark:text-foreground">
        {pageTitle}
      </h1>

      <BlogFilterableList
          availableTags={AVAILABLE_BLOG_FILTER_CONCEPTS}
          currentTag={currentConceptTag}
          posts={filteredPosts}
      />
    </div>
  );
}