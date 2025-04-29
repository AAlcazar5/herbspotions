import { products } from './products';
import { collection as collectionTitle } from './shopifyUtils';

// Collection Query Types

interface ProductImageNode_Collection { node?: { alt?: string | null; image?: { url: string; }; }; }

interface ProductVariantEdge_Collection { node: { title: string; price: { amount: string; }; }; } 

interface ProductNodeData {
  id: string;
  title: string;
  handle: string;
  tags: string[] | null;
  description: string | null;
  media: { edges: { node?: { alt?: string | null; image?: { url: string; }; }; }[]; };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string; }; };
  variants: { edges: { node?: { title: string; price: { amount: string; }; }; }[]; };
  [key: string]: any; // Allow other properties potentially added by spread
}

interface ProductEdge_Collection {
  node: ProductNodeData | null;
}

interface CollectionResponseData {
  collection?: {
      id?: string;
      title?: string;
      handle?: string;
      products: {
          edges: ProductEdge_Collection[];
      };
  };
}


// Product Slugs Query Types

interface ProductSlugNode { node: { handle: string; }; }

interface ProductSlugsResponseData { collection?: { products: { edges: ProductSlugNode[]; }; }; }


// Single Product Query Types
interface Product_MediaImageNode { node?: { alt?: string | null; image?: { id: string; url: string; height: number; width: number; }; }; }
interface Product_VariantOption { name: string; value: string; }
interface Product_VariantNode_API {
    id: string; title: string; availableForSale?: boolean;
    price: { amount: string; currencyCode: string; };
    compareAtPrice?: { amount: string; currencyCode: string; } | null;
    selectedOptions: Product_VariantOption[] | null;
    image?: { id: string; url: string; altText: string; width: number; height: number; } | null;
    sku?: string;
    [key: string]: any;
}
interface ProductResponseData {
  product?: {
    id: string; title: string; handle: string; description: string; tags: string[] | null;
    media: { edges: Product_MediaImageNode[]; };
    seo: { title?: string | null; description?: string | null; } | null;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string; }; maxVariantPrice: { amount: string; currencyCode: string; }; } | null;
    variants: { edges: { node: Product_VariantNode_API }[]; };
    vendor?: string | null; productType?: string | null; descriptionHtml?: string | null;
    [key: string]: any;
  } | null;
}

// --- Cart API Interface Definitions ---

interface CartLineNodeData { id: string; quantity: number; merchandise: { id: string; }; }

interface ShopifyCartData { id: string; checkoutUrl: string; lines: { edges: { node: CartLineNodeData }[] } | null; cost?: { totalAmount: { amount: string; currencyCode: string; }; } | null; }

export interface CartLineAddInput { merchandiseId: string; quantity: number; } // Exported

export interface CartLineUpdateInput { id: string; quantity: number; merchandiseId?: string; } // Exported

interface CartCreateApiResponse { cartCreate?: { cart?: ShopifyCartData | null; userErrors: ShopifyError[]; } | null; }

interface CartLinesUpdateApiResponse { cartLinesUpdate?: { cart?: Pick<ShopifyCartData, 'id' | 'checkoutUrl'> | null; userErrors: ShopifyError[]; } | null; }

interface CartLinesAddApiResponse { cartLinesAdd?: { cart?: ShopifyCartData | null; userErrors: ShopifyError[]; } | null; }

// --- Exported Product Functions ---

