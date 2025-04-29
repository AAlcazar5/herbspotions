"use client";

import React, { useState, useEffect } from "react";
import { useUpdateCartQuantityContext } from "@/shared/context/StoreContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Price from "@/shop/components/Price";
import { CartItem, CartTableProps } from "@/shared/types/cart";

const gradientClasses = [
    "bg-gradient-to-br from-secondary-500 via-green-500 to-lime-500",
    "bg-gradient-to-tr from-secondary-500 via-yellow-500 to-accent-500",
    "bg-gradient-to-bl from-lime-500 via-accent-500 to-green-500",
    "bg-gradient-to-tl from-yellow-500 via-destructive-500 to-secondary-500",
    "bg-gradient-to-r from-yellow-500 via-lime-500 to-green-500",
    "bg-gradient-to-l from-accent-500 via-light-500 to-secondary-500",
    "bg-gradient-to-b from-green-500 via-accent-500 to-yellow-500",
    "bg-gradient-to-t from-lime-500 via-secondary-500 to-light-500",
    "bg-gradient-to-br from-light-500 via-green-500 to-yellow-500",
    "bg-gradient-to-tl from-accent-500 via-lime-500 to-destructive-500",
    "bg-gradient-to-tr from-accent-500 to-destructive-500",
    "bg-gradient-to-bl from-yellow-500 to-secondary-500",
];

const getGradientClass = (title?: string | null): string => {
    const safeTitle = typeof title === 'string' ? title : '';
    const index = (safeTitle.length + 1) % gradientClasses.length;
    return gradientClasses[index] || 'bg-muted dark:bg-muted';
};

type UpdateCartQuantityFn = (id: string | number, quantity: number | string) => Promise<void>;

