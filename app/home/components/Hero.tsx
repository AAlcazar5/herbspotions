import { FC } from "react";
import { Button } from '@/shared/components/Button';

const CtaPage: FC = () => {
  const heroImageAlt = "CBD Tincture with Hemp Leaves";

  return (
    <section className="max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-foreground dark:text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 lg:gap-x-12 items-center">

        <div className="text-center lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8">
            <span className="text-green-500 dark:text-green-300">
              Green Magic
            </span>
            <span
              className={
                `block mt-1 sm:mt-2 text-transparent bg-clip-text ` +
                `bg-gradient-to-r from-accent-500 via-destructive-500 to-secondary-500 ` +
                `dark:from-lime-500 dark:via-yellow-500 dark:to-destructive-500`
              }
            >
              Have A Magical Time
            </span>
          </h2>
          <div className="mt-6 flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
            <Button
              href="/shop"
              variant="primary"
              size="default"
              className="w-full max-w-xs lg:w-1/3 lg:max-w-none text-background"
            >
              SHOP
            </Button>
            <Button
              href="/blog"
              variant="secondary"
              size="default"
              className="w-full max-w-xs lg:w-1/3 lg:max-w-none dark:hover:text-black"
            >
              BLOG
            </Button>
          </div>
        </div>

        <div className="relative w-full lg:mx-auto lg:max-w-md aspect-video lg:aspect-square rounded-md overflow-hidden">
          <img
            src="/assets/hero-768w.webp"
            srcSet="/assets/hero-480w.webp, /assets/hero-640w.webp, /assets/hero-768w.webp, /assets/hero-1024w.webp"
            sizes="(min-width: 1024px) 768px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
            alt={heroImageAlt}
            width="768"
            height="432"
            className="absolute inset-0 w-full h-full object-contain object-center"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
};

export default CtaPage;