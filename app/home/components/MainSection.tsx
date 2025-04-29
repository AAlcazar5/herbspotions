import Link from "next/link";
import { FC } from "react";

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
    "bg-gradient-to-r from-yellow-500 via-accent-500 to-destructive-500",
    "bg-gradient-to-l from-destructive-500 via-accent-500 to-secondary-500",
    "bg-gradient-to-br from-secondary-500 via-yellow-500 to-destructive-500",
];

const redGradientClasses = gradientClasses.filter(g => g.includes('destructive-500'));
const nonRedGradientClasses = gradientClasses.filter(g => !g.includes('destructive-500'));

const fallbackRed = "bg-gradient-to-r from-destructive-500 to-yellow-500";
const fallbackNonRed = "bg-gradient-to-r from-green-500 to-accent-500";

const getGradientFromList = (list: string[], title?: string | null): string => {
    if (!list || list.length === 0) {
        return title === "Pain Relief" ? fallbackNonRed : fallbackRed;
    }
    const safeTitle = typeof title === 'string' ? title : '';
    const index = (safeTitle.length + 1) % list.length;
    return list[index];
};

const MainSection: FC = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000/';
  const imagePaths = {
    potion1: "/assets/potion1.webp",
    potion2: "/assets/potion2.webp",
    potion3: "/assets/potion3.webp",
  };
  const cards = [
     { title: "Decreased Insomnia", imgSrc: imagePaths.potion1, altText: "Green Potion Bottle", linkHref: `${siteUrl}/blog/beyond-cbd-unlocking-the-potential-of-minor-cannabinoids-cbg-cbn-cbc-and-the-entourage-effect`, linkText: "entourage effect", description: "of full spectrum CBD that includes all of the over 100 cannabinoids in the hemp plant can lead to increase in the amount and quality of sleep.", descriptionPrefix: "The ", },
     { title: "Pain Relief", imgSrc: imagePaths.potion2, altText: "Red Potion Bottle", linkHref: "https://pubmed.ncbi.nlm.nih.gov/33004159/", linkText: "Studies Indicate", description: "that users may have decreased feelings of pain, due to CBD`s effects on lowering inflammation in the body.", descriptionPrefix: "", },
     { title: "Lowered Anxiety", imgSrc: imagePaths.potion3, altText: "Blue Potion Bottle", linkHref: `${siteUrl}/blog/beyond-the-hype-peeking-at-the-science-backed-potential-of-cbd`, linkText: "Scientific studies", description: "indicate that CBD can target brain receptors that influence the regulation of neurotransmitters like Serotonin. Serotonin plays a role in the regulation of anxiety.", descriptionPrefix: "", },
  ];

  return (
    <div className="py-16 sm:py-24 bg-background dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground dark:text-foreground sm:text-4xl mb-12">
          What Can CBD Do?
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-y-10 md:gap-y-12 lg:gap-x-8">
          {cards.map((card) => {
             let cardGradientClass = '';
             if (card.title === "Pain Relief") {
                 cardGradientClass = getGradientFromList(nonRedGradientClasses, card.title);
             } else {
                 cardGradientClass = getGradientFromList(redGradientClasses, card.title);
             }

            return (
            <div key={card.title} className="bg-card dark:bg-card rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row border border-border dark:border-border">

              <div
                 className={`relative w-full p-6 md:w-1/4 md:h-auto md:aspect-square flex-shrink-0 flex items-center justify-center ${cardGradientClass}`}
              >
                <img
                  src={card.imgSrc}
                  alt={card.altText}
                  className="w-48 h-48 object-contain flex-shrink-0"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow md:border-l border-border dark:border-border">
                <h3 className="text-xl font-bold text-foreground dark:text-foreground mb-2 text-center md:text-left">
                  {card.title}
                </h3>
                <p className="text-muted-foreground dark:text-muted-foreground mb-3 whitespace-normal break-words text-center md:text-left line-clamp-none">
                  {card.descriptionPrefix}
                  {card.linkHref ? (
                      <Link
                        href={card.linkHref}
                        className="text-green-500 dark:text-green-300 hover:underline font-semibold"
                        target={card.linkHref.startsWith('http') && !card.linkHref.startsWith(siteUrl) ? '_blank' : '_self'}
                        rel={card.linkHref.startsWith('http') && !card.linkHref.startsWith(siteUrl) ? 'noopener noreferrer' : undefined}
                      >
                         {card.linkText}
                      </Link>
                  ) : (
                      card.linkText ? <strong className="font-semibold">{card.linkText}</strong> : null
                  )}
                  {' '}
                  {card.description}
                </p>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};

export default MainSection;