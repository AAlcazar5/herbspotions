export interface CartItem {
    id: number;
    variantId: string;
    variantQuantity: number | string; // Context allows string | number
    productHandle: string;
    productTitle: string;
    variantTitle: string;
    productImage?: {
      originalSrc?: string;
      altText?: string;
    };
    variantPrice?: { // Expects object or undefined, with properties string | undefined
      amount?: string;
      currencyCode?: string;
    };
    shopifyLineItemId?: string;
  }

  export interface CartTableProps {
    cart: CartItem[];
  }

  export interface PriceData {
    num: number | { amount?: string | number; currencyCode?: string } | string | null | undefined;
    numSize?: string;
    currency?: string;
    currencyCode?: string;
    className?: string;
  }