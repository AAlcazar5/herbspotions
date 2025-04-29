"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-background dark:bg-background text-muted-foreground dark:text-muted-foreground py-8 border-t border-border dark:border-border">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="mb-8 md:mb-0">
            <h2 className="mb-4 font-bold tracking-widest text-xl text-green-500 dark:text-green-300">
              WE 💚 CBD
            </h2>
            <p className="uppercase space-y-2 text-sm">
              Our mission is to provide you a magical experience with the
              quality of our products and minimalist ethos.
            </p>
          </div>

          <div className="mb-8 md:mb-0">
            <h2 className="mb-4 font-bold tracking-widest text-xl text-green-500 dark:text-green-300">
              ABOUT
            </h2>
            <ul className="space-y-3 text-sm list-none">
              <li className="uppercase hover:text-foreground dark:hover:text-foreground transition-colors">
                <Link href="/contact">Contact Us</Link>
              </li>
              <li className="uppercase hover:text-foreground dark:hover:text-foreground transition-colors">
                <Link href="/terms">Terms</Link>
              </li>
              <li className="uppercase hover:text-foreground dark:hover:text-foreground transition-colors">
                <Link href="/privacy">Privacy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-bold tracking-widest text-xl text-green-500 dark:text-green-300">
              SHOP
            </h2>
            <ul className="space-y-3 text-sm list-none">
              <li className="uppercase hover:text-foreground dark:hover:text-foreground transition-colors">
                <Link href="/shop?tag=Tinctures">Tinctures</Link>
              </li>
              <li className="uppercase hover:text-foreground dark:hover:text-foreground transition-colors">
                <Link href="/shop?tag=Capsules">
                  Capsules
                </Link>
              </li>
              <li className="uppercase hover:text-foreground dark:hover:text-foreground transition-colors">
                <Link href="/shop?tag=Edibles">
                  Edibles
                </Link>
              </li>
              <li className="uppercase hover:text-foreground dark:hover:text-foreground transition-colors">
                <Link href="/shop?tag=Creams">Creams</Link>
              </li>
              <li className="uppercase hover:text-foreground dark:hover:text-foreground transition-colors">
                <Link href="/shop?tag=Pet">Pet</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex space-x-4">
            <div className="h-10 w-10 relative overflow-hidden"> <img src="/assets/visa.webp" alt="Visa" className="object-contain w-full h-full absolute inset-0" loading="lazy"/> </div>
            <div className="h-10 w-10 relative overflow-hidden"> <img src="/assets/american.webp" alt="American Express" className="object-contain w-full h-full absolute inset-0" loading="lazy"/> </div>
            <div className="h-10 w-10 relative overflow-hidden"> <img src="/assets/discover.webp" alt="Discover" className="object-contain w-full h-full absolute inset-0" loading="lazy"/> </div>
            <div className="h-10 w-10 relative overflow-hidden"> <img src="/assets/mastercard.webp" alt="Mastercard" className="object-contain w-full h-full absolute inset-0" loading="lazy"/> </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <p>© Herbs & Potions {currentYear ?? new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
