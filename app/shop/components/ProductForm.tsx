"use client";

import React, { useState, useEffect, useCallback, useMemo, FC, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useAddToCartContext } from "@/shared/context/StoreContext";
import {
  VariantNode,
  ProductFormProps
} from "@/shared/types/product";
import { Button } from "@/shared/components/Button";
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

const inputBaseClasses = "mt-1 block w-full text-base border rounded-md transition-colors duration-150 ease-in-out";
const inputThemeClasses = "border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground placeholder:text-muted-foreground";
const inputFocusClasses = "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background";
const selectInputClasses = `${inputBaseClasses} ${inputThemeClasses} ${inputFocusClasses} pl-3 pr-10 py-2 sm:text-sm appearance-none cursor-pointer`;

const quantityInputClasses = `
  mt-1 block text-base border rounded-md transition-colors duration-150 ease-in-out
  ${inputThemeClasses}
  ${inputFocusClasses}
  w-16
  pl-3 pr-2 py-2
  sm:text-sm text-center
  disabled:opacity-50 disabled:cursor-not-allowed
`.replace(/\s+/g, ' ').trim();

const ProductForm: FC<ProductFormProps> = ({
  className,
  title,
  handle,
  variants,
  mainImg,
  setVariantPrice,
}) => {

  if (!variants || !Array.isArray(variants) || variants.length === 0) {
      console.warn("ProductForm rendered without valid variants prop.");
      return (
          <div className="mt-4 p-4 border border-dashed border-border dark:border-border rounded-md text-center text-muted-foreground dark:text-muted-foreground">
              Product options currently unavailable.
          </div>
      );
  }

  const initialVariant = useMemo(() => {
      return variants.find(v => v.node.availableForSale !== false) || variants[0];
  }, [variants]);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(initialVariant?.node.id || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const addToCart = useAddToCartContext();
  const addedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedVariant = useMemo<VariantNode | null>(() => {
      return variants.find(v => v.node.id === selectedVariantId) || null;
  }, [variants, selectedVariantId]);

  useEffect(() => { setVariantPrice(selectedVariant?.node.price ?? null); }, [selectedVariant, setVariantPrice]);
  useEffect(() => { setAddError(null); }, [selectedVariantId, quantity]);

  const handleVariantChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => { setSelectedVariantId(event.target.value); }, []);
  const handleQuantityChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") { setQuantity(1); } else { const num = parseInt(value, 10); setQuantity(isNaN(num) || num < 1 ? 1 : num); }
   }, []);

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariantId || !selectedVariant || selectedVariant.node.availableForSale === false || quantity < 1 || isAdding || isAdded) {
        if (!selectedVariant?.node?.availableForSale) { setAddError("Please select an available option."); }
        else if (quantity < 1) { setAddError("Please enter a valid quantity."); }
        return;
    }
    if (typeof addToCart !== 'function') {
        console.error("addToCart function is not available from context.");
        setAddError("Unable to add item to cart at this time.");
        return;
    }
    const node = selectedVariant.node;
    if (!node) {
        console.error("Selected variant node is missing unexpectedly after check.");
        setAddError("An unexpected error occurred with the product variant.");
        return;
    }

    if (addedTimeoutRef.current) { clearTimeout(addedTimeoutRef.current); }
    setIsAdding(true);
    setIsAdded(false);
    setAddError(null);
    const tempNumericId = Date.now() + Math.random();
    const cartProductImage = mainImg?.node?.url ? { originalSrc: mainImg.node.url, altText: mainImg.node.altText || mainImg.node.alt || title || undefined } : undefined;
    const originalPrice = node.price;
    let cartVariantPrice: { amount?: string; currencyCode?: string } | undefined = undefined;
    if (originalPrice) { cartVariantPrice = { amount: originalPrice.amount ?? undefined, currencyCode: originalPrice.currencyCode ?? undefined }; }

    try {
        await addToCart({ id: tempNumericId, variantId: node.id, variantQuantity: Number(quantity), productHandle: handle, productTitle: title, variantTitle: node.title || "", productImage: cartProductImage, variantPrice: cartVariantPrice });
        setIsAdded(true);
        addedTimeoutRef.current = setTimeout(() => { setIsAdded(false); addedTimeoutRef.current = null; }, 2000);
    } catch (error: any) {
        console.error("Failed to add item to cart:", error);
        setAddError(`Error: ${error.message || "Could not add item to cart."}`);
        setIsAdded(false);
    } finally {
        setIsAdding(false);
    }
  }, [selectedVariant, quantity, isAdding, isAdded, addToCart, title, handle, mainImg, selectedVariantId]);

  useEffect(() => {
    return () => { if (addedTimeoutRef.current) { clearTimeout(addedTimeoutRef.current); } };
  }, []);

  const isVariantAvailable = selectedVariant?.node.availableForSale !== false;
  const isQuantityValid = quantity >= 1;
  const canAddToCart = isVariantAvailable && isQuantityValid;

  return (
    <div className={cn(className)}>
      {variants.length > 1 && (
        <div className="mb-4 w-28">
          <label htmlFor="variant-select" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
            {variants[0]?.node?.selectedOptions?.[0]?.name || "Option"}
          </label>
          <div className="relative">
            <select
              id="variant-select"
              name="variant"
              value={selectedVariantId}
              onChange={handleVariantChange}
              className={selectInputClasses}
            >
              {variants.map(({ node }) => (
                <option key={node.id} value={node.id} disabled={node.availableForSale === false}>
                  {node.title} {node.availableForSale === false ? " (Out of stock)" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 pr-3 h-5 w-5 text-muted-foreground dark:text-muted-foreground" aria-hidden="true"/>
          </div>
        </div>
      )}

      {variants.length === 1 && selectedVariant && (
           <div className="mb-4">
             <span className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
               {variants[0]?.node?.selectedOptions?.[0]?.name || "Option"}:
             </span>
             <span className="text-base text-foreground dark:text-foreground">
               {selectedVariant.node.title}
               {selectedVariant.node.availableForSale === false && <span className="text-destructive-500 dark:text-destructive-500 text-sm ml-2">(Out of stock)</span>}
             </span>
           </div>
       )}

      <div className="mb-4 w-28">
        <label htmlFor="quantity-input" className="block text-sm font-medium text-foreground mb-1">Quantity:</label>
        <input id="quantity-input" type="number" min="1" value={quantity} onChange={handleQuantityChange} disabled={!isVariantAvailable} className={quantityInputClasses}/>
      </div>

      <Button
        type="button"
        variant="primary"
        className="mt-4 w-full text-background dark:text-black transition-all duration-200"
        onClick={handleAddToCart}
        disabled={!canAddToCart || isAdding || isAdded}
        aria-label="Add product to cart"
        aria-live="polite"
      >
        {isAdding ? (
          <> <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 mr-2 animate-spin" /> Adding... </>
        ) : isAdded ? (
           <> <FontAwesomeIcon icon={faCheck} className="w-5 h-5 mr-2" /> Added! </>
        ) : !isVariantAvailable ? (
          "Out of Stock"
        ) : (
          <> <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 mr-2" /> Add To Cart </>
        )}
      </Button>

      {!isAdding && !isVariantAvailable && selectedVariant && (<p className="text-destructive-500 dark:text-destructive-500 text-sm mt-2">This option is currently out of stock.</p>)}
      {addError && (<p className="text-destructive-500 dark:text-destructive-500 text-sm mt-2">{addError}</p>)}
    </div>
  );
}

export default ProductForm;