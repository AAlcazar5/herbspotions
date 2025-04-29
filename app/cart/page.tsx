"use client";

import React, { useState, FC, Fragment } from "react";
import { useCartContext } from "@/shared/context/StoreContext";
import CartTable from "@/cart/components/CartTable";
import PageTitle from "@/shared/components/PageTitle";
import { Button } from "@/shared/components/Button";
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faExternalLinkAlt, faFlask } from "@fortawesome/free-solid-svg-icons";
import { Dialog, Transition } from "@headlessui/react";

const CartPage: FC = () => {
  const [cart, isLoading] = useCartContext();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  function closeCheckoutModal() {
    setIsCheckoutModalOpen(false);
  }

  function openCheckoutModal() {
    setIsCheckoutModalOpen(true);
  }

  const cartItems = cart || [];

  if (isLoading && (!cart || cart.length === 0)) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
         <PageTitle text="Your Cart" />
         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-primary">
            <FontAwesomeIcon
                icon={faFlask}
                className="h-24 w-24 animate-spin mb-4 text-foreground"
                aria-hidden="true"
            />
            <p className="text-lg font-semibold text-foreground dark:text-foreground">Loading Cart...</p>
            <span className="sr-only">Loading cart contents</span>
         </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mb-20 min-h-screen px-4">
      <PageTitle text="Your Cart" />
      {cartItems.length > 0 ? (
        <>
          <CartTable cart={cartItems} />
          <div className="max-w-sm mx-auto grid grid-cols-2 gap-4 px-2 mt-8">
            <Button
              variant="secondary"
              href="/shop"
              className="hover:text-accent-foreground hover:bg-gradient-to-r hover:from-green-400 hover:via-lime-500 hover:to-yellow-400 hover:border-transparent"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" aria-hidden="true" />
              Back To Shop
            </Button>

            {/* --- START: Demo Version of Checkout Button --- */}
            <Button
                variant="primary"
                onClick={openCheckoutModal}
                className="text-background dark:text-accent-foreground"
            >
               Checkout
               <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
            {/* --- END: Demo Version of Checkout Button --- */}

            {/* --- START: Live Version of Checkout Button --- */}
            {/*
            <Button
                variant="primary"
                href={checkoutUrl} // checkoutUrl would come from useCartContext [cart, checkoutUrl, isLoading] in live version
                disabled={!checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-background dark:text-accent-foreground"
            >
               Checkout
               <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
            */}
            {/* --- END: Live Version of Checkout Button --- */}

          </div>
          <div className="text-center mt-6 mb-4 text-xs text-muted-foreground dark:text-muted-foreground px-4">
            Shipping & taxes calculated at checkout. By proceeding, I acknowledge I am at least 21 years of age.
          </div>
        </>
      ) : (
        <div className="text-center mt-8 py-10 border border-dashed border-border dark:border-border rounded-md">
            <p className="text-lg text-muted-foreground dark:text-muted-foreground">Your cart is currently empty.</p>
            <Link href="/shop" className="mt-4 inline-block text-green-500 dark:text-green-300 hover:underline font-medium">
                Start Shopping
            </Link>
        </div>
      )}

      <Transition appear show={isCheckoutModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={closeCheckoutModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background dark:bg-card p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-foreground dark:text-foreground text-center"
                  >
                    Checkout Unavailable
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground text-center">
                      The Shopify checkout is not live anymore, therefore checkout is not available. This is now a demo site.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-center">
                     <Button
                      variant="outline"
                      onClick={closeCheckoutModal}
                    >
                      Got it!
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CartPage;