export async function getAllProductsInCollection(): Promise<any[]> {

  // --- CORRECTED QUERY ---
  // Fetches tags and description at the product node level.
  const query = `
    query CollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        # id # Collection fields - typically not needed for the product list itself
        # title
        # handle
        products(first: 50) { # Fetch more products if needed
          edges {
            node {
              id
              title
              handle
              tags        # Tags for the product node
              description # Description for the product node
              media(first: 1) { # Fetch only the first media item for mapping simplicity
                edges {
                  node {
                    alt
                    ... on MediaImage {
                      image {
                        url
                        # id # Optional: if needed downstream
                        # width
                        # height
                      }
                    }
                  }
                }
              }
              priceRange { # Fetch min price range
                minVariantPrice {
                  amount
                  currencyCode
                }
                # maxVariantPrice { amount currencyCode } # Optional: Add if needed
              }
              variants(first: 10) { # Fetch basic variant info, adjust count if needed
                edges {
                  node {
                    title # Variant title (e.g., "Small", "250mg")
                    price { # Variant price
                      amount
                      # currencyCode # Optional: Usually same as minVariantPrice.currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { handle: collectionTitle };

  const response = await callShopify<CollectionResponseData>(query, variables);

  if (response?.data?.collection?.products?.edges) {
    const allProductsEdges = response.data.collection.products.edges;

    // --- RAW NODE LOGGING ---
    // try {
    //     console.log('\n\n🩺 === START: Logging RAW Product Nodes BEFORE Mapping (Corrected Query) === 🩺');
    //     allProductsEdges.forEach((edge, index) => {
    //       if (edge?.node) {
    //         console.log(`\n[Raw Node ${index} - ID: ${edge.node.id}] Full Data:`, JSON.stringify(edge.node, null, 2));
    //         // Check the tags directly from the API response data:
    //         console.log(`[Raw Node ${index} - ID: ${edge.node.id}] -> Tags Field Value from API:`, edge.node.tags);
    //       } else {
    //         console.log(`\n[Raw Node ${index}]: Invalid edge data`);
    //       }
    //     });
    //     console.log('\n🩺 === END: Logging RAW Product Nodes === 🩺\n\n');
    // } catch (logError) {
    //     console.error("Error during RAW node logging:", logError);
    // }
    // --- END RAW NODE LOGGING ---


    return allProductsEdges.map((product): any | null => { // Using any for return object type
      if (!product.node) return null;

      // Use spread to get base fields fetched by the query (id, title, handle, tags, description, media, priceRange, variants)
      const baseNodeData = { ...product.node };

      return {
        ...baseNodeData, // Spread fields fetched by the query

        altText: baseNodeData.media?.edges?.[0]?.node?.alt ?? null,
        images: {
          edges: baseNodeData.media?.edges?.map(edge => ({
            node: {
              // id: null,
              // originalSrc: (edge?.node as any)?.image?.url ?? undefined,
              url: (edge?.node as any)?.image?.url ?? undefined,
              // height: null,
              // width: null,
              altText: edge?.node?.alt ?? null, // Use alt from media node
              alt: edge?.node?.alt ?? null, // Use alt from media node
            },
          })) ?? []
        },

        // --- Ensure required fields exist, provide defaults if needed ---
        // 'tags' comes from baseNodeData - ensure it's an array
        tags: baseNodeData.tags ?? [],
        // 'description' comes from baseNodeData - ensure it's a string
        description: baseNodeData.description ?? "",

        // --- Explicitly set null/defaults ONLY for fields NOT fetched by the query ---
        seo: null,
        vendor: null,
        productType: null,
        descriptionHtml: baseNodeData.description || null, // Use description as fallback
      };
    }).filter(p => p !== null);
    
  } else { // API call failed or returned no data
    // console.warn(`Falling back to demo products for getAllProductsInCollection (collection: ${collectionTitle})`);

    // --- Demo Mapping Logic ---
    // IMPORTANT: Update products array with actual data (including tags)
    // AND THEN remove the 'tags: []' line below / use product.tags.
    return products.map((product) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      media: product.media, // Assuming demo structure matches
      altText: product.altText, // Assuming demo structure matches
      priceRange: product.priceRange, // Assuming demo structure matches
      variants: product.variants, // Assuming demo structure matches
      images: product.images ?? product.media?.edges?.map(edge => ({ node: { url: edge?.node?.image?.url, alt: edge?.node?.alt } })) ?? { edges: [] },
      description: product.description || "",
      tags: product.tags ?? [],
      seo: null, vendor: null, productType: null, descriptionHtml: null,
    }));
  }
}


export async function getProductSlugs(): Promise<{ handle: string }[]> {

// --- Original Query ---

const query = `

query GetProductSlugs($handle: String!) {

collection(handle: $handle) {

products(first: 50) { edges { node { handle } } }

}

}

`;

const variables = { handle: collectionTitle };

const response = await callShopify<ProductSlugsResponseData>(query, variables);

if (response?.data?.collection?.products?.edges) {

return response.data.collection.products.edges

.map((edge) => edge?.node)

.filter((node): node is { handle: string } => node != null && typeof node.handle === 'string');

} else {

// console.warn(`Falling back to demo product slugs (collection: ${collectionTitle})`);

return products

.filter(product => typeof product.handle === 'string')

.map((product) => ({ handle: product.handle }));

}

}

// Returns any | null 
export async function getProduct(handle: string): Promise<any | null> {

  // --- Demo Fallback on Invalid Handle ---
  if (!handle || typeof handle !== 'string' || handle.trim() === '') {
    // console.warn(`getProduct invalid handle: "${handle}". Falling back to demo.`);
    const product = products.find((p: any) => p.handle === handle);
    if (product) {
      return {
        // Base fields from demo data
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description || "",
        tags: product.tags ?? [],
        media: product.media,

        // Construct 'images' with { edges: [...] } from product.media
        images: {
             edges: product.media?.edges?.map((edge: any) => ({
                 node: {
                    id: null,
                    originalSrc: edge?.node?.image?.url,
                    url: edge?.node?.image?.url,
                    height: null, width: null,
                    altText: edge?.node?.alt ?? product.altText ?? product.title,
                    alt: edge?.node?.alt ?? product.altText ?? product.title,
                 }
             })) ?? []
        },

        // Construct 'variants' with { edges: [...] } structure
        variants: {
             edges: product.variants?.edges?.map((edge: any) => {
                 const demoNode = edge?.node;
                 const title = demoNode?.title ?? 'Default';
                 // Create a placeholder selectedOptions array since it's missing in demo source
                 const fallbackSelectedOptions = [{ name: 'Option', value: title }]; // Use generic name "Option"

                 return {
                     node: {
                        id: `demo-variant-${title.replace(/\s+/g, '-') ?? Math.random()}`,
                        title: title,
                        price: demoNode?.price ?? { amount: '0.00', currencyCode: 'USD' },
                        selectedOptions: fallbackSelectedOptions,
                        strength: title, // Derive strength directly from title as fallback
                        availableForSale: true, // Assume available
                        // Set other fields expected by components to null/defaults
                        compareAtPrice: null, sku: null, image: null,
                     }
                 };
             }) ?? [] // Default to empty edges array
        },

        priceRange: product.priceRange ?? null, // Use demo priceRange
        altText: product.altText ?? product.media?.edges?.[0]?.node?.alt ?? product.title,
        seo: product.seo ?? { title: product.title || null, description: (product.description || "").substring(0, 160) || null },
        descriptionHtml: product.descriptionHtml ?? (product.description || ""),
        vendor: product.vendor ?? null,
        productType: product.productType ?? null,
      };
    }
    return null;
  }

  // --- Query for getProduct (includes priceRange and selectedOptions) ---
  const query = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        id title handle description tags
        media(first: 10) { edges { node { alt ... on MediaImage { image { id url height width } } } } }
        priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
        variants(first: 25) { edges { node { id title availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } selectedOptions { name value } image { id url altText width height } } } }
        # seo { title description } # Add other fields if needed
      }
    }
  `;

  const variables = { handle: handle };
  const response = await callShopify<ProductResponseData>(query, variables);

  // --- API Response Handling ---
  if (response?.data?.product) {
    const productData = response.data.product;

    return {
        ...productData, // includes variants with selectedOptions from API
        images: { edges: productData.media?.edges?.map(({ node }) => ({ node: { id: node?.image?.id ?? null, originalSrc: node?.image?.url ?? undefined, url: node?.image?.url ?? undefined, height: node?.image?.height ?? null, width: node?.image?.width ?? null, altText: node?.alt ?? productData.title ?? null, alt: node?.alt ?? productData.title ?? null, }, })) ?? [] },
        // Refine variants mapping slightly for consistency with demo fallback's derived fields
        variants: {
            edges: productData.variants?.edges?.map(({ node }) => ({
                node: {
                    ...node, // Spread original node (includes selectedOptions from API)
                    // Derive strength from actual selectedOptions
                    strength: node?.selectedOptions?.find((option) => option.name === "Strength")?.value || node.title || null, // Fallback to title if needed
                }
            })) ?? []
        },
        priceRange: productData.priceRange ?? null,
        altText: productData.media?.edges?.[0]?.node?.alt ?? productData.title ?? null,
        descriptionHtml: (productData as any).descriptionHtml ?? productData.description ?? "",
        seo: productData.seo ?? null,
        vendor: (productData as any).vendor ?? null,
        productType: (productData as any).productType ?? null,
    };

  } else { // API call failed or product not found
    // console.warn(`Falling back to demo products for getProduct (handle: ${handle}) - API failed or product not found`);
    const product = products.find((p: any) => p.handle === handle);
    if (product) {
       return {
         id: product.id, title: product.title, handle: product.handle,
         description: product.description || "",
         tags: product.tags ?? [],
         media: product.media,
         images: { edges: product.media?.edges?.map((edge: any) => ({ node: { id: null, originalSrc: edge?.node?.image?.url, url: edge?.node?.image?.url, height: null, width: null, altText: edge?.node?.alt ?? product.altText, alt: edge?.node?.alt ?? product.altText } })) ?? [] },
         variants: { edges: product.variants?.edges?.map((edge: any) => { const demoNode=edge?.node; const title=demoNode?.title??'Default'; return { node: { id: `demo-variant-${title.replace(/\s+/g, '-')??Math.random()}`, title: title, price: demoNode?.price??{amount:'0.00',currencyCode:'USD'}, selectedOptions: [{name:'Option', value:title}], strength: title, availableForSale: true, compareAtPrice:null, sku:null, image:null } }; }) ?? [] },
         priceRange: product.priceRange ?? null,
         altText: product.altText ?? product.media?.edges?.[0]?.node?.alt ?? product.title,
         seo: product.seo ?? { title: product.title || null, description: (product.description || "").substring(0, 160) || null },
         descriptionHtml: product.descriptionHtml ?? (product.description || ""),
         vendor: product.vendor ?? null,
         productType: product.productType ?? null,
       };
       // --- END REFINED Demo Fallback Logic ---
    }
    return null; // Demo product also not found
  }
}



