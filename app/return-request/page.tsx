import { NextPage } from "next";
import Link from 'next/link';
import React from "react";

const ReturnPage: NextPage = () => {
  return (
    <div className="bg-background dark:bg-background text-muted-foreground dark:text-muted-foreground py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-center text-3xl sm:text-4xl font-bold text-foreground dark:text-foreground mb-12">
            Herbs & Potions Return Policy
          </h1>
          <p className="mb-4 text-base leading-relaxed">
            At Herbs & Potions, we want you to be enchanted with your CBD experience. If for any reason you're not completely satisfied with your purchase, we're here to help. Please read our return policy below to ensure a smooth process.
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-foreground dark:text-foreground mb-2">
              Eligibility for Returns and Exchanges:
            </h2>
            <p className="mb-2 text-base leading-relaxed">
              To be eligible for a refund or exchange, all new or used products must meet the following conditions:
            </p>
            <ul className="list-disc ml-6 space-y-2 mb-4 text-base leading-relaxed">
              <li>
                All Product(s) must be shipped back to us within <strong>30 days</strong> of the original delivery date.
              </li>
              <li>
                <strong>New Product(s)</strong> must be in their original, unused, and brand-new condition to receive a full refund. This includes all original packaging, seals intact, and any included accessories.
              </li>
              <li>
                <strong>Used Product(s)</strong>, that have been opened or have broken seals, must be returned in the original condition they were received. Please note that returns of used products may be subject to{' '}
                <strong>restocking fees of up to 40%</strong>. Additionally, a fee of <strong>10% may be imposed if any accessories, parts, or other items are missing from the original packaging.</strong>
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-foreground dark:text-foreground mb-2">
              How to Initiate a Return:
            </h2>
            <p className="mb-4 text-base leading-relaxed">
              If your product meets the above conditions and you wish to return it, please submit a{' '}
              <Link href="/return-request/request" className="font-semibold text-green-500 dark:text-green-300 hover:underline">
                return request
              </Link>
              {' '}
              through our website. Our team will review your request and provide you with further instructions, including the return shipping address.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-foreground dark:text-foreground mb-2">
              Important Notes:
            </h2>
            <ul className="list-disc ml-6 space-y-2 mb-4 text-base leading-relaxed">
              <li>
                <strong>Return Shipping Costs:</strong> Unless the return is due to a mistake on our part (e.g., wrong item shipped, defective product), you will be responsible for the return shipping costs.
              </li>
              <li>
                <strong>Refund Processing:</strong> Once we receive your returned product and verify that it meets the eligibility criteria, we will process your refund as quickly as possible. Please allow [Insert Number] business days for the refund to appear in your original payment method.
              </li>
              <li>
                <strong>Exchanges:</strong> If you would like to exchange a product, please indicate this in your return request. Exchanges are subject to product availability. Additional shipping charges may apply for exchanged items.
              </li>
              <li>
                <strong>Final Sale Items:</strong> Please note that certain items may be marked as "Final Sale" and are not eligible for returns or exchanges unless they are defective upon arrival. This will be clearly stated on the product page at the time of purchase.
              </li>
              <li>
                <strong>Damaged or Defective Items:</strong> If your order arrives damaged or if you believe you received a defective product, please contact us immediately upon receipt with photos of the damage or defect. We will work with you to find a suitable solution, which may include a replacement or a full refund.
              </li>
            </ul>
          </section>

          <p className="text-base leading-relaxed">
            At Herbs & Potions, your satisfaction is our priority. If you have any questions or concerns about our return policy, please don't hesitate to contact our customer support team. We're here to help you on your CBD journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPage;