"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// --- START: Imports for Live Shopify Shop (Commented Out) ---
/*
import {
    createShopifyCheckout,
    updateShopifyCheckout,
    addShopifyCartLines,
    CartLineUpdateInput,
    CartLineAddInput
} from "@/lib/shopifyProducts";
*/
// --- END: Imports for Live Shopify Shop ---
import type { CartItem as LocalCartItem } from "@/shared/types/cart";

export interface CartItem extends LocalCartItem {
  shopifyLineItemId?: string;
}

// Updated context type for Demo (cart, isLoading)
type CartContextType = [CartItem[], boolean] | undefined;
// Original context type for Shopify (includes checkoutUrl)
// type CartContextType = [CartItem[], string, boolean] | undefined; // [cart, checkoutUrl, isLoading]

type AddToCartContextType = ((newItem: LocalCartItem) => Promise<void>) | undefined;
type UpdateCartQuantityContextType = ((variantId: string | number, quantity: number | string) => Promise<void>) | undefined;

const CartContext = createContext<CartContextType>(undefined);
const AddToCartContext = createContext<AddToCartContextType>(undefined);
const UpdateCartQuantityContext = createContext<UpdateCartQuantityContextType>(undefined);

export function useCartContext(): [CartItem[], boolean] {
    const ctx = useContext(CartContext);
    if (ctx === undefined) throw new Error("useCartContext must be used within a CartProvider");
    return ctx;
}
export function useAddToCartContext(): (newItem: LocalCartItem) => Promise<void> {
    const ctx = useContext(AddToCartContext);
    if (ctx === undefined) throw new Error("useAddToCartContext must be used within a CartProvider");
    return ctx;
}
export function useUpdateCartQuantityContext(): (variantId: string | number, quantity: number | string) => Promise<void> {
    const ctx = useContext(UpdateCartQuantityContext);
    if (ctx === undefined) throw new Error("useUpdateCartQuantityContext must be used within a CartProvider");
    return ctx;
}

export interface CartProviderProps { children: ReactNode; }

