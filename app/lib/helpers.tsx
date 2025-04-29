import { callShopify } from "./shopifyUtils";
import type { CartItem } from "@/shared/context/StoreContext";

interface CreateShopifyCheckoutResponse {
  id: string;
  webUrl: string;
  lines: {
    edges: {
      node: {
        id: string;
      };
    }[];
  };
}

export async function createShopifyCheckout(
  variantId: string,
  quantity: number
): Promise<CreateShopifyCheckoutResponse | null> {
  try {
    const response = await callShopify(
      `
      mutation CartCreate($input: CartInput) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            lines(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
          userErrors {
            message
          }
        }
      }
      `,
      {
        input: {
          lines: [{ quantity: quantity, merchandiseId: variantId }],
        },
      }
    );

    if (!response) {
      // console.error("callShopify returned null during checkout creation.");
      return null;
    }

    if (response?.data?.cartCreate?.userErrors?.length > 0) {
      // console.error("Error creating checkout:", response.data.cartCreate.userErrors);
      return null;
    }

    return {
      id: response.data.cartCreate.cart.id,
      webUrl: response.data.cartCreate.cart.checkoutUrl,
      lines: response.data.cartCreate.cart.lines,
    };
  } catch (error) {
    // console.error("Error creating checkout:", error);
    return null;
  }
}

export async function updateShopifyCheckout(
  cart: CartItem[],
  checkoutId: string
): Promise<boolean> {
  try {
    const lineItems = cart.map((item) => ({
      id: item.shopifyLineItemId!,
      quantity: Number(item.variantQuantity),
    }));

    const response = await callShopify(
      `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
          }
          userErrors {
            message
          }
        }
      }
      `,
      {
        cartId: checkoutId,
        lines: lineItems,
      }
    );

    if (!response) {
      // console.error("callShopify returned null during checkout update.");
      return false;
    }

    if (response?.data?.cartLinesUpdate?.userErrors?.length > 0) {
      // console.error("Error updating checkout:", response.data.cartLinesUpdate.userErrors);
      return false;
    }

    return true;
  } catch (error) {
    // console.error("Error updating checkout:", error);
    return false;
  }
}

export const getLocalData = (): { cart: CartItem[]; checkoutId: string | null; checkoutUrl: string | null } => {
  if (typeof window !== 'undefined') {
    const localData = localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_STORAGE_NAME || 'shopify_storefront');
    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        return {
          cart: (parsedData.cart as CartItem[]) || [],
          checkoutId: parsedData.checkoutId || null,
          checkoutUrl: parsedData.checkoutUrl || null,
        };
      } catch (error) {
        // console.error("Error parsing local storage data:", error);
        return { cart: [], checkoutId: null, checkoutUrl: null };
      }
    }
  }
  return { cart: [], checkoutId: null, checkoutUrl: null };
};

export const setLocalData = (
  cart: CartItem[],
  checkoutId: string | null,
  checkoutUrl: string | null
) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      process.env.NEXT_PUBLIC_LOCAL_STORAGE_NAME || 'shopify_storefront',
      JSON.stringify({ cart, checkoutId, checkoutUrl })
    );
  }
};

export const clearLocalData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(process.env.NEXT_PUBLIC_LOCAL_STORAGE_NAME || 'shopify_storefront');
  }
};