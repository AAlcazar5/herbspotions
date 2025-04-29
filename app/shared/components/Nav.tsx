"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useCartContext } from "@/shared/context/StoreContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { ThemeToggleShadcn } from "@/shared/components/ThemeToggleShadcn";
import { CartItem } from "@/shared/types/cart";
import { Button } from "@/shared/components/Button";
import { Dialog, Transition } from "@headlessui/react";
import { Menu as MenuIcon, X } from "lucide-react";

interface NavProps {
  nonce?: string;
}

export default function Nav({ nonce }: NavProps) {
  const [cart] = useCartContext();
  const [cartItems, setCartItems] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  useEffect(() => {
    let numItems = 0;
    if (Array.isArray(cart)) {
      cart.forEach((item: CartItem) => {
        numItems += Number(item.variantQuantity || 0);
      });
    }
    setCartItems(numItems);
  }, [cart]);

  const renderCartIcon = () => (
    <Link href="/cart" aria-label="View Cart" className="relative inline-flex items-center justify-center w-7 h-7">
      <FontAwesomeIcon
        icon={faShoppingCart}
        className="text-green-500 dark:text-green-300 hover:text-foreground/80 dark:hover:text-foreground/80 h-5 w-5 transition-colors"
      />
      {cartItems > 0 && (
         <span
           className="absolute top-[-5px] right-[-5px] flex items-center justify-center text-[10px] bg-green-500 text-white font-semibold rounded-full h-4 w-auto min-w-[1rem] px-1 leading-none"
          >
           {cartItems}
         </span>
      )}
    </Link>
  );

  const mobileNavItemClasses = "w-full flex items-center justify-start text-left py-3 px-3 border-b border-border hover:bg-muted/50 dark:hover:bg-muted/50 rounded-md transition-colors";

  return (
    <header className={`flex flex-row justify-between items-center px-6 lg:px-12 py-4 border-b border-border dark:border-border shadow-sm h-auto top-0 bg-background dark:bg-background text-foreground dark:text-foreground transition-colors duration-300`}>
      <Link href="/" className="cursor-pointer">
        <div className="flex flex-row items-center">
          <div className="relative w-8 h-8 mr-2 flex items-center justify-center">
            <img
              src="/assets/hpLogo-32w.webp"
              srcSet="/assets/hpLogo-32w.webp, /assets/hpLogo-64w.webp"
              sizes="32px"
              alt="Herbs & Potions Logo"
              width="32"
              height="32"
              className="object-contain max-w-full max-h-full"
              loading="lazy"
            />
          </div>
          <span className="text-3xl font-primary font-bold tracking-tight text-green-500 dark:text-green-300">
            Herbs & Potions
          </span>
        </div>
      </Link>

      <section className="MOBILE-MENU flex justify-center lg:hidden">
        <Button variant="outline" size="icon" aria-label="Open mobile menu" className="cursor-pointer" onClick={openMobileMenu}>
           <MenuIcon className="h-4 w-4" />
        </Button>

        <Transition appear show={isMobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={closeMobileMenu}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex justify-end">
                <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300 sm:duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-300 sm:duration-500" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                  <Dialog.Panel className="relative w-full max-w-sm transform overflow-hidden bg-background dark:bg-background p-6 text-left align-middle shadow-lg h-screen flex flex-col">
                     <div className="flex items-center justify-between mb-4">
                       <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-foreground dark:text-foreground">Menu</Dialog.Title>
                       <button type="button" className="p-1 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer" onClick={closeMobileMenu}><span className="sr-only">Close menu</span><X className="h-5 w-5" /></button>
                     </div>

                     <nav className="flex flex-col items-start text-lg font-semibold text-foreground dark:text-foreground flex-grow overflow-y-auto -mx-3">
                       <div className={mobileNavItemClasses}>
                         <ThemeToggleShadcn />
                       </div>
                       <div className={mobileNavItemClasses}>
                         {renderCartIcon()}
                       </div>
                       <Link href="/shop" onClick={closeMobileMenu} className={`${mobileNavItemClasses} hover:text-green-500 dark:hover:text-green-300`}>SHOP</Link>
                       <Link href="/blog" onClick={closeMobileMenu} className={`${mobileNavItemClasses} hover:text-green-500 dark:hover:text-green-300`}>BLOG</Link>
                       <Link href="/contact" onClick={closeMobileMenu} className={`${mobileNavItemClasses} hover:text-green-500 dark:hover:text-green-300`}>CONTACT</Link>
                       <Link href="/faq" onClick={closeMobileMenu} className={`${mobileNavItemClasses} hover:text-green-500 dark:hover:text-green-300`}>FAQ</Link>
                     </nav>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </section>

      <section className="DESKTOP-MENU hidden space-x-8 lg:flex lg:flex-row items-center text-sm">
         <Link href="/shop" className="hover:text-green-500 dark:hover:text-green-300">SHOP</Link>
         <Link href="/blog" className="hover:text-green-500 dark:hover:text-green-300">BLOG</Link>
         <Link href="/contact" className="hover:text-green-500 dark:hover:text-green-300">CONTACT</Link>
         <Link href="/faq" className="hover:text-green-500 dark:hover:text-green-300">FAQ</Link>
         {renderCartIcon()}
         <ThemeToggleShadcn />
      </section>
    </header>
  );
}