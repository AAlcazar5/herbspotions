import { Product } from "@/shared/types/product"; // Adjust path if needed

// --- Basic Type Definition (used by findSimilarProducts) ---
interface BasicProduct {
  id: string;
  tags?: string[] | null;
  [key: string]: any; // Allow other properties
}

// --- Filter Functions (Moved from filterUtils & Renamed) ---

/**
 * Filters an array of products based on a single selected tag.
 * @param items - Array of Product objects
 * @param selectedTag - Tag string (case-insensitive) or empty string for no filter.
 * @returns Filtered array of Product objects.
 */
export function filterProductsBySingleTag(items: Product[] | BasicProduct[], selectedTag: string): any[] {
  if (!selectedTag) {
    return items;
  }
  const lowerSelectedTag = selectedTag.toLowerCase();
  return items.filter(item => {
    if (!Array.isArray(item.tags) || item.tags.length === 0) {
      return false;
    }
    const lowerItemTags = item.tags.map(tag => String(tag).toLowerCase());
    return lowerItemTags.includes(lowerSelectedTag);
  });
}

/**
 * Filters an array of products based on multiple selected tags.
 * @param items - Array of Product objects.
 * @param selectedTags - Array of tag strings (case-insensitive).
 * @returns Filtered array of Product objects matching ALL selected tags.
 */
export function filterProductsByTags(items: Product[] | BasicProduct[], selectedTags: string[]): any[] {
    if (!selectedTags || selectedTags.length === 0) { return items; }
    const lowerSelectedTags = selectedTags.map(tag => tag.toLowerCase());
    return items.filter(item => {
      if (!Array.isArray(item.tags) || item.tags.length === 0) { return false; }
      const lowerItemTags = item.tags.map(tag => String(tag).toLowerCase());
      return lowerSelectedTags.every(selectedTag =>
        lowerItemTags.includes(selectedTag)
      );
    });
}

// --- Similarity Function ---

/**
 * Finds similar products based on specific Pet tag rules, excluding the current product.
 */
export function findSimilarProducts(
    currentProduct: BasicProduct | null,
    allProducts: BasicProduct[],
    maxResults: number = 4
): BasicProduct[] {
    if (!currentProduct?.id || !Array.isArray(allProducts) || allProducts.length === 0) {
        return [];
    }

    const currentProductId = currentProduct.id;
    const currentProductTagsLower = (currentProduct.tags ?? []).map((t: string) => t.toLowerCase());
    const isCurrentProductPet = currentProductTagsLower.includes('pet');

    // console.log(`[findSimilarProducts] Current product (${currentProduct.id}) is Pet? ${isCurrentProductPet}`); // Optional Debug

    const petFilteredCandidates = allProducts.filter(p => {
        if (!p?.id || p.id === currentProductId) return false;
        const tagsLower = (p.tags ?? []).map((t: string) => t.toLowerCase());
        const isCandidatePet = tagsLower.includes('pet');
        return isCurrentProductPet ? isCandidatePet : !isCandidatePet;
    });
    // console.log(`[findSimilarProducts] Found ${petFilteredCandidates.length} candidates after Pet rule filter.`); // Optional Debug

    let similarProducts: BasicProduct[] = [];

    if (isCurrentProductPet) {
        similarProducts = petFilteredCandidates;
        // console.log(`[findSimilarProducts] Recommending other Pet products.`); // Optional Debug
    } else {
        if (currentProductTagsLower.length > 0) {
            similarProducts = petFilteredCandidates.filter((p) => {
                const candidateTagsLower = (p.tags ?? []).map((t: string) => t.toLowerCase());
                return candidateTagsLower.some((tag: string) => currentProductTagsLower.includes(tag));
            });
            // console.log(`[findSimilarProducts] Found ${similarProducts.length} non-Pet products by shared tag.`); // Optional Debug
        }
        if (similarProducts.length < maxResults) {
            const existingIds = new Set(similarProducts.map(p => p.id));
            const fallback = petFilteredCandidates.filter(p => !existingIds.has(p.id));
            // console.log(`[findSimilarProducts] Adding ${Math.min(fallback.length, maxResults - similarProducts.length)} fallback non-Pet products.`); // Optional Debug
            similarProducts = [...similarProducts, ...fallback];
        }
    }
    return similarProducts.slice(0, maxResults);
}