// --- Exported Checkout/Cart Functions ---


// Returns ShopifyCartData or errors or null

export async function createShopifyCheckout(

variantId: string,

quantity: number | string

): Promise<{ cart?: ShopifyCartData | null, userErrors?: ShopifyError[] } | null> {

// if (!variantId) { console.error("createShopifyCheckout: variantId required."); return null; }

const numQuantity = Number(quantity); if (isNaN(numQuantity) || numQuantity <= 0) { console.warn(`Invalid quantity ${quantity}`); return null; }


const query = `

mutation cartCreate($input: CartInput!) {

cartCreate(input: $input) {

cart {

id checkoutUrl

lines(first: 10) { edges { node { id quantity merchandise { ... on ProductVariant { id } } } } }

cost { totalAmount { amount currencyCode } }

}

userErrors { message field }

}

}

`;

const variables = { input: { lines: [{ quantity: numQuantity, merchandiseId: variantId }] } };

const response = await callShopify<CartCreateApiResponse>(query, variables);


// if (!response) { console.error("createShopifyCheckout: API call failed."); return null; }

const cartData = response?.data?.cartCreate;


if (cartData?.userErrors && cartData.userErrors.length > 0) {

console.warn("Shopify checkout creation failed with userErrors:", cartData.userErrors);

return { userErrors: cartData.userErrors }; // Return errors

} else if (cartData?.cart?.id && cartData.cart.checkoutUrl) {

// console.log(`[shopifyProducts] Created Shopify Cart ID: ${cartData.cart.id}.`);

// console.log('[shopifyProducts] createShopifyCheckout returning cart:', JSON.stringify(cartData.cart, null, 2));

return { cart: cartData.cart }; // Return cart object

} else {

console.error("Shopify checkout creation failed for unknown reason. Response:", response);

return { userErrors: [{ message: "Unknown error creating cart." }] };

}

}