export function CartProvider({ children }: CartProviderProps): React.JSX.Element {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- START: State for Live Shopify Shop (Commented Out) ---
  /*
  const [checkoutId, setCheckoutId] = useState<string>("");
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  */
  // --- END: State for Live Shopify Shop ---

  // --- START: Logic for Demo Purposes (LocalStorage Only) ---
  const demoStorageKey = process.env.NEXT_PUBLIC_LOCAL_STORAGE_NAME || 'shopify_cart_demo';

  const getLocalDataDemo = (): { cart: CartItem[] } => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem(demoStorageKey);
      if (localData) {
        try {
          const d = JSON.parse(localData);
          return { cart: Array.isArray(d.cart) ? d.cart : [] };
        } catch (e) { console.error("Error parsing local storage (Demo):", e); }
      }
    }
    return { cart: [] };
  };

  useEffect(() => {
    const localData = getLocalDataDemo();
    setCart(localData.cart || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const onReceiveMessage = (e: StorageEvent) => {
      if (e.key === demoStorageKey && e.newValue) {
        try {
            const parsedData = JSON.parse(e.newValue);
            setCart(Array.isArray(parsedData.cart) ? parsedData.cart : []);
        } catch(error){ console.error("Error parsing storage event data (Demo):", error); }
      }
    };
    window.addEventListener("storage", onReceiveMessage);
    return () => window.removeEventListener("storage", onReceiveMessage);
  }, []);

  const saveLocalDataDemo = (currentCart: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        demoStorageKey,
        JSON.stringify({ cart: currentCart })
      );
    }
  };

  async function addToCartDemo(newItem: LocalCartItem): Promise<void> {
    setIsLoading(true);
    if (!newItem?.variantId) {
      console.error("addToCartDemo: newItem missing variantId.");
      setIsLoading(false);
      return;
    }
    const quantityToAdd = Math.max(1, Number(newItem.variantQuantity) || 1);
    let newCartState: CartItem[] = [];
    setCart(currentCart => {
        const existingCartItemIndex = currentCart.findIndex(item => item.variantId === newItem.variantId);
        if (existingCartItemIndex > -1) {
            newCartState = currentCart.map((item, index) => {
                if (index === existingCartItemIndex) {
                    const newQuantity = (Number(item.variantQuantity) || 0) + quantityToAdd;
                    return { ...item, variantQuantity: newQuantity };
                } return item; });
        } else {
             const cartItemToAdd: CartItem = {
                  id: newItem.id, variantId: newItem.variantId, variantQuantity: quantityToAdd, productHandle: newItem.productHandle || '', productTitle: newItem.productTitle || '', variantTitle: newItem.variantTitle ?? null, productImage: newItem.productImage, variantPrice: newItem.variantPrice };
            newCartState = [...currentCart, cartItemToAdd];
        }
        saveLocalDataDemo(newCartState);
        return newCartState;
    });
    setTimeout(() => setIsLoading(false), 50);
  }

  async function updateCartItemQuantityDemo(variantId: string | number, quantity: number | string): Promise<void> {
     setIsLoading(true);
     let newCartState: CartItem[] = [];
     const stringId = String(variantId);
     const numericQuantity = quantity === "" ? 0 : Math.max(0, Math.floor(Number(quantity)));
     setCart(currentCart => {
         newCartState = currentCart
            .map(item => { if (item.variantId === stringId) { return { ...item, variantQuantity: numericQuantity }; } return item; })
            .filter(item => Number(item.variantQuantity) > 0);
         saveLocalDataDemo(newCartState);
         return newCartState;
     });
     setTimeout(() => setIsLoading(false), 50);
  }
  // --- END: Logic for Demo Purposes ---


  // --- START: Logic for Live Shopify Shop (Commented Out) ---
  /*
  const shopifyStorageKey = process.env.NEXT_PUBLIC_LOCAL_STORAGE_NAME || 'shopify_cart_live'; // Use a different key for live

  const getLocalDataShopify = (): { cart: CartItem[]; checkoutId: string | null; checkoutUrl: string | null } => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem(shopifyStorageKey);
      if (localData) {
        try {
          const d = JSON.parse(localData);
          return { cart: Array.isArray(d.cart) ? d.cart : [], checkoutId: typeof d.checkoutId === 'string' ? d.checkoutId : null, checkoutUrl: typeof d.checkoutUrl === 'string' ? d.checkoutUrl : null, };
        } catch (e) { console.error("Error parsing local storage (Shopify):", e); }
      }
    }
    return { cart: [], checkoutId: null, checkoutUrl: null };
  };

  useEffect(() => { // Use this useEffect for Shopify
    const localData = getLocalDataShopify();
    setCart(localData.cart || []);
    setCheckoutId(localData.checkoutId || "");
    setCheckoutUrl(localData.checkoutUrl || "");
    setIsLoading(false);
  }, []);

  useEffect(() => { // Use this useEffect for Shopify storage sync
    const onReceiveMessage = (e: StorageEvent) => {
      if (e.key === shopifyStorageKey && e.newValue) {
        try {
            const parsedData = JSON.parse(e.newValue);
            setCart(Array.isArray(parsedData.cart) ? parsedData.cart : []);
            setCheckoutId(parsedData.checkoutId || "");
            setCheckoutUrl(parsedData.checkoutUrl || "");
        } catch(error){ console.error("Error parsing storage event data (Shopify):", error); }
      }
    };
    window.addEventListener("storage", onReceiveMessage);
    return () => window.removeEventListener("storage", onReceiveMessage);
  }, []);

  const saveLocalDataShopify = (currentCart: CartItem[], currentCheckoutId: string, currentCheckoutUrl: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        shopifyStorageKey,
        JSON.stringify({ cart: currentCart, checkoutId: currentCheckoutId, checkoutUrl: currentCheckoutUrl })
      );
    }
  };

  async function addToCartShopify(newItem: LocalCartItem): Promise<void> {
    setIsLoading(true);
    if (!newItem?.variantId) { console.error("addToCartShopify: newItem missing variantId."); setIsLoading(false); return; }

    const quantityToAdd = Math.max(1, Number(newItem.variantQuantity) || 1);
    const currentCheckoutId = checkoutId; // Capture state for this operation
    const currentCart = [...cart]; // Create copy of current state

     const baseCartItem: Omit<CartItem, 'shopifyLineItemId'> = {
          id: newItem.id, variantId: newItem.variantId, variantQuantity: quantityToAdd, productHandle: newItem.productHandle || '', productTitle: newItem.productTitle || '', variantTitle: newItem.variantTitle ?? null, productImage: newItem.productImage, variantPrice: newItem.variantPrice };

    try {
      const existingCartItemIndex = currentCart.findIndex(item => item.variantId === newItem.variantId);

      if (currentCart.length === 0 || !currentCheckoutId) {
        const createResponse = await createShopifyCheckout(newItem.variantId, quantityToAdd);
        if (createResponse?.cart?.id && createResponse.cart.checkoutUrl) {
          const shopifyCartData = createResponse.cart;
          const newLineEdge = shopifyCartData.lines?.edges?.find(edge => edge?.node?.merchandise?.id === newItem.variantId);
          const shopifyLineItemId = newLineEdge?.node?.id;
          const finalCartItem: CartItem = { ...baseCartItem, shopifyLineItemId: shopifyLineItemId };
          const newCartState = [finalCartItem];
          setCart(newCartState); setCheckoutId(shopifyCartData.id); setCheckoutUrl(shopifyCartData.checkoutUrl);
          saveLocalDataShopify(newCartState, shopifyCartData.id, shopifyCartData.checkoutUrl);
        } else {
            throw new Error(`Failed to create Shopify checkout. Errors: ${JSON.stringify(createResponse?.userErrors)}`);
        }
      } else if (existingCartItemIndex > -1) {
        const updatedCart = [...currentCart];
        const itemToUpdate = updatedCart[existingCartItemIndex];
        const newLineItemQty = (Number(itemToUpdate.variantQuantity) || 0) + quantityToAdd;
        updatedCart[existingCartItemIndex] = { ...itemToUpdate, variantQuantity: newLineItemQty };
        setCart(updatedCart);
        if (itemToUpdate.shopifyLineItemId) {
          const lineItemForUpdate: CartLineUpdateInput = { id: itemToUpdate.shopifyLineItemId, quantity: newLineItemQty };
          const updateSuccessful = await updateShopifyCheckout(currentCheckoutId, [lineItemForUpdate]);
          if (updateSuccessful) { saveLocalDataShopify(updatedCart, currentCheckoutId, checkoutUrl); }
          else { console.error("Error updating Shopify qty. Reverting UI."); setCart(currentCart); }
        } else { console.warn("Item qty updated locally, missing line ID for API sync."); saveLocalDataShopify(updatedCart, currentCheckoutId, checkoutUrl); }
      } else {
        const lineToAdd: CartLineAddInput = { merchandiseId: newItem.variantId, quantity: quantityToAdd };
        const addResponse = await addShopifyCartLines(currentCheckoutId, [lineToAdd]);
        let shopifyLineItemId: string | undefined = undefined;
        if (addResponse?.cart?.lines?.edges) {
            const addedLineEdge = addResponse.cart.lines.edges.reverse().find(edge => edge.node?.merchandise?.id === newItem.variantId);
            shopifyLineItemId = addedLineEdge?.node?.id;
        }
        const finalNewItem: CartItem = { ...baseCartItem, shopifyLineItemId: shopifyLineItemId };
        const newCartState = [...currentCart, finalNewItem];
        setCart(newCartState);
        saveLocalDataShopify(newCartState, currentCheckoutId, checkoutUrl);
      }
    } catch (error) {
      console.error("Error in addToCartShopify:", error);
      setCart(currentCart); // Revert on error
      saveLocalDataShopify(currentCart, checkoutId, checkoutUrl); // Save reverted state
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCartItemQuantityShopify(variantId: string | number, quantity: number | string): Promise<void> {
    setIsLoading(true);
    let currentCart = [...cart]; let newCart = [...cart];
    let itemUpdatedInState = false; let lineItemId: string | undefined | null = null; let numericQuantity: number = 0;
    try {
      const stringId = String(variantId);
      if (quantity === "") { numericQuantity = 0; }
      else { numericQuantity = Math.max(0, Math.floor(Number(quantity))); }
      const itemToUpdate = currentCart.find(item => item.variantId === stringId);
      lineItemId = itemToUpdate?.shopifyLineItemId;
      newCart = currentCart
        .map(item => { if (item.variantId === stringId) { itemUpdatedInState = true; return { ...item, variantQuantity: numericQuantity }; } return item; })
        .filter(item => Number(item.variantQuantity) > 0);
      setCart(newCart); // Optimistic update
      if (lineItemId && checkoutId) {
          const lineItemForUpdate: CartLineUpdateInput = { id: lineItemId, quantity: numericQuantity };
          const updateSuccessful = await updateShopifyCheckout(checkoutId, [lineItemForUpdate]);
          if (updateSuccessful) { saveLocalDataShopify(newCart, checkoutId, checkoutUrl); }
          else { console.error("Error updating/removing Shopify line. Reverting UI."); setCart(currentCart); saveLocalDataShopify(currentCart, checkoutId, checkoutUrl); }
      } else if (itemUpdatedInState) { console.warn(`Cannot sync qty update for variant ${variantId}. Missing ${!lineItemId?'lineItemId':''}${!checkoutId?' checkoutId':''}. Saving locally.`); saveLocalDataShopify(newCart, checkoutId, checkoutUrl); }
      else { console.warn(`Item with variantId ${variantId} not found in cart for update.`); }
    } catch (error) {
      console.error("Error in updateCartItemQuantityShopify:", error);
      setCart(currentCart); saveLocalDataShopify(currentCart, checkoutId, checkoutUrl);
    } finally {
      setIsLoading(false);
    }
  }
  */
  // --- END: Logic for Live Shopify Shop ---


  // Provide the active context values (Demo version)
  return React.createElement(
    CartContext.Provider, { value: [cart, isLoading] },
    React.createElement( AddToCartContext.Provider, { value: addToCartDemo },
      React.createElement( UpdateCartQuantityContext.Provider, { value: updateCartItemQuantityDemo },
          children
      )
    )
  );

  // --- START: Provider structure for Live Shopify Shop (Commented Out) ---
  /*
   return React.createElement(
    CartContext.Provider, { value: [cart, checkoutUrl, isLoading] }, // Use Shopify context value
    React.createElement( AddToCartContext.Provider, { value: addToCartShopify }, // Use Shopify function
      React.createElement( UpdateCartQuantityContext.Provider, { value: updateCartItemQuantityShopify }, // Use Shopify function
          children
      )
    )
  );
  */
   // --- END: Provider structure for Live Shopify Shop ---
}