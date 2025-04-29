"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const borderColors = [
    "border-green-500",
    "border-yellow-500",
    "border-secondary-500",
    "border-lime-500",
    "border-accent-500",
    "border-destructive-500",
];

const darkBorderColors = [
    "dark:border-green-300",
    "dark:border-yellow-500",
    "dark:border-secondary-500",
    "dark:border-lime-500",
    "dark:border-accent-500",
    "dark:border-destructive-500",
]

interface AccordionLayoutProps {
  title: string;
  children: React.ReactNode;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionLayout: React.FC<AccordionLayoutProps> = ({
  title,
  children,
  index,
  isOpen,
  onToggle,
}) => {
  const borderColorClass = borderColors[index % borderColors.length];
  const darkBorderColorClass = darkBorderColors[index % darkBorderColors.length];

  return (
    <div className={`w-full sm:w-4/5 lg:w-3/4 bg-card dark:bg-card rounded-lg shadow-sm transition-all duration-300 ease-in-out border-l-4 ${borderColorClass} ${darkBorderColorClass} ${isOpen ? 'mb-4' : ''}`}>
      <button
        onClick={onToggle}
        className="flex w-full justify-between items-center p-5 cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors rounded-r-md"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${index}`}
      >
        <span className="font-semibold text-lg text-foreground dark:text-foreground text-left">
          {title}
        </span>
        <span className="flex-shrink-0 ml-4 text-green-500 dark:text-green-300">
          {isOpen ? <FontAwesomeIcon icon={faMinus} className="w-5 h-5" /> : <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />}
        </span>
      </button>

      {isOpen && (
         <div
           id={`faq-content-${index}`}
           className="p-5 border-t border-border dark:border-border text-muted-foreground dark:text-muted-foreground whitespace-normal line-clamp-none"
         >
            {children}
         </div>
      )}
    </div>
  );
};


const FaqAccordion: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([1]));

  const toggleOpen = (index: number) => {
    setOpenIndices(prevIndices => {
      const newIndices = new Set(prevIndices);
      if (newIndices.has(index)) {
        newIndices.delete(index);
      } else {
        newIndices.add(index);
      }
      return newIndices;
    });
  };

  const faqItems = [
    { index: 1, title: "What is CBD?", content: <>CBD (short for Cannabidiol) is a natural compound found in the resinous flower of the cannabis herb. CBD oil is being in a variety of products such as tinctures, edibles, balms, and cosmetics. To learn more, check out our blog post on{" "} <Link href="/blog/fact-vs-fiction-demystifying-common-cbd-myths-and-misconceptions" className="font-semibold text-green-500 dark:text-green-300 hover:underline">CBD.</Link></> },
    { index: 2, title: "What does CBD do?", content: <>CBD can be used for a variety of ailments, from anxiety, to pain relief, to nausea relief, to appetite/metabolism enhancer, and so many more benefits in between.{" "} <Link href="/blog/navigating-the-maze-cbd-and-drug-testing-understanding-the-risks-and-choosing-wisely" className="font-semibold text-green-500 dark:text-green-300 hover:underline">Read More Here.</Link></> },
    { index: 3, title: "What's a standard dose?", content: <>A standard dose of CBD depends on the person but we recommend 10mg for new users, and 20-50mg for more experienced users. So one gummy, capsule, or dropper would do the trick.</> },
    { index: 4, title: "Which product should I get started with?", content: <>Our recommendation is the{" "} <Link href="/shop/herbs-potions-cbd-gummies-strawberry" className="font-semibold text-green-500 dark:text-green-300 hover:underline">gummies</Link>, as they are already measured by standard dose and are delicious. But all of our products are very beginner friendly.</> },
    { index: 5, title: "What's the difference between Hemp CBD and marijuana?", content: <>The difference is that the hemp plant is defined legally as having less than 0.3% THC (or the chemical compound responsible for people feeling &quot;high&quot;) and marijuana plants can have up to over 30% THC! So ingesting CBD hemp products will not get you high, whereas marijuana products generally do. They both pertain to the cannabis family though and in fact share over 100 cannabinoids in common.{" "} <Link href="/blog/hemp-vs-marijuana-whats-the-real-difference" className="font-semibold text-green-500 dark:text-green-300 hover:underline">Read More Here.</Link></> },
    { index: 6, title: "Is purchasing these products legal?", content: <>Yes! As of the passage of the 2018 Hemp Farm Bill, any products containing less than 0.3% THC are legal to sell in the United States.</> },
    { index: 7, title: "Will this show up on a drug test?", content: <>Although the risk is fairly low, an individuals genetics and consumption of our CBD products may lead to a positive drug test, because of the trace amounts (less than 0.3%) of THC in the hemp plant. We recommend that you consult with your doctor and exercise caution when taking our products to ensure that you do not show up positive on a drug test.</> },
    { index: 8, title: "What's your return policy?", content: <>All new or used products must meet the following conditions to be eligible for a refund or exchange: <ul className="list-disc ml-6 space-y-1 mt-2"><li>* All Product(s)&nbsp;must be shipped back within 30 days of the original delivery date.</li><li>* New product(s)&nbsp;must be in original, unused and brand-new condition to receive a full refund.</li><li>* Used Product(s), that have been opened or have broken seals, must be in the original condition they were received and may be subject to restocking fees up to 40%. Additional fees of 10% may be imposed if accessories, parts or other items are missing from original packaging.&nbsp;</li></ul>If you meet the above conditions and would like to return your product, please shoot us a{" "} <Link href="/contact" className="font-semibold text-green-500 dark:text-green-300 hover:underline">return request</Link>.</> },
  ];

  return (
    <div className="flex justify-center py-16 sm:py-24 px-4 bg-background dark:bg-background">
      <div className="flex flex-col items-center max-w-4xl w-full gap-4">
        <h1 className="text-center tracking-tight mb-10 text-3xl sm:text-4xl font-extrabold text-foreground dark:text-foreground">
          Frequently Asked Questions ❓
        </h1>

        {faqItems.map((item) => (
          <AccordionLayout
            key={item.index}
            title={item.title}
            index={item.index}
            isOpen={openIndices.has(item.index)}
            onToggle={() => toggleOpen(item.index)}
          >
            {item.content}
          </AccordionLayout>
        ))}

        <p className="pt-10 text-center w-full sm:w-4/5 lg:w-3/4 text-base sm:text-lg text-muted-foreground dark:text-muted-foreground">
          Above we have provided an overview of some questions consumers may have, but you can also{" "}
          <Link href="/contact" className="font-semibold text-green-500 dark:text-green-300 hover:underline">reach out to us</Link>
          {" "}if you have further questions, or read more at our{" "}
          <Link href="/blog" className="font-semibold text-green-500 dark:text-green-300 hover:underline">blog</Link>
          {" "}about the benefits of CBD.&nbsp;
        </p>
      </div>
    </div>
  );
};

export default FaqAccordion;