// Returns boolean

export async function updateShopifyCheckout(cartId: string, lineItems: CartLineUpdateInput[]): Promise<boolean> {

if (!cartId || !lineItems || lineItems.length === 0) { console.error("updateShopifyCheckout: invalid args."); return false; }

// Updated Query

const query = `

mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {

cartLinesUpdate(cartId: $cartId, lines: $lines) {

cart { id checkoutUrl } # Fetch minimal fields

userErrors { message field }

}

}

`;

const variables = { cartId: cartId, lines: lineItems.map((item) => ({ id: item.id, quantity: Number(item.quantity) })) };

const response = await callShopify<CartLinesUpdateApiResponse>(query, variables);

if (response?.data?.cartLinesUpdate?.cart) { console.log(`Updated Shopify Cart ID: ${cartId}`); return true; }

else { console.warn("Shopify checkout update failed.", response?.data?.cartLinesUpdate?.userErrors); return false; }

}


// Returns cart fragment or errors object or null

export async function addShopifyCartLines(cartId: string, lines: CartLineAddInput[]): Promise<{ cart?: ShopifyCartData | null, userErrors?: ShopifyError[] } | null> {

if (!cartId || !lines || lines.length === 0) { console.error("addShopifyCartLines: invalid args."); return null; }

// Query using static integer

const query = `

mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {

cartLinesAdd(cartId: $cartId, lines: $lines) {

cart {

id checkoutUrl cost { totalAmount { amount currencyCode } }

lines(last: 10) { # Use static number

edges {

node {

id quantity

merchandise { ... on ProductVariant { id } }

}

}

}

}

userErrors { message field }

}

}

`;

const variables = { cartId: cartId, lines: lines.map(line => ({...line, quantity: Number(line.quantity)})) };

const response = await callShopify<CartLinesAddApiResponse>(query, variables);

const responseData = response?.data?.cartLinesAdd;

if (responseData?.userErrors && responseData.userErrors.length > 0) { console.error("Shopify cartLinesAdd failed:", responseData.userErrors); return { userErrors: responseData.userErrors }; }

else if (responseData?.cart) { console.log(`[shopifyProducts] addShopifyCartLines returning cart lines:`, JSON.stringify(responseData.cart.lines, null, 2)); return { cart: responseData.cart }; }

else { console.error("Unknown error adding cart lines. Response:", response); return null; }

}


