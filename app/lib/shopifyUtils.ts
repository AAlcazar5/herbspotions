export const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
export const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN;
export const collection = process.env.NEXT_PUBLIC_SHOPIFY_COLLECTION || 'frontpage';
export const blogHandle = process.env.NEXT_PUBLIC_SHOPIFY_BLOG_HANDLE || 'blog';

export function getShopifyApiVersion(): string {
  return '2025-04';
}

interface ShopifyErrorLocation { line: number; column: number; }
export interface ShopifyError { message: string; locations?: ShopifyErrorLocation[]; path?: string[]; extensions?: any; }
export interface CallShopifyResponse<T = any> { data?: T; errors?: ShopifyError[]; extensions?: any; }

export async function callShopify<T = any>(
    query: string,
    variables: Record<string, any> = {}
): Promise<CallShopifyResponse<T> | null> {
  const apiVersion = getShopifyApiVersion();
  const fetchUrl = `https://${domain}/api/${apiVersion}/graphql.json`;

  // ========================================
  // ADD DEBUG LOGGING HERE
  // ========================================
  // console.log('\n--- [callShopify] Debug Info ---');
  // console.log(`[callShopify] Storefront Access Token from env: ${storefrontAccessToken ? '***' + storefrontAccessToken.slice(-6) : 'TOKEN NOT FOUND or EMPTY'}`); // Log only last 6 chars for security
  // console.log(`[callShopify] Domain from env: ${domain ?? 'DOMAIN NOT FOUND or EMPTY'}`);
  // console.log(`[callShopify] Fetch URL: ${fetchUrl}`);
  // ========================================


  if (!domain || !storefrontAccessToken) {
      // console.error("Shopify domain or access token is missing. Check environment variables.");
      return null;
  }

  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  };

  // ========================================
  // Log the actual headers object being used
  // console.log('[callShopify] Headers object being sent:', JSON.stringify(headers, null, 2));
  // console.log('--- End Debug Info ---\n');
  // ========================================


  const fetchOptions: RequestInit = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query, variables }),
      cache: 'no-store'
  };

  try {
    const response = await fetch(fetchUrl, fetchOptions);
    // console.log(`callShopify Status: ${response.status} for URL: ${fetchUrl.split('?')[0]} (Cache: no-store)`);
    if (!response.ok) {
        // const errorBody = await response.text();
        // console.error(`callShopify Error: Status ${response.status}. Body: ${errorBody}`);
        return null;
    }
    const result = await response.json() as CallShopifyResponse<T>;
    // if (result.errors) {
    //     console.warn("callShopify GraphQL Errors:", JSON.stringify(result.errors, null, 2));
    // }
    // console.log('[callShopify] Returning result:', JSON.stringify(result, null, 2)); // Optional: log full result before return
    return result;
  } catch (error) {
    // console.error("callShopify Fetch Exception:", error);
    return null;
  }
}