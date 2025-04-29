import { getProductSlugs } from "@/lib/shopifyProducts";
import { getPostSlugs } from "@/lib/shopifyPosts";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";

interface SitemapLink {
  url: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  lastmod?: string;
}

interface ProductSlug {
  handle: string;
}

interface PostSlug {
  handle: string;
}

async function generateSitemapXml(req: NextRequest): Promise<string> {
  const links: SitemapLink[] = [];
  const baseUrl = `https://${req.headers.get('host') || process.env.VERCEL_URL || 'localhost:3000'}`; // Added fallback hosts

  const [productSlugs, postSlugs] = await Promise.all([
    getProductSlugs(),
    getPostSlugs(),
  ]);

  productSlugs.forEach((product: ProductSlug) => {
    links.push({
      url: `${baseUrl}/products/${product.handle}`,
      changefreq: "daily",
      priority: 0.9,
    });
  });

  postSlugs.forEach((post: PostSlug) => {
    links.push({
      url: `${baseUrl}/posts/${post.handle}`,
      changefreq: "daily",
      priority: 0.7,
    });
  });

  const pages = [
      "/age-modal", "/blog", "/cart", "/cats", "/contact", "/fallback", "/faq",
      "/forgot-password", "/", "/log-in", "/log-out", "/privacy", // Use / instead of /index
      "/profile-edit", "/profile", "/request-success", "/return-request",
      "/returns", "/shop", "/sign-up", "/terms",
  ];
  pages.forEach((url) => {
    links.push({
        url: `${baseUrl}${url}`,
        changefreq: "weekly",
        priority: 0.8
    });
  });

  const stream = new SitemapStream({ hostname: baseUrl });
  const readable = Readable.from(links); // Directly pass mapped objects if including lastmod etc.
  readable.pipe(stream);
  const sitemapXml = await streamToPromise(stream).then((data) => data.toString());

  return sitemapXml;
}

export async function GET(req: NextRequest) {
  try {
    const sitemapXml = await generateSitemapXml(req);
    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "s-maxage=86400, stale-while-revalidate", // 24 hour cache
        },
    });

  } catch (error: unknown) {
    console.error("Failed to generate sitemap:", error);
    const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap: ${errorMessage}</error>`;
    return new NextResponse(errorXml, {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    });
  }
}