"use client";

import Link from "next/link";
import { FC } from "react";
import { FeaturedProduct } from "@/shared/types/product";

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

const getGradientClass = (title?: string | null) => {
    const safeTitle = typeof title === 'string' ? title : '';
    const index = (safeTitle.length + 1) % gradientClasses.length;
    return gradientClasses[index] || 'bg-muted';
};

const featuredProducts: FeaturedProduct[] = [
  { name: "Tinctures", href: "/shop/herbs-potions-cbd-oil-orange", imageSrc: "/assets/tincture.webp", altText: "A CBD Tincture", },
  { name: "Edibles", href: "/shop/herbs-potions-cbd-gummies-strawberry", imageSrc: "/assets/gummies.webp", altText: "CBD Strawberry Gummies", },
  { name: "Capsules", href: "/shop/herbs-potions-cbd-vegan-softgels", imageSrc: "/assets/capsules.webp", altText: "CBD Softgel Capsules", },
  { name: "Pain Cream", href: "/shop/herbs-potions-cbd-body-cream", imageSrc: "/assets/cream.webp", altText: "CBD Pain Cream", },
  { name: "Pet", href: "/shop/herbs-potions-cbd-dog-treats", imageSrc: "/assets/pet.webp", altText: "CBD Pet Treats", },
];

const FeaturedCollection: FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background dark:bg-background">
      <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground sm:text-3xl mb-8 text-center">
        Featured Products
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {featuredProducts.map((product) => {
          const cardGradientClass = getGradientClass(product.name);

          return (
            <Link href={product.href} key={product.name} className="group block">
              <div className="flex flex-col items-center max-w-[200px] mx-auto">
                <div
                  className={`relative aspect-square w-full overflow-hidden rounded-md border border-border dark:border-border group-hover:opacity-85 transition-opacity duration-300 ${cardGradientClass}`}
                >
                  <img
                    src={product.imageSrc}
                    alt={product.altText}
                    className="absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium text-foreground dark:text-foreground group-hover:underline">
                    {product.name}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedCollection;