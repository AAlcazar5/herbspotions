import { NextPage } from "next";
import Link from "next/link";
import React from "react";

const ReturnsPage: NextPage = () => {
  return (
    <div className="bg-background dark:bg-background text-muted-foreground dark:text-muted-foreground py-12 lg:py-24">
      <div className="container max-w-3xl px-6 lg:px-8 mx-auto">
        <h1 className="font-bold text-3xl mb-8 text-center text-foreground dark:text-foreground">
          Return and Exchange Policy
        </h1>
        <section className="mb-10">
          <h2 className="font-bold text-xl mb-3 text-foreground dark:text-foreground">Return Policy</h2>
          <p className="mb-6 text-base leading-relaxed">
            Before placing an order through our store, we recommend carefully
            researching the product you intend to purchase. If you would like any
            additional information about a product before making a purchase,
            please <Link href="/contact" className="text-green-500 dark:text-green-300 hover:underline">contact us</Link>. We are happy to help you find the perfect product.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-xl mb-3 text-foreground dark:text-foreground">New or Used Products</h2>
          <div className="mb-6 text-base leading-relaxed">
            All new or used products must meet the following conditions to be
            eligible for a refund or exchange:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                All Product(s)&nbsp;must be shipped back within 30 days of the
                original delivery date.
              </li>
              <li>
                New product(s)&nbsp;must be in original, unused and brand-new
                condition to receive a full refund.
              </li>
              <li>
                Used Product(s), that have been opened or have broken seals,
                must be in the original condition they were received and may be
                subject to restocking fees up to 40%. Additional fees of 10% may
                be imposed if accessories, parts or other items are missing from
                original packaging.&nbsp;
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-xl mb-3 text-foreground dark:text-foreground">Defective Products</h2>
          <p className="mb-6 text-base leading-relaxed">
            Customers are required to pay all shipping costs associated with a
            defective product return, unless the product was received not
            functioning at the time it was received by the customer. Otherwise,
            return shipping costs are the responsibility of the customer.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-xl mb-3 text-foreground dark:text-foreground">Missing / Damaged Items</h2>
          <p className="mb-6 text-base leading-relaxed">
            Any purchases containing damaged items or which are missing must be
            reported within 72 hours of delivery. Please <Link href="/contact" className="text-green-500 dark:text-green-300 hover:underline">contact us</Link> and we will
            take care of the issue immediately.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-xl mb-3 text-foreground dark:text-foreground">Return Instructions</h2>
          <div className="mb-6 space-y-4 text-base leading-relaxed"> {/* Added space-y-4 */}
            <p>
              All return packages must be processed by <Link href="/contact" className="text-green-500 dark:text-green-300 hover:underline">contacting us</Link>. This will
              ensure proper processing of your return. We are not responsible for
              items sent to us without notification. We reserve the right to refuse
              or deny any return and may request additional information as a
              condition of the return.
            </p>
            <p>
              All accessories and product component parts must be returned with the
              unit. If the returned unit is determined to be operating normally upon
              inspection, we will need to ship the same unit back at the
              customer&apos;s expense. Returns will not be processed if the
              conditions of our return policy are not fully met.
            </p>
            <p>
              Buyer must understand and agree to pay for all shipping costs
              associated with returning the item(s). This includes non-reimbursement
              of any expedited shipping services selected at the time of purchase.
              We strongly recommend you insure your package as we are not liable for
              any product(s) lost or damaged in transit. Please allow 2 weeks for
              the processing of your return once it has arrived at our facility.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-xl mb-3 text-foreground dark:text-foreground">Order Cancellations</h2>
          <p className="mb-6 text-base leading-relaxed">
            If you need to cancel your order for any reason, please <Link href="/contact" className="text-green-500 dark:text-green-300 hover:underline">contact us</Link>
            ASAP and we will try our best to accommodate your request if the order
            has not yet been shipped. If the order has already been shipped, you
            must follow the return procedure described above.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-xl mb-3 text-foreground dark:text-foreground">Notice</h2>
          <p className="mb-6 text-base leading-relaxed">
            We reserve the right to amend this Return Policy at any time by
            posting the amended terms on this page.
          </p>
        </section>

        <section className="mt-8 text-center">
          <p>
            Ready to start a return? <Link href="/return-request/request" className="text-green-500 dark:text-green-300 hover:underline font-semibold">Initiate a Return Request</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReturnsPage;