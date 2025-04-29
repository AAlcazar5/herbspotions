import { getAllProductsInCollection } from "@/lib/shopifyProducts";
import dynamic from "next/dynamic";
import { Product } from "@/shared/types/product";
import { Metadata } from 'next';
import { filterProductsBySingleTag } from '@/lib/productUtils';

const ShopFilterableList = dynamic(() =>
  import("@/shop/components/ShopFilterableList"),
  { ssr: false }
);

const AVAILABLE_TAGS = ["Tinctures", "Creams", "Capsules", "Edibles", "Pet"];

export const metadata: Metadata = {
  title: `Shop CBD & THC Products | Herbs & Potions`,
  description: `Browse and filter Herbs & Potions's CBD and THC-8 products by category: Tinctures, Creams, Capsules, Edibles, and Pet products.`,
};

async function getProducts(): Promise<Product[]> {
  try {
    const products = await getAllProductsInCollection();
    return (products || []).map((p: any) => ({ ...p, tags: p.tags ?? [] }));
  } catch (error) {
    console.error("Error fetching products for Shop Page:", error);
    return [];
  }
}

interface ShopPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const currentTag = typeof searchParams?.tag === 'string' ? searchParams.tag : '';

  const allProducts = await getProducts();

  const filteredProducts = filterProductsBySingleTag(allProducts, currentTag);

  const displayTag = AVAILABLE_TAGS.find(t => t.toLowerCase() === currentTag.toLowerCase()) || currentTag;
  const pageTitle = displayTag ? `${displayTag} 🌿🧪` : 'All Products 🌿🧪';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="flex justify-center items-center text-center uppercase tracking-wide mx-auto max-w-6xl mb-8 sm:mb-10 text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">
        {pageTitle}
      </h1>

      <ShopFilterableList
          availableTags={AVAILABLE_TAGS}
          currentTag={currentTag}
          products={filteredProducts}
      />

    </div>
  );
}