function CartTable({ cart }: CartTableProps) {
  const updateCartQuantity: UpdateCartQuantityFn = useUpdateCartQuantityContext();
  const [subtotal, setSubtotal] = useState<number>(0);
  const cartItems = cart || [];

  useEffect(() => {
    calculateSubtotal(cartItems);
  }, [cartItems]);

  function calculateSubtotal(currentCart: CartItem[]) {
    if (!currentCart || currentCart.length === 0) {
      setSubtotal(0);
      return;
    }
    let totalPrice = 0;
    currentCart.forEach((item) => {
      const priceAmount = parseFloat(item.variantPrice?.amount ?? "0");
      const quantity = Number(item.variantQuantity) || 0;
      if (!isNaN(priceAmount) && quantity > 0) {
        totalPrice += quantity * priceAmount;
      }
    });
    setSubtotal(totalPrice);
  }

  function updateItem(variantId: string, quantity: string) {
     const numQuantity = Number(quantity);
     if (!isNaN(numQuantity) && numQuantity <= 0) {
       updateCartQuantity(variantId, '0');
     } else if (!isNaN(numQuantity) && numQuantity > 0) {
       updateCartQuantity(variantId, quantity);
     }
  }

  const handleQuantityChange = (variantId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    updateItem(variantId, event.target.value);
  };

  const handleRemoveItem = (variantId: string) => {
    updateCartQuantity(variantId, '0');
  };

  return (
    <div className="max-w-4xl my-4 sm:my-8 mx-auto w-full shadow-md rounded-lg border border-border dark:border-border bg-card dark:bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left table-fixed">
          <colgroup><col /><col className="w-28" /><col className="w-28" /><col className="w-20" /></colgroup>
          <thead>
            <tr className="uppercase text-xs sm:text-sm text-green-500 dark:text-green-300 border-b border-border dark:border-border">
              <th scope="col" className="font-primary font-semibold px-4 sm:px-6 py-3 text-left tracking-wider">Product</th>
              <th scope="col" className="font-primary font-semibold px-4 sm:px-6 py-3 text-center tracking-wider">Quantity</th>
              <th scope="col" className="font-primary font-semibold px-4 sm:px-6 py-3 hidden sm:table-cell text-right tracking-wider">Total</th>
              <th scope="col" className="font-primary font-semibold pl-4 pr-2 sm:pl-6 sm:pr-4 py-3 text-right tracking-wider"><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-border">
          {cartItems.length > 0 ? (
              cartItems.map((item) => {
                const priceAmount = parseFloat(item.variantPrice?.amount ?? "0");
                const quantity = Number(item.variantQuantity) || 0;
                const itemTotal = (!isNaN(priceAmount) && quantity > 0) ? priceAmount * quantity : 0;
                const itemCurrencyCode = item.variantPrice?.currencyCode;
                const itemGradientClass = getGradientClass(item.productTitle);
                const productLink = (typeof item.productHandle === 'string' && item.productHandle !== '')
                                        ? `/shop/${item.productHandle}`
                                        : '#';

                return (
                  <tr key={item.shopifyLineItemId || item.variantId} className="text-sm sm:text-base text-foreground dark:text-foreground bg-transparent hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors">
                    <td className="font-primary px-4 sm:px-6 py-4 text-left align-middle">
                      <div className="flex items-center gap-3 sm:gap-4 w-full break-words">
                        {item.productImage?.originalSrc && (
                          <div className={`relative h-24 w-24 overflow-hidden rounded-md border border-border dark:border-border flex-shrink-0 hidden sm:block ${itemGradientClass}`}>
                            <img
                              src={item.productImage.originalSrc}
                              alt={item.productImage?.altText || `Image of ${item.productTitle}`}
                              width={96}
                              height={96}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <Link
                            href={productLink}
                            className={`font-medium transition-colors ${productLink === '#' ? 'pointer-events-none text-muted-foreground' : 'hover:text-green-500 dark:hover:text-green-300'}`}
                            aria-disabled={productLink === '#'}
                            tabIndex={productLink === '#' ? -1 : undefined}
                          >
                            {item.productTitle}
                          </Link>
                          {item.variantTitle && item.variantTitle.toLowerCase() !== 'default title' && (
                            <span className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 truncate">
                              {item.variantTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-primary px-4 sm:px-6 py-4 text-center align-middle">
                      <input
                        type="number"
                        inputMode="numeric"
                        aria-label={`Quantity for ${item.productTitle}`}
                        name={`quantity-${item.variantId}`}
                        min="0"
                        step="1"
                        value={Number(item.variantQuantity) > 0 ? item.variantQuantity : ''}
                        onChange={(e) => handleQuantityChange(item.variantId, e)}
                        className="cursor-pointer form-input w-16 rounded-md text-center py-1 border border-border dark:border-border bg-input dark:bg-input text-foreground dark:text-foreground focus:outline-none focus:ring-1 focus:ring-ring dark:focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="font-primary font-medium px-4 sm:px-6 py-4 hidden sm:table-cell text-right align-middle">
                      <Price num={itemTotal} currencyCode={itemCurrencyCode} numSize="text-base" />
                    </td>
                    <td className="font-primary py-4 text-right align-middle pl-4 pr-2 sm:pl-6 sm:pr-4">
                      <button
                        aria-label={`Remove ${item.productTitle} from cart`}
                        title={`Remove ${item.productTitle}`}
                        onClick={() => handleRemoveItem(item.variantId)}
                        className="cursor-pointer text-muted-foreground dark:text-muted-foreground hover:text-destructive-500 dark:hover:text-destructive-500 transition-colors p-1 rounded-full hover:bg-muted dark:hover:bg-muted"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-16 px-4 text-muted-foreground dark:text-muted-foreground">
                  Your cart is empty.
                  <Link href="/shop" className="text-green-500 dark:text-green-300 hover:underline ml-2 font-medium">
                    Start Shopping
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {cartItems.length > 0 && (
        <div className="flex flex-wrap justify-between items-center gap-4 px-4 sm:px-6 py-4 border-t-2 border-border dark:border-border">
          <div className="text-xs text-muted-foreground dark:text-muted-foreground text-center sm:text-left">
              By proceeding, I acknowledge I am at least 21 years of age.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 mx-auto sm:mx-0">
              <span className="font-primary text-base text-foreground dark:text-foreground font-semibold uppercase text-right">
                  Subtotal
              </span>
              <span className="font-primary text-lg text-green-500 dark:text-green-300 font-medium text-right flex-shrink-0">
                  <Price num={subtotal} numSize="text-lg" currencyCode={cartItems[0]?.variantPrice?.currencyCode || 'USD'} />
              </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartTable;