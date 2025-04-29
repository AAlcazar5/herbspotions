import { FC } from "react";

const noGreenGradientClasses = [
    "bg-gradient-to-tr from-secondary-500 via-yellow-500 to-accent-500",
    "bg-gradient-to-tl from-yellow-500 via-destructive-500 to-secondary-500",
    "bg-gradient-to-l from-accent-500 via-light-500 to-secondary-500",
    "bg-gradient-to-r from-yellow-500 via-accent-500 to-destructive-500",
    "bg-gradient-to-b from-light-500 via-secondary-500 to-yellow-500",
    "bg-gradient-to-l from-destructive-500 via-accent-500 to-secondary-500",
    "bg-gradient-to-br from-secondary-500 via-yellow-500 to-destructive-500",
    "bg-gradient-to-tl from-accent-500 via-secondary-500 to-light-500",
    "bg-gradient-to-tr from-accent-500 to-destructive-500",
    "bg-gradient-to-bl from-yellow-500 to-secondary-500",
    "bg-gradient-to-t from-yellow-500 to-accent-500",
    "bg-gradient-to-r from-secondary-500 to-light-500",
];

const getGradientClass = (title?: string | null): string => {
    const safeTitle = typeof title === 'string' ? title : '';
    const index = (safeTitle.length + 1) % noGreenGradientClasses.length;
    return noGreenGradientClasses[index] || 'bg-muted';
};

const items = [
  { src: "/assets/GMO.webp", alt: "An Image Displaying GMO Crossed Out", label: "GMO Free" },
  { src: "/assets/Organic.webp", alt: "A Cannabis Leaf", label: "Organic" },
  { src: "/assets/Lab.webp", alt: "A Cauldron", label: "Lab Tested" },
  { src: "/assets/Money.webp", alt: "A Sack of Money", label: "Money Back" },
  { src: "/assets/Zero.webp", alt: "The Word Psychoactive crossed out", label: "Zero THC" },
];

const ImagesRow: FC = () => {

  return (
    <div className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-background dark:bg-background">
      <div className="text-center">
        <h2 className="mb-6 font-bold tracking-wide text-foreground dark:text-foreground text-2xl sm:text-3xl">
          We Specialize In{" "}
          <span className="text-green-500 dark:text-green-300 px-2 animate-bounce">Green</span> Products
        </h2>
        <p className="mx-auto text-lg text-muted-foreground dark:text-muted-foreground mb-8 lg:w-2/3">
          Herbs & Potion&apos;s Green products are all about creating magical
          experiences that are both fun and effective. We emphasize quality
          products, at a value price point with a quirky style.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => {
          const itemGradientClass = getGradientClass(item.label);

          return (
            <div key={item.label} className="flex flex-col items-center">
              <div
                className={`relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full border-2 border-border dark:border-border p-2 shadow-sm bg-clip-padding ${itemGradientClass}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="absolute inset-0 w-full h-full object-contain p-1"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-3 font-bold text-accent-foreground dark:text-white text-center tracking-wide text-sm sm:text-md">
                {item.label}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImagesRow;