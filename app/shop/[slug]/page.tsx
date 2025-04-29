import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from "next/dynamic";
import { getProductSlugs, getProduct, getAllProductsInCollection } from "@/lib/shopifyProducts";
import { findSimilarProducts } from '@/lib/productUtils';
import { Product } from "@/shared/types/product";
import ProductSection from "@/shop/components/ProductSection";
const SimilarProducts = dynamic(() => import('@/shop/components/SimilarProducts'));

interface ProductPageParams {
  slug: string;
}

interface ProductPageProps {
  params: ProductPageParams;
}

// generateStaticParams: Defines which product slugs to pre-render
export async function generateStaticParams(): Promise<ProductPageParams[]> {
  try {
    const productSlugs = await getProductSlugs(); // Fetches [{ handle: '...' }]
    // console.log('[generateStaticParams shop/[slug]] Generating paths:', productSlugs.length);
    return productSlugs
      .filter(item => item && item.handle)
      .map((item) => ({
        slug: item.handle, // Ensure 'slug' matches the folder name [slug]
      }));
  } catch (error) {
    console.error("Failed to generate static params for products:", error);
    return [];
  }
}

// generateMetadata: Sets page title, description, openGraph tags etc.
export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const productHandle = params.slug;
  let productData: Product | null = null;

  // Return default Metadata if handle is invalid
  if (!productHandle || typeof productHandle !== 'string') {
       console.warn(`[generateMetadata shop/[slug]] Invalid handle: ${productHandle}.`);
       return { title: 'Invalid Product | Herbs & Potions' };
  }

  try {
    productData = await getProduct(productHandle);
  } catch (error) {
      console.error(`[generateMetadata shop/[slug]] Failed fetch for handle ${productHandle}:`, error);
      return { title: 'Error Loading Product | Herbs & Potions' };
  }

  // Return default Metadata if product not found
  if (!productData) {
     console.warn(`[generateMetadata shop/[slug]] Product not found for handle: ${productHandle}.`);
     return { title: 'Product Not Found | Herbs & Potions' };
  }

  // --- Metadata generation ---
  const title = `${productData.title || 'Product'} | Herbs & Potions`;
  const descriptionText = productData.descriptionHtml || productData.description || '';
  const cleanedDescription = descriptionText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const description = cleanedDescription.substring(0, 160) || 'Check out this product from Herbs & Potions.';
  const imageUrl = productData.images?.edges?.[0]?.node?.url;
  const imageAlt = productData.images?.edges?.[0]?.node?.altText ?? productData.title ?? 'Product image';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      ...(imageUrl && { images: [{ url: imageUrl, alt: imageAlt }], }),
    },
  };
}

// --- Page Component ---
export default async function ProductPage({ params }: ProductPageProps) {
  const productHandle = params.slug;
  // console.log(`[ProductPage shop/[slug]] Rendering for handle:`, productHandle);

  let currentProduct: Product | null | any = null; // Use 'any' temporarily if types are complex/evolving
  let allProducts: Product[] | any[] = [];
  let similarProducts: any[] = [];

  // Validate handle early
  if (!productHandle || typeof productHandle !== 'string') {
      console.error(`[ProductPage shop/[slug]] Invalid handle received: ${productHandle}.`);
      notFound();
  }

  try {
    // console.log(`[ProductPage shop/[slug]] Fetching current product and all products...`);
    [currentProduct, allProducts] = await Promise.all([
        getProduct(productHandle),
        getAllProductsInCollection() // Used for finding similar products
    ]);
    // console.log(`[ProductPage shop/[slug]] Fetched current product ID:`, currentProduct ? currentProduct.id : 'null');
    // console.log(`[ProductPage shop/[slug]] Fetched ${allProducts.length} total products for similarity check.`);

  } catch (error) {
    // console.error(`[ProductPage shop/[slug]] Failed fetching data for handle ${productHandle}:`, error);
    throw error;
  }

  if (!currentProduct) {
    // console.log(`[ProductPage shop/[slug]] Product not found for handle: ${productHandle}, triggering notFound()`);
    notFound();
  }

  try {
       similarProducts = findSimilarProducts(currentProduct, allProducts, 4); // Find up to 4 similar products
      //  console.log(`[ProductPage shop/[slug]] Found ${similarProducts.length} similar products.`);
  } catch (error) {
      // console.error("[ProductPage shop/[slug]] Error finding similar products:", error);
      similarProducts = [];
  }

  return (
    <div className="py-12 sm:pt-16 md:pt-20">
        <div className="max-w-6xl w-11/12 mx-auto">
           <ProductSection productData={currentProduct} />
           {similarProducts.length > 0 && (
               <SimilarProducts products={similarProducts} />
           )}

        </div>
    </div>
  );
}
