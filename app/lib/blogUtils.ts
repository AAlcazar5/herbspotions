import { Post } from "@/shared/types/blog";

const CONCEPTUAL_TAG_MAP: Record<string, string[]> = {
   "CBD Basics": ["beginner's guide", "what is cbd", "cbd education", "cbd myths", "cbd guide", "cbd information", "cbd vs thc", "ecs", "endocannabinoid system", "hemp", "cannabinoids", "cbd types", "understanding cbd facts", "broadspectrumcbd", "cbdisolate", "fullspectrumcbd", "legal cbd", "cbd isolate drug test", "broad spectrum cbd drug test"],
   "CBD Benefits": ["cbd benefits", "potential benefits", "wellness", "body balance", "cbd for anxiety", "cbd for inflammation", "cbd for pain", "cbd for sleep", "cbd for stress", "recovery", "benefits of cbd for pets", "benefits of cbd topicals", "benefits of self-care", "mental wellness", "cbd and well-being"],
   "How to Use CBD": ["cbd dosage", "how much cbd", "how to use", "daily cbd", "cbd recipes", "cbd oil", "cbd tincture", "cbd edibles", "cbd gummies", "cbd topicals", "cbd capsules", "sublingual cbd", "start low go slow", "incorporating cbd", "cooking with cbd", "cbd drinks", "cbd snacks", "cbd oil dosage", "cbd gummies dosage", "cbd edibles dosage", "best time to take cbd", "cbd at night", "cbd habits", "cbd in the morning", "daily cbd routine", "using cbd regularly", "cbd for self-care", "enhancing self-care", "nighttime cbd routine", "types of cbd oil", "how to use cbd oil", "how to use cbd tincture", "cbd product potency", "cbd lotion", "cbd salve", "cbd balm"],
   "CBD Science": ["ecs", "endocannabinoid system", "entourage effect", "cannabinoids", "terpenes", "cbd science", "cbd studies", "research on cbd", "minor cannabinoids", "howcbdworks", "cannabinoid synergy", "cbg benefits", "cbn benefits", "cbc benefits", "anandamide", "homeostasis", "thc in cbd"],
   "CBD for Pets": ["pet", "pets", "cbd for dogs", "cbd for cats", "vet cbd", "cbd for pet anxiety", "cbd for pet mobility", "cbd for pet pain", "best cbd for pets", "is cbd safe for pets", "pet cbd dosage", "thc and pets", "benefits of cbd for pets", "cbd for pets future"],
   "Legality & Testing": ["cbd travel laws", "cbd travel regulations", "flying with cbd", "international cbd travel", "interstate cbd travel", "legal cbd travel", "traveling with cbd", "traveling with hemp products", "cbd and drug test", "cbd positive drug test", "will cbd show up on a drug test", "cbd regulations", "legal cbd"]
};

for (const key in CONCEPTUAL_TAG_MAP) {
   CONCEPTUAL_TAG_MAP[key] = CONCEPTUAL_TAG_MAP[key].map(t => t.toLowerCase());
}

export function filterPostsByConceptualTag(items: Post[], selectedConcept: string): Post[] {
     if (!selectedConcept) { return items; }
     const targetTags = CONCEPTUAL_TAG_MAP[selectedConcept];
     if (!targetTags) { console.warn(`Unknown conceptual tag: ${selectedConcept}`); return []; }
     return items.filter(item => {
       if (!Array.isArray(item.tags) || item.tags.length === 0) return false;
       const lowerItemTags = item.tags.map(tag => String(tag).toLowerCase());
       return lowerItemTags.some(itemTag => targetTags.includes(itemTag));
     });
}

/**
 * Determines the conceptual categories a post belongs to.
 * @param post The post object with a tags array.
 * @returns An array of conceptual category names.
 */
function getPostConcepts(post: Post | null): string[] {
    if (!post || !Array.isArray(post.tags) || post.tags.length === 0) {
        return [];
    }
    const postTagsLower = post.tags.map((t: string) => String(t).toLowerCase());
    const concepts: string[] = [];
    for (const [concept, targetTags] of Object.entries(CONCEPTUAL_TAG_MAP)) {
        if (postTagsLower.some(itemTag => targetTags.includes(itemTag))) {
            concepts.push(concept);
        }
    }
    return concepts;
}

/**
 * Finds similar posts based on shared conceptual categories.
 * @param currentPost The post being viewed.
 * @param allPosts Array of all posts.
 * @param maxResults Max number of similar posts.
 * @returns Array of similar posts.
 */
export function findSimilarPosts(
    currentPost: Post | null,
    allPosts: Post[],
    maxResults: number = 4
): Post[] {
    if (!currentPost?.id || !Array.isArray(allPosts) || allPosts.length === 0) {
        return [];
    }

    const currentPostId = currentPost.id;
    const currentConcepts = getPostConcepts(currentPost);

    if (currentConcepts.length === 0) {
        // console.log(`[findSimilarPosts] Current post ${currentPostId} has no matching concepts.`);
        return allPosts.filter(p => p.id !== currentPostId).slice(0, maxResults);
    }
    // console.log(`[findSimilarPosts] Current post concepts: ${currentConcepts.join(', ')}`);

    const similar = allPosts.filter(p => {
        if (!p?.id || p.id === currentPostId) {
            return false;
        }
        const postConcepts = getPostConcepts(p);
        return postConcepts.some(concept => currentConcepts.includes(concept));
    });

    // console.log(`[findSimilarPosts] Found ${similar.length} posts sharing concepts.`);
    return similar.slice(0, maxResults);
}