import { Post, ImageNode as PostImageNode } from '@/shared/types/blog';

import { posts } from './posts';


import { callShopify, blogHandle, ShopifyError } from './shopifyUtils';


// --- Interfaces for API Responses (Post Specific - Internal) ---

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



// --- Mapper (Post Specific) ---

// Helper to map API/Demo post data to the shared Post type

function mapPostData(

postSource: Blog_ArticleNodeApi | typeof posts[0] | null | undefined

): Post | null {

if (!postSource) return null;


const image: PostImageNode | null = postSource.image?.url ? {

url: postSource.image.url,

altText: postSource.image.altText ?? null,

id: postSource.image.id ?? null,

// Map other BaseImageNode properties if needed

alt: postSource.image.altText ?? null, // Add alt fallback

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



// --- Exported Blog Post Functions ---


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

// console.warn(`Falling back to demo data for getAllPosts (blog: ${blogHandle})`);

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

// console.warn(`Falling back to demo data for getPostSlugs (blog: ${blogHandle})`);

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

const variables = { blogHandle: blogHandle, articleHandle: handle };

const response = await callShopify<SinglePostDataApi>(query, variables);

const postNode = response?.data?.blog?.articleByHandle;


if (postNode) {

// console.log(`[getPost] Found post via API: ${postNode.id}`);

return mapPostData(postNode);

} else {

// console.warn(`[getPost] API did not return post for handle: ${handle}. Falling back to demo posts.`);

const post = posts.find((post) => post.handle === handle);

if (post) {

// console.log(`[getPost] Found demo post for handle: ${handle}`);

return mapPostData(post);

}

// console.error(`[getPost] No post found in API or Demo for handle: ${handle}`);

return null;

